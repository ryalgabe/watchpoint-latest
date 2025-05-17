'use client'

import { useEffect, useState } from 'react'
import { socket } from '@/lib/socket'
import { Loader2 } from 'lucide-react'

interface TypingIndicatorProps {
  conversationId: string
  isDM: boolean
}

export function TypingIndicator({
  conversationId,
  isDM,
}: TypingIndicatorProps) {
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  useEffect(() => {
    const handleTypingStart = ({
      userId,
      username,
      channelId,
    }: {
      userId: string
      username: string
      channelId: string
    }) => {
      if (channelId === conversationId) {
        setTypingUsers((prev) => {
          if (prev.includes(username)) return prev
          return [...prev, username]
        })
      }
    }

    const handleTypingStop = ({
      userId,
      username,
      channelId,
    }: {
      userId: string
      username: string
      channelId: string
    }) => {
      if (channelId === conversationId) {
        setTypingUsers((prev) => prev.filter((name) => name !== username))
      }
    }

    socket.on('user-typing', handleTypingStart)
    socket.on('user-stopped-typing', handleTypingStop)

    return () => {
      socket.off('user-typing', handleTypingStart)
      socket.off('user-stopped-typing', handleTypingStop)
    }
  }, [conversationId])

  if (typingUsers.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border-t border-discord-border bg-main-background/50">
      <Loader2 className="h-3 w-3 animate-spin" />
      <span>
        {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'}{' '}
        typing...
      </span>
    </div>
  )
}
