'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatStore } from '@/store/chat-store'
import { ChatHistoryItem } from './chat-history-item'

export function ChatSidebar() {
  const { chats, createNewChat } = useChatStore()

  return (
    <div className="w-80 border-r border-[#2A2A37] bg-[#0F0F23]/80 backdrop-blur-xl">
      <div className="p-4">
        <Button
          onClick={() => createNewChat()}
          className="w-full bg-gradient-to-r from-[#2E62E8] to-[#1E50D5]"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-2 space-y-2">
          {chats.map((chat) => (
            <ChatHistoryItem key={chat.id} chat={chat} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
