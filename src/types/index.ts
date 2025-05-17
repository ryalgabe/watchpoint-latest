export interface Message {
  id: string
  content: string
  role: 'assistant' | 'user'
  timestamp: Date
  isLoading?: boolean
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface CommunityMessage {
  id: string
  channelId: string
  userId: string
  content: string
  createdAt: Date | null
  status?: 'sent' | 'delivered' | 'read' | 'sending'
}

export interface Channel {
  id: string
  name: string
  description: string
  isPrivate: boolean | null
  createdAt: Date | null
}

export interface DMConversation {
  id: string
  user1Id: string
  user2Id: string
  lastMessageAt: Date | null
  lastMessage: string | null
  unreadCount: string | null
}

export interface DirectMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: Date | null
  read: boolean | null
}

export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  avatarUrl: string | null
}
