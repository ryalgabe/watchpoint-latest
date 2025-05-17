// components/chat-layout.tsx
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { socket, ensureSocketConnected } from '@/lib/socket'
import { ChannelList } from './channel-list'
import { ChatArea } from './chat-area'
import { MessageInput } from './message-input'
import { DMList } from './dm-list'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Hash, X, Menu } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { MemberPanel } from './member-panel'
import { UserInfoModal } from './user-info-card'
import { v4 as uuidv4 } from 'uuid'
import type { Channel, DMConversation } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { TypingIndicator } from './typing-indicator'
import { toast } from 'sonner'

export interface CommunityMessage {
  id: string
  channelId: string
  userId: string
  content: string
  username?: string
  avatarUrl?: string
  createdAt: string
  tempId?: string
  status?: 'sending' | 'sent' | 'delivered' | 'failed'
}

interface DMMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
  status: 'sending' | 'sent' | 'error' | 'delivered'
  username: string | null
  avatarUrl: string | null
  tempId?: string
}

const STATIC_CHANNELS: Channel[] = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'general',
    description: 'General discussion about watches',
    isPrivate: false,
    createdAt: new Date(),
  },
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'market-talk',
    description: 'Discuss market trends and prices',
    isPrivate: false,
    createdAt: new Date(),
  },
]

export function ChatLayout() {
  const { user } = useUser()
  const [messages, setMessages] = useState<CommunityMessage[]>([])
  const [dmMessages, setDmMessages] = useState<DMMessage[]>([])
  const [activeChannel, setActiveChannel] = useState<Channel>(
    STATIC_CHANNELS[0]
  )
  const [activeTab, setActiveTab] = useState<'channels' | 'dms'>('channels')
  const [showMembers, setShowMembers] = useState(true)
  const [showMobileMembers, setShowMobileMembers] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const socketInit = useRef(false)
  const [isLoading, setIsLoading] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<
    { userId: string; username: string; avatarUrl: string; status: string }[]
  >([])
  const [isInDM, setIsInDM] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const [activeDM, setActiveDM] = useState<{
    conversationId: string
    otherUser: { userId: string; username: string; avatarUrl: string }
  } | null>(null)

  // ---- Initialize Socket ----
  useEffect(() => {
    if (!user || socketInit.current) return
    ensureSocketConnected()
    socketInit.current = true

    socket.emit('register-user', {
      clerkId: user.id,
      username: user.username || user.fullName || 'User',
      avatarUrl: user.imageUrl || '',
      email: user.emailAddresses[0]?.emailAddress || '',
      name: user.fullName || user.username || 'User',
    })

    // join default channel on connect
    socket.emit('join-channel', { channelId: STATIC_CHANNELS[0].id })
  }, [user])

  // ---- Socket Event Handlers ----
  useEffect(() => {
    if (!user) return

    // Community message
    const onMessage = (msg: CommunityMessage) => {
      if (!isInDM && msg.channelId === activeChannel.id) {
        setMessages((prev) => {
          // dedupe by id/tempId
          if (prev.some((m) => m.id === msg.id || m.tempId === msg.tempId)) {
            return prev.map((m) =>
              m.tempId === msg.tempId ? { ...msg, status: 'delivered' } : m
            )
          }
          return [...prev, msg]
        })
      }
    }
    const onChannelHistory = ({
      channelId,
      messages: hist,
    }: {
      channelId: string
      messages: CommunityMessage[]
    }) => {
      if (!isInDM && channelId === activeChannel.id) {
        setMessages(hist)
        setIsLoading(false)
      }
    }

    // DM message
    const onDM = (msg: DMMessage) => {
      if (isInDM && activeDM?.conversationId === msg.conversationId) {
        setDmMessages((prev) => {
          if (prev.some((m) => m.id === msg.id || m.tempId === msg.tempId)) {
            return prev.map((m) =>
              m.tempId === msg.tempId ? { ...msg, status: 'delivered' } : m
            )
          }
          return [...prev, msg]
        })
      }
    }
    const onDMHistory = ({
      conversationId,
      messages: hist,
    }: {
      conversationId: string
      messages: DMMessage[]
    }) => {
      if (isInDM && activeDM?.conversationId === conversationId) {
        setDmMessages(hist)
        setIsLoading(false)
      }
    }

    // after server ack
    const onSent = ({ tempId, message }: { tempId: string; message: any }) => {
      if (isInDM) {
        setDmMessages((prev) =>
          prev.map((m) =>
            m.tempId === tempId ? { ...message, status: 'delivered' } : m
          )
        )
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.tempId === tempId ? { ...message, status: 'delivered' } : m
          )
        )
      }
      setIsSendingMessage(false)
    }
    const onError = ({ tempId }: { tempId: string }) => {
      const updater = (m: any) =>
        m.tempId === tempId ? { ...m, status: isInDM ? 'error' : 'failed' } : m

      if (isInDM) setDmMessages((prev) => prev.map(updater))
      else setMessages((prev) => prev.map(updater))

      setIsSendingMessage(false)
      toast.error('Message failed, please retry.')
    }

    // DM started (new or existing)
    const onDMStarted = ({ conversation, messages: hist, otherUser }: any) => {
      setActiveDM({ conversationId: conversation.id, otherUser })
      setDmMessages(hist)
      setIsLoading(false)
      setIsInDM(true)
      setActiveChannel({
        id: conversation.id,
        name: otherUser.username,
        isPrivate: true,
        description: '',
        createdAt: new Date(),
      })
    }

    // online users
    const onUserList = (list: any[]) => setOnlineUsers(list)

    // typing
    const onTyping = (p: { username: string; channelId: string }) => {
      if (
        (isInDM && p.channelId === activeDM?.conversationId) ||
        (!isInDM && p.channelId === activeChannel.id)
      ) {
        setTypingUsers((prev) =>
          prev.includes(p.username) ? prev : [...prev, p.username]
        )
      }
    }
    const onStopTyping = (p: { username: string; channelId: string }) => {
      if (
        (isInDM && p.channelId === activeDM?.conversationId) ||
        (!isInDM && p.channelId === activeChannel.id)
      ) {
        setTypingUsers((prev) => prev.filter((u) => u !== p.username))
      }
    }

    socket
      .on('receive-message', onMessage)
      .on('channel-history', onChannelHistory)
      .on('receive-dm', onDM)
      .on('dm-history', onDMHistory)
      .on('message-sent', onSent)
      .on('message-error', onError)
      .on('user-list-update', onUserList)
      .on('dm-started', onDMStarted)
      .on('user-typing', onTyping)
      .on('user-stopped-typing', onStopTyping)

    return () => {
      socket
        .off('receive-message', onMessage)
        .off('channel-history', onChannelHistory)
        .off('receive-dm', onDM)
        .off('dm-history', onDMHistory)
        .off('message-sent', onSent)
        .off('message-error', onError)
        .off('user-list-update', onUserList)
        .off('dm-started', onDMStarted)
        .off('user-typing', onTyping)
        .off('user-stopped-typing', onStopTyping)
    }
  }, [user, isInDM, activeChannel, activeDM])

  // ---- Actions ----

  const handleStartDM = (otherUserId: string) => {
    if (!user) return
    setIsLoading(true)
    socket.emit('start-dm', { userId: otherUserId, currentUserId: user.id })
    setActiveTab('dms')
  }

  const handleSendMessage = (content: string) => {
    if (!user || !content.trim() || isSendingMessage) return
    setIsSendingMessage(true)
    const tempId = uuidv4()
    if (isInDM && activeDM) {
      const msg: DMMessage = {
        id: tempId,
        conversationId: activeDM.conversationId,
        senderId: user.id,
        content,
        createdAt: new Date().toISOString(),
        status: 'sending',
        username: user.username || null,
        avatarUrl: user.imageUrl || null,
        tempId,
      }
      setDmMessages((prev) => [...prev, msg])
      socket.emit('send-dm', {
        conversationId: activeDM.conversationId,
        content,
        tempId,
      })
    } else {
      const msg: CommunityMessage = {
        id: tempId,
        channelId: activeChannel.id,
        userId: user.id,
        content,
        username: user.username || user.fullName || 'Anonymous',
        avatarUrl: user.imageUrl || '',
        createdAt: new Date().toISOString(),
        status: 'sending',
        tempId,
      }
      setMessages((prev) => [...prev, msg])
      socket.emit('send-message', { ...msg })
    }
  }

  const handleChannelSelect = useCallback(
    (channel: Channel) => {
      if (channel.id === activeChannel.id) return
      setIsLoading(true)
      setIsInDM(false)
      setActiveDM(null)
      setActiveChannel(channel)
      setMessages([])
      setTypingUsers([])
      socket.emit('join-channel', { channelId: channel.id })
      setActiveTab('channels')
    },
    [activeChannel]
  )

  const handleDMSelect = useCallback(
    (
      conversation: DMConversation,
      other: { userId: string; username: string; avatarUrl: string }
    ) => {
      setIsLoading(true)
      setIsInDM(true)
      setActiveTab('dms')
      setActiveDM({ conversationId: conversation.id, otherUser: other })
      setDmMessages([])
      setTypingUsers([])
      socket.emit('join-channel', { channelId: conversation.id })
      socket.emit('mark-dm-read', { conversationId: conversation.id })
    },
    []
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-main-background text-white">
      {/* mobile nav omitted for brevity… same structure */}
      {/* left sidebar (Channels / DMs) */}
      <div className="hidden md:flex flex-col w-64 border-r border-discord-border">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'channels' | 'dms')}
        >
          <TabsList className="flex bg-main-background">
            <TabsTrigger
              value="channels"
              className="flex-1 py-2 hover:bg-discord-hover"
            >
              Channels
            </TabsTrigger>
            <TabsTrigger
              value="dms"
              className="flex-1 py-2 hover:bg-discord-hover"
            >
              DMs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="channels" className="h-[calc(100%-40px)]">
            <ChannelList
              channels={STATIC_CHANNELS}
              activeChannel={activeChannel}
              onSelectChannel={handleChannelSelect}
            />
          </TabsContent>
          <TabsContent value="dms" className="h-[calc(100%-40px)]">
            <DMList
              onSelect={handleDMSelect}
              activeConversationId={
                isInDM ? activeDM?.conversationId : undefined
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* chat area */}
      <div className="flex-1 flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-discord-border">
          {isInDM && activeDM ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activeDM.otherUser.avatarUrl} />
                <AvatarFallback>
                  {activeDM.otherUser.username[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold">
                  {activeDM.otherUser.username}
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {/* online/offline */}
                  {onlineUsers.some(
                    (u) => u.userId === activeDM.otherUser.userId
                  ) ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      Online
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                      Offline
                    </>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-discord-brand" />
              <div>
                <h1 className="text-lg font-semibold">{activeChannel.name}</h1>
                <p className="text-xs text-muted-foreground">
                  Community Channel
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMembers((m) => !m)}
              className="hidden md:block rounded-full"
            >
              <Users className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto">
          {isInDM ? (
            <ChatArea
              messages={dmMessages.map((m) => ({
                id: m.id,
                channelId: m.conversationId,
                userId: m.senderId,
                content: m.content,
                username: m.username || undefined,
                avatarUrl: m.avatarUrl || undefined,
                createdAt: m.createdAt,
                tempId: m.tempId,
                status: m.status === 'error' ? 'failed' : (m.status as any),
              }))}
              currentUserId={user?.id}
              typingUsers={typingUsers}
              isLoading={isLoading}
            />
          ) : (
            <ChatArea
              messages={messages}
              currentUserId={user?.id}
              typingUsers={typingUsers}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* typing indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator
            conversationId={
              isInDM ? activeDM?.conversationId! : activeChannel.id
            }
            isDM={isInDM}
          />
        )}

        {/* input */}
        <div className="p-4 border-t border-discord-border">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isSendingMessage}
            placeholder={
              isInDM
                ? `Message @${activeDM?.otherUser.username}`
                : `Message #${activeChannel.name}`
            }
            conversationId={
              isInDM ? activeDM?.conversationId! : activeChannel.id
            }
            isDM={isInDM}
          />
        </div>
      </div>

      {/* members panel */}
      {showMembers && (
        <div className="hidden md:flex flex-col w-64 border-l border-discord-border">
          <MemberPanel
            onUserClick={setSelectedUser}
            onStartDM={handleStartDM}
          />
        </div>
      )}
      {selectedUser && (
        <UserInfoModal
          userData={selectedUser}
          onClose={() => setSelectedUser(null)}
          onStartDM={handleStartDM}
        />
      )}
    </div>
  )
}
