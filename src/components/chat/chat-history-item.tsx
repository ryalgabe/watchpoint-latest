'use client'

import { History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chat-store'
import { Chat } from '@/types'

interface ChatHistoryItemProps {
  chat: Chat
}

export function ChatHistoryItem({ chat }: ChatHistoryItemProps) {
  const { currentChatId, setCurrentChat } = useChatStore()

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start text-left p-4 hover:bg-[#15151E]/50 rounded-xl transition-all duration-200',
        currentChatId === chat.id && 'bg-[#15151E]/50 border-[#2E62E8]'
      )}
      onClick={() => setCurrentChat(chat.id)}
    >
      <History className="h-5 w-5 mr-3 text-[#2E62E8]" />
      <div className="flex-1 truncate">
        <p className="font-medium text-white truncate">{chat.title}</p>
        <p className="text-xs text-[#878787]">
          {new Date(chat.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Button>
  )
}
