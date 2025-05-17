import { useEffect, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { socket } from '@/lib/socket'
import { useUser } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import { Loader2, MessageSquare, Search, X } from 'lucide-react'

// Define the Member type
interface Member {
  userId: string
  username: string
  avatarUrl: string
  status: string
  lastSeen?: string
}

interface SearchUser {
  id: string
  username: string
  imageUrl: string
}

interface MemberPanelProps {
  onUserClick?: (user: Member) => void
  onStartDM: (userId: string) => void
}

export function MemberPanel({ onUserClick, onStartDM }: MemberPanelProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { user: currentUser } = useUser()
  const [searchMode, setSearchMode] = useState<'online' | 'all'>('online')

  // Handle user list updates
  useEffect(() => {
    const handleUserList = (users: Member[]) => {
      setMembers(users)
    }

    socket.on('user-list-update', handleUserList)

    return () => {
      socket.off('user-list-update', handleUserList)
    }
  }, [])

  // Handle search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearchMode('online')
      return
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true)
      setSearchMode('all')

      try {
        // First search in online users
        const onlineMatches = members.filter((member) =>
          member.username.toLowerCase().includes(searchQuery.toLowerCase())
        )

        if (onlineMatches.length > 0) {
          setSearchResults(
            onlineMatches.map((member) => ({
              id: member.userId,
              username: member.username,
              imageUrl: member.avatarUrl,
            }))
          )
          setIsSearching(false)
          return
        }

        // If no online matches, search all users in database
        socket.emit('search-users', { query: searchQuery })

        // Set a timeout to handle potential socket response failures
        const timeoutId = setTimeout(() => {
          setIsSearching(false)
        }, 5000)

        socket.once('search-users-result', (results: Member[]) => {
          clearTimeout(timeoutId)
          setSearchResults(
            results.map((user) => ({
              id: user.userId,
              username: user.username,
              imageUrl: user.avatarUrl,
            }))
          )
          setIsSearching(false)
        })
      } catch (error) {
        console.error('Error searching users:', error)
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery, members])

  const handleStartDMClick = useCallback(
    (userId: string) => {
      onStartDM(userId)
      setSearchQuery('')
    },
    [onStartDM]
  )

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setSearchMode('online')
  }

  // Which users to show based on search mode
  const usersToShow =
    searchMode === 'online'
      ? members.filter((member) => member.userId !== currentUser?.id)
      : searchResults
          .filter((user) => user.id !== currentUser?.id)
          .map((user) => ({
            userId: user.id,
            username: user.username,
            avatarUrl: user.imageUrl,
            status: 'unknown',
          }))

  return (
    <div className="flex flex-col h-full">
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 bg-main-background border-purple-border/50 text-white placeholder-[#878787] focus:ring-purple-400/30"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="px-3 py-1 flex justify-between items-center">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {searchMode === 'online' ? 'Online Users' : 'Search Results'}
        </h3>
        {isSearching && (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        )}
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {usersToShow.length === 0 ? (
            <div className="text-center py-4">
              {searchQuery && !isSearching ? (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    No users found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Try a different search term
                  </p>
                </div>
              ) : searchMode === 'online' ? (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">
                    No users online
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check back later or search for all users
                  </p>
                </div>
              ) : (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                  <p className="text-sm text-muted-foreground">Searching...</p>
                </div>
              )}
            </div>
          ) : (
            usersToShow.map((member) => (
              <Popover key={member.userId}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-2 py-1 hover:bg-discord-hover"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback>
                            {member.username[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        {searchMode === 'online' && (
                          <div
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                              member.status === 'online'
                                ? 'bg-green-500'
                                : 'bg-gray-500'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="truncate w-full">
                          {member.username}
                        </span>
                        {searchMode === 'online' && (
                          <span className="text-xs text-muted-foreground">
                            {member.status === 'online' ? 'Online' : 'Offline'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback>
                        {member.username[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.username}</p>
                      {searchMode === 'online' && (
                        <p className="text-xs text-muted-foreground">
                          {member.status === 'online' ? 'Online' : 'Offline'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="default"
                      onClick={() => handleStartDMClick(member.userId)}
                      className="w-full"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
