// server/index.ts
import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server as SocketIO } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { db } from './db'
import {
  communityChat,
  channels,
  users,
  dmConversations,
  directMessages,
} from '../src/db/schema'
import { and, or, eq, sql } from 'drizzle-orm'

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = new SocketIO(server, {
  cors: { origin: '*', methods: ['GET', 'POST'], credentials: true },
})

const PORT = process.env.PORT || 8002
const GENERAL_CHANNEL_ID = '00000000-0000-0000-0000-000000000000'
const onlineUsers = new Map<
  string,
  {
    userId: string
    username: string
    avatarUrl: string
    email: string
    socketId: string
  }
>()

app.get('/', (req, res) => {
  res.send('Hi but why are you here?')
})

app.get('/ping', (req, res) => {
  res.send('pong')
})

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  //
  // 1) REGISTER USER
  //
  socket.on('register-user', async (userData) => {
    try {
      // persist Clerk ID on socket
      socket.data.userId = userData.clerkId
      const userId = socket.data.userId!

      console.log('Registering or fetching user:', userData)

      // create user record if needed
      const existing = await db.query.users.findFirst({
        where: eq(users.clerkId, userId),
      })
      if (!existing) {
        await db.insert(users).values({
          id: userId,
          clerkId: userId,
          email: userData.email || `${userData.username}@watchpoint.com`,
          name: userData.name || userData.username,
          username: userData.username,
          imageUrl: userData.avatarUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
          onboardingCompleted: false,
          isPremium: false,
        })
      }

      // remove stale socket
      for (const [sid, u] of onlineUsers) {
        if (u.userId === userId) onlineUsers.delete(sid)
      }

      // add to online map
      onlineUsers.set(socket.id, {
        socketId: socket.id,
        userId,
        username: userData.username,
        avatarUrl: userData.avatarUrl,
        email: userData.email,
      })

      // join the general channel
      socket.join(GENERAL_CHANNEL_ID)

      // broadcast updated online list
      io.emit('user-list-update', Array.from(onlineUsers.values()))

      // fetch DM conversations for this user
      const convos = await db.query.dmConversations.findMany({
        where: or(
          eq(dmConversations.user1Id, userId),
          eq(dmConversations.user2Id, userId)
        ),
        orderBy: (fields) => fields.lastMessageAt,
      })

      // attach otherUser info
      const detailed = await Promise.all(
        convos.map(async (c) => {
          const otherId = c.user1Id === userId ? c.user2Id : c.user1Id
          const other = await db.query.users.findFirst({
            where: eq(users.id, otherId),
          })
          return {
            ...c,
            otherUser: {
              userId: otherId,
              username: other?.username || 'Unknown',
              avatarUrl: other?.imageUrl || '',
            },
          }
        })
      )

      socket.emit('dm-conversations', detailed)
    } catch (err) {
      console.error('register-user error', err)
      socket.emit('registration-error', { error: 'Registration failed' })
    }
  })

  //
  // 2) JOIN A ROOM (CHANNEL or DM)
  //
  socket.on('join-channel', async ({ channelId }: { channelId: string }) => {
    const userId = socket.data.userId as string | undefined
    if (!userId) return socket.emit('error', 'Not registered')

    // check if channelId is a DM convo
    const conv = await db.query.dmConversations.findFirst({
      where: eq(dmConversations.id, channelId),
    })
    if (conv) {
      // must be participant
      if (conv.user1Id !== userId && conv.user2Id !== userId) {
        return socket.emit('error', 'Unauthorized to join this DM')
      }
      // join & emit DM history
      socket.join(channelId)
      const msgs = await db.query.directMessages.findMany({
        where: eq(directMessages.conversationId, channelId),
        orderBy: (f) => f.createdAt,
      })
      socket.emit('dm-history', {
        conversationId: channelId,
        messages: msgs.map((m) => ({
          id: m.id,
          conversationId: m.conversationId,
          senderId: m.senderId,
          content: m.content,
          createdAt: m.createdAt?.toISOString() || new Date().toISOString(),
          status: 'delivered',
        })),
      })
    } else {
      // community channel
      socket.join(channelId)
      const msgs = await db
        .select()
        .from(communityChat)
        .where(eq(communityChat.channelId, channelId))
        .orderBy(communityChat.createdAt)
      socket.emit('channel-history', {
        channelId,
        messages: msgs.map((m) => ({
          id: m.id,
          channelId: m.channelId.toString(),
          userId: m.userId,
          content: m.content,
          createdAt: m.createdAt?.toISOString() || new Date().toISOString(),
          status: 'delivered',
        })),
      })
    }
  })

  //
  // 3) SEND COMMUNITY MESSAGE
  //
  socket.on('send-message', async ({ channelId, content, tempId }) => {
    try {
      const user = onlineUsers.get(socket.id)
      if (!user) throw new Error('User not online')

      // validate channel exists
      const ch = await db.query.channels.findFirst({
        where: eq(channels.id, channelId),
      })
      if (!ch && channelId !== GENERAL_CHANNEL_ID) {
        throw new Error('Channel not found')
      }

      const dbMsg = {
        id: uuidv4(),
        channelId,
        userId: user.userId,
        content,
        createdAt: new Date(),
      }
      await db.insert(communityChat).values(dbMsg)

      const out = {
        ...dbMsg,
        username: user.username,
        avatarUrl: user.avatarUrl,
        createdAt: dbMsg.createdAt.toISOString(),
        status: 'delivered',
        tempId,
      }

      // emit to all in that channel
      io.to(channelId).emit('receive-message', out)
      socket.emit('message-sent', { tempId, message: out })
    } catch (err) {
      console.error('send-message error', err)
      socket.emit('message-error', { tempId, error: 'Failed to send' })
    }
  })

  //
  // 4) START OR RESUME A DM
  //
  socket.on('start-dm', async ({ userId: otherId }: { userId: string }) => {
    const me = socket.data.userId as string | undefined
    if (!me || me === otherId) return

    // find existing or create
    let conv = await db.query.dmConversations.findFirst({
      where: or(
        and(
          eq(dmConversations.user1Id, me),
          eq(dmConversations.user2Id, otherId)
        ),
        and(
          eq(dmConversations.user1Id, otherId),
          eq(dmConversations.user2Id, me)
        )
      ),
    })
    if (!conv) {
      const [newC] = await db
        .insert(dmConversations)
        .values({ user1Id: me, user2Id: otherId })
        .returning()
      conv = newC
    }

    // fetch history & otherUser
    const msgs = await db.query.directMessages.findMany({
      where: eq(directMessages.conversationId, conv.id),
      orderBy: (f) => f.createdAt,
    })
    const other = await db.query.users.findFirst({
      where: eq(users.id, otherId),
    })

    socket.emit('dm-started', {
      conversation: conv,
      messages: msgs.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        content: m.content,
        createdAt: m.createdAt?.toISOString() || new Date().toISOString(),
        status: 'delivered',
      })),
      otherUser: {
        userId: otherId,
        username: other?.username || 'Unknown',
        avatarUrl: other?.imageUrl || '',
      },
    })
  })

  //
  // 5) SEND A DM MESSAGE
  //
  socket.on(
    'send-dm',
    async ({
      conversationId,
      content,
      tempId,
    }: {
      conversationId: string
      content: string
      tempId: string
    }) => {
      try {
        const me = socket.data.userId as string | undefined
        if (!me) throw new Error('Not registered')

        // ensure convo and membership
        const conv = await db.query.dmConversations.findFirst({
          where: and(
            eq(dmConversations.id, conversationId),
            or(eq(dmConversations.user1Id, me), eq(dmConversations.user2Id, me))
          ),
        })
        if (!conv) throw new Error('Unauthorized')

        // insert message
        const dmMsg = {
          id: uuidv4(),
          conversationId,
          senderId: me,
          content,
          createdAt: new Date(),
          read: false,
        }
        await db.insert(directMessages).values(dmMsg)

        // update convo metadata
        await db
          .update(dmConversations)
          .set({
            lastMessage: content,
            lastMessageAt: new Date(),
            unreadCount: (parseInt(conv.unreadCount || '0') + 1).toString(),
          })
          .where(eq(dmConversations.id, conversationId))

        const out = {
          ...dmMsg,
          createdAt: dmMsg.createdAt.toISOString(),
          status: 'delivered',
          tempId,
        }

        // emit only to that convo
        io.to(conversationId).emit('receive-dm', out)
        socket.emit('message-sent', { tempId, message: out })
        io.to(conversationId).emit('dm-updated', {
          ...conv,
          lastMessage: content,
          lastMessageAt: new Date(),
        })
      } catch (err) {
        console.error('send-dm error', err)
        socket.emit('message-error', { tempId, error: 'Failed to send DM' })
      }
    }
  )

  //
  // 6) MARK DM AS READ
  //
  socket.on(
    'mark-dm-read',
    async ({ conversationId }: { conversationId: string }) => {
      try {
        await db
          .update(dmConversations)
          .set({ unreadCount: '0' })
          .where(eq(dmConversations.id, conversationId))

        // notify other participant
        const me = socket.data.userId as string | undefined
        if (!me) return
        const conv = await db.query.dmConversations.findFirst({
          where: eq(dmConversations.id, conversationId),
        })
        if (!conv) return

        const other = conv.user1Id === me ? conv.user2Id : conv.user1Id
        // find that socket
        for (const [sid, u] of onlineUsers) {
          if (u.userId === other) {
            io.to(sid).emit('dm-read', { conversationId })
            break
          }
        }
      } catch (err) {
        console.error('mark-dm-read error', err)
      }
    }
  )

  //
  // 7) FETCH DM CONVERSATIONS
  //
  socket.on('get-dm-conversations', async () => {
    try {
      const me = socket.data.userId as string | undefined
      if (!me) return
      const convos = await db.query.dmConversations.findMany({
        where: or(
          eq(dmConversations.user1Id, me),
          eq(dmConversations.user2Id, me)
        ),
        orderBy: (f) => f.lastMessageAt,
      })
      const detailed = await Promise.all(
        convos.map(async (c) => {
          const otherId = c.user1Id === me ? c.user2Id : c.user1Id
          const other = await db.query.users.findFirst({
            where: eq(users.id, otherId),
          })
          return {
            ...c,
            otherUser: {
              userId: otherId,
              username: other?.username || 'Unknown',
              avatarUrl: other?.imageUrl || '',
            },
          }
        })
      )
      socket.emit('dm-conversations', detailed)
    } catch (err) {
      console.error('get-dm-conversations error', err)
      socket.emit('dm-error', { error: 'Could not fetch DM list' })
    }
  })

  //
  // 8) SEARCH USERS (for starting a DM)
  //
  socket.on('search-users', async ({ query }: { query: string }) => {
    try {
      const found = await db.query.users.findMany({
        where: sql`${users.username} ILIKE ${'%' + query + '%'}`,
        limit: 10,
      })
      const onlineIds = new Set(
        Array.from(onlineUsers.values()).map((u) => u.userId)
      )
      socket.emit(
        'search-users-result',
        found.map((u) => ({
          userId: u.id,
          username: u.username!,
          avatarUrl: u.imageUrl || '',
          status: onlineIds.has(u.id) ? 'online' : 'offline',
        }))
      )
    } catch (err) {
      console.error('search-users error', err)
      socket.emit('search-users-result', [])
    }
  })

  //
  // 9) DISCONNECT
  //
  socket.on('disconnect', () => {
    const u = onlineUsers.get(socket.id)
    if (u) {
      onlineUsers.delete(socket.id)
      io.emit('user-list-update', Array.from(onlineUsers.values()))
      console.log('User disconnected:', u.username)
    }
  })
})

server.listen(PORT, () =>
  console.log(`WebSocket server running on port ${PORT}`)
)
