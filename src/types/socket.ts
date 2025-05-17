import { Socket } from 'socket.io'
import { Channel, CommunityMessage, DMConversation, DirectMessage } from '.'

declare module 'socket.io-client' {
  interface Socket {
    userId?: string
    username?: string
  }
}

export interface SocketEvents {
  // User events
  register: (data: { userId: string; username: string }) => void
  'user-status': (data: {
    userId: string
    status: 'online' | 'offline'
  }) => void

  // Channel events
  'get-channels': () => void
  'channel-list': (channels: Channel[]) => void
  'join-channel': (data: { channelId: string }) => void
  'channel-history': (messages: CommunityMessage[]) => void
  'send-message': (data: {
    channelId: string
    content: string
    senderId: string
  }) => void
  message: (message: CommunityMessage) => void

  // DM events
  'get-dm-conversations': () => void
  'dm-conversations': (conversations: DMConversation[]) => void
  'start-dm': (data: { userId: string }) => void
  'dm-history': (messages: DirectMessage[]) => void
  'send-dm': (data: {
    conversationId: string
    content: string
    senderId: string
  }) => void
  'dm-message': (message: DirectMessage) => void
  'mark-read': (data: { messageId: string }) => void
  'message-read': (data: { messageId: string }) => void
}

export type CustomSocket = Socket<SocketEvents, SocketEvents, SocketEvents> & {
  userId?: string
  username?: string
}
