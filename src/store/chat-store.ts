import { create } from 'zustand'
import { Message, Chat } from '@/types'

interface ChatStore {
  chats: Chat[]
  currentChatId: string | null
  setCurrentChat: (chatId: string) => void
  addMessage: (chatId: string, message: Message) => void
  createNewChat: () => Promise<void>
  setChats: (chats: Chat[]) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  currentChatId: null,
  setCurrentChat: (chatId) => set({ currentChatId: chatId }),
  setChats: (chats) => set({ chats }),
  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      ),
    })),
  createNewChat: async () => {
    try {
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Chat' }),
      })

      if (!response.ok) throw new Error('Failed to create chat')

      const newChat = await response.json()
      set((state) => ({
        chats: [...state.chats, { ...newChat, messages: [] }],
        currentChatId: newChat.id,
      }))
    } catch (error) {
      console.error('Failed to create new chat:', error)
    }
  },
}))
