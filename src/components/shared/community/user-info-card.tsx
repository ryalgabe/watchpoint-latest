import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageSquare, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface UserInfoModalProps {
  userData: {
    userId: string
    username: string
    avatarUrl: string
    status: string
    lastSeen?: string
  }
  onClose: () => void
  onStartDM: (userId: string) => void
}

export function UserInfoModal({
  userData,
  onClose,
  onStartDM,
}: UserInfoModalProps) {
  const handleStartDM = () => {
    onStartDM(userData.userId)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background border rounded-lg shadow-lg w-80 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">User Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userData.avatarUrl} />
            <AvatarFallback>
              {userData.username[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h3 className="text-xl font-bold">{userData.username}</h3>
            <p className="text-sm text-muted-foreground">
              {userData.status === 'online'
                ? 'Online'
                : userData.lastSeen
                  ? `Last seen ${formatDistanceToNow(new Date(userData.lastSeen))} ago`
                  : 'Offline'}
            </p>
          </div>

          <Button className="w-full" onClick={handleStartDM}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    </div>
  )
}
