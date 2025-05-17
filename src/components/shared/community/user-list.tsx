'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { socket } from '@/lib/socket'

interface OnlineUser {
  userId: string
  username: string
  avatarUrl: string
  socketId: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
}

export function UserList() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])

  useEffect(() => {
    const handleUserListUpdate = (users: OnlineUser[]) => {
      // Deduplicate using userId as the key
      const uniqueUsers = users.reduce((acc: OnlineUser[], curr) => {
        if (!acc.find((user) => user.userId === curr.userId)) {
          acc.push(curr)
        }
        return acc
      }, [])
      setOnlineUsers(uniqueUsers)
    }

    socket.on('user-list-update', handleUserListUpdate)
    return () => {
      socket.off('user-list-update', handleUserListUpdate)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">
          Online — {onlineUsers.length}
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {onlineUsers.map((user) => (
            <div
              key={user.userId}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-800"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>
                  {user.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-white truncate">
                {user.username}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
