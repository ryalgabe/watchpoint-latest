// components/chat-area.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Check, Clock, AlertCircle, Loader2, MessageSquare } from 'lucide-react'
import { getUserById } from '@/actions/getUserById'

async function fetchUser(userId: string) {
  const u = await getUserById(userId)
  if (!u || 'error' in u) return { username: 'Unknown', avatarUrl: '' }
  return { username: u.username, avatarUrl: u.imageUrl || '' }
}

interface Message {
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

interface Props {
  messages: Message[]
  currentUserId?: string
  typingUsers?: string[]
  isLoading?: boolean
}

function MessageStatus({ status }: { status?: string }) {
  if (!status) return null
  return (
    <span className="ml-2 text-xs flex items-center gap-1 text-gray-400">
      {status === 'sending' && <Clock className="h-3 w-3" />}
      {status === 'delivered' && <Check className="h-3 w-3 text-green-500" />}
      {status === 'failed' && (
        <span className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3 text-red-500" />
          Failed to send
        </span>
      )}
    </span>
  )
}

export function ChatArea({
  messages,
  currentUserId,
  typingUsers = [],
  isLoading = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [userCache, setUserCache] = useState<
    Record<string, { username: string; avatarUrl: string }>
  >({})

  // auto-scroll on new
  useEffect(() => {
    const t = setTimeout(
      () => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }),
      50
    )
    return () => clearTimeout(t)
  }, [messages])

  // fetch missing details
  useEffect(() => {
    const ids = Array.from(
      new Set(
        messages
          .filter((m) => !m.username && !userCache[m.userId])
          .map((m) => m.userId)
      )
    )
    if (!ids.length) return
    Promise.all(ids.map(fetchUser)).then((arr) => {
      const upd: any = {}
      ids.forEach((id, i) => (upd[id] = arr[i]))
      setUserCache((prev) => ({ ...prev, ...upd }))
    })
  }, [messages])

  // group by sender + 5min
  const groups = messages.reduce((out: Message[][], msg) => {
    const last = out[out.length - 1]
    if (
      !last ||
      last[0].userId !== msg.userId ||
      new Date(msg.createdAt).getTime() -
        new Date(last[last.length - 1].createdAt).getTime() >
        5 * 60 * 1000
    )
      out.push([msg])
    else last.push(msg)
    return out
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="text-center max-w-md p-6 rounded-lg border border-border/30">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
          <h3 className="text-xl font-medium mb-2">No messages yet</h3>
          <p className="text-sm text-muted-foreground">
            Start with your first message
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {groups.map((grp, i) => {
          const first = grp[0]
          const user = first.username
            ? { username: first.username, avatarUrl: first.avatarUrl || '' }
            : userCache[first.userId] || { username: 'Unknown', avatarUrl: '' }
          return (
            <div key={i} className="flex flex-col">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                  <AvatarFallback>
                    {user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-semibold text-sm">{user.username}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    {new Date(first.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <div className="ml-10 pl-2 border-l border-gray-700 space-y-1">
                {grp.map((m, idx) => (
                  <div key={m.id || m.tempId || idx} className="flex flex-col">
                    <p className="text-sm text-gray-100">{m.content}</p>
                    {m.userId === currentUserId && (
                      <MessageStatus status={m.status} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-400">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'}{' '}
            typing…
          </div>
        )}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  )
}
