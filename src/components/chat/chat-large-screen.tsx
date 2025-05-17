'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'
import { useChatStore } from '@/store/chat-store'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { ChatSidebar } from './chat-sidebar'

export function ChatLargeScreen() {
  const { currentChatId, createNewChat } = useChatStore()
  const [isTyping, setIsTyping] = useState(false)

  const { messages, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      chatId: currentChatId,
    },
    onResponse: () => {
      setIsTyping(false)
    },
    onFinish: () => {
      setIsTyping(false)
    },
  })

  const onSubmit = async (value: string) => {
    if (!currentChatId) {
      await createNewChat()
    }
    setIsTyping(true)
    try {
      // @eslint-disable-next-line @typescript-eslint/no-explicit-any
      await handleSubmit(new Event('submit') as any, {
        data: { content: value },
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsTyping(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#0B0B1A]">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, i) => (
            <ChatMessage
              key={message.id}
              message={message}
              isTyping={isTyping}
              isLast={i === messages.length - 1}
            />
          ))}
        </div>
        <div className="p-6 bg-[#0F0F23]/80 backdrop-blur-xl border-t border-[#2A2A37]">
          <ChatInput isLoading={isLoading} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  )
}
