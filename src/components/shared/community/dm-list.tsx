// components/shared/community/dm-list.tsx
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { socket } from '@/lib/socket'
import type { DMConversation } from '@/types'
import { getUserById } from '@/actions/getUserById'
import { Input } from '@/components/ui/input'
import { Loader2, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface UserDetails {
  username: string
  avatarUrl: string | null
}

interface Props {
  onSelect: (
    conversation: DMConversation,
    otherUser: { userId: string; username: string; avatarUrl: string }
  ) => void
  activeConversationId?: string
}

export function DMList({ onSelect, activeConversationId }: Props) {
  const { user: currentUser } = useUser()
  const [conversations, setConversations] = useState<DMConversation[]>([])
  const [userDetails, setUserDetails] = useState<Record<string, UserDetails>>(
    {}
  )
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!currentUser) return

    const fetchUserDetails = async (userId: string): Promise<UserDetails> => {
      try {
        const u = await getUserById(userId)
        if (u && !('error' in u)) {
          return {
            username: u.username || 'Unknown User',
            avatarUrl: u.imageUrl || null,
          }
        }
      } catch {}
      return { username: 'Unknown User', avatarUrl: null }
    }

    const loadConversations = async (incoming: any) => {
      setLoading(true)

      // Normalize payload to an array
      const data: DMConversation[] = Array.isArray(incoming)
        ? incoming
        : Array.isArray(incoming.conversations)
          ? incoming.conversations
          : []

      // Now safe to filter and sort
      const yours = data.filter(
        (c) => c.user1Id === currentUser.id || c.user2Id === currentUser.id
      )
      const sorted = yours.sort(
        (a, b) =>
          new Date(b.lastMessageAt || 0).getTime() -
          new Date(a.lastMessageAt || 0).getTime()
      )
      setConversations(sorted)

      // Fetch other‐user details
      const detailsMap: Record<string, UserDetails> = {}
      for (const conv of sorted) {
        const otherId =
          conv.user1Id === currentUser.id ? conv.user2Id : conv.user1Id
        if (!detailsMap[otherId]) {
          detailsMap[otherId] = await fetchUserDetails(otherId)
        }
      }
      setUserDetails(detailsMap)
      setLoading(false)
    }

    socket.on('dm-conversations', loadConversations)
    socket.emit('get-dm-conversations')

    socket.on('new-dm-conversation', async (conv: DMConversation) => {
      if (conv.user1Id !== currentUser.id && conv.user2Id !== currentUser.id)
        return
      const otherId =
        conv.user1Id === currentUser.id ? conv.user2Id : conv.user1Id
      if (!userDetails[otherId]) {
        userDetails[otherId] = await fetchUserDetails(otherId)
        setUserDetails({ ...userDetails })
      }
      setConversations((prev) =>
        prev.some((c) => c.id === conv.id) ? prev : [conv, ...prev]
      )
    })

    socket.on('dm-updated', (updated: DMConversation) => {
      setConversations((prev) =>
        [updated, ...prev.filter((c) => c.id !== updated.id)].sort(
          (a, b) =>
            new Date(b.lastMessageAt || 0).getTime() -
            new Date(a.lastMessageAt || 0).getTime()
        )
      )
    })

    socket.on('dm-read', ({ conversationId }: { conversationId: string }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: '0' } : c
        )
      )
    })

    return () => {
      socket.off('dm-conversations', loadConversations)
      socket.off('new-dm-conversation')
      socket.off('dm-updated')
      socket.off('dm-read')
    }
  }, [currentUser])

  const handleSelect = (conv: DMConversation) => {
    if (!currentUser) return
    const otherId =
      conv.user1Id === currentUser.id ? conv.user2Id : conv.user1Id
    onSelect(conv, {
      userId: otherId,
      username: userDetails[otherId]?.username || 'Unknown User',
      avatarUrl: userDetails[otherId]?.avatarUrl || '',
    })
    socket.emit('mark-dm-read', { conversationId: conv.id })
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: '0' } : c))
    )
  }

  const filtered = searchQuery
    ? conversations.filter((c) => {
        const otherId = currentUser?.id === c.user1Id ? c.user2Id : c.user1Id
        const ud = userDetails[otherId]
        return (
          ud?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    : conversations

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 bg-main-background border-purple-border/50 text-white placeholder-[#878787] focus:ring-purple-400/30"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {filtered.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? 'No conversations match your search'
                  : 'No conversations yet'}
              </p>
            </div>
          ) : (
            filtered.map((conv) => {
              const otherId =
                conv.user1Id === currentUser?.id ? conv.user2Id : conv.user1Id
              const ud = userDetails[otherId] || {
                username: 'Unknown',
                avatarUrl: '',
              }
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelect(conv)}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a37] cursor-pointer transition-colors',
                    activeConversationId === conv.id && 'bg-[#2a2a37]'
                  )}
                >
                  <Avatar className="h-10 w-10">
                    {ud.avatarUrl && <AvatarImage src={ud.avatarUrl} />}
                    <AvatarFallback>
                      {ud.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{ud.username}</p>
                    {conv.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                    )}
                    {conv.lastMessageAt && (
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conv.lastMessageAt), {
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </div>
                  {Number.parseInt(conv.unreadCount || '0') > 0 && (
                    <div className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
