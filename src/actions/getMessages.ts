'use server'

import { db } from '@/db'
import { communityChat, directMessages, dmConversations } from '@/db/schema'
import { eq, and, or } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'

export async function getMessages(channelId: string, isDM: boolean) {
  const user = await currentUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  if (isDM) {
    // Ensure only participants can fetch DM history
    const conv = await db.query.dmConversations.findFirst({
      where: and(
        eq(dmConversations.id, channelId),
        or(
          eq(dmConversations.user1Id, user.id),
          eq(dmConversations.user2Id, user.id)
        )
      ),
    })
    if (!conv) {
      throw new Error('Unauthorized')
    }

    const messages = await db.query.directMessages.findMany({
      where: eq(directMessages.conversationId, channelId),
      orderBy: (fields) => fields.createdAt,
    })

    return messages.map((msg) => ({
      id: msg.id,
      channelId: msg.conversationId,
      userId: msg.senderId,
      content: msg.content,
      createdAt: msg.createdAt?.toISOString(),
      status: 'delivered',
    }))
  }

  // Community channel
  const msgs = await db
    .select()
    .from(communityChat)
    .where(eq(communityChat.channelId, channelId))
    .orderBy(communityChat.createdAt)

  return msgs.map((msg) => ({
    id: msg.id,
    channelId: msg.channelId.toString(),
    userId: msg.userId,
    content: msg.content,
    createdAt: msg.createdAt?.toISOString(),
    status: 'delivered',
  }))
}
