import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowRight,
  Star,
  MoreHorizontal,
  MessageCircle,
  Edit,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const notifications = [
  {
    id: 1,
    user: 'Thomas Sanchez',
    message: 'New message',
    time: '1 hour ago',
    type: 'message',
  },
  {
    id: 2,
    user: 'Paul Dourmer',
    message: 'New comment',
    time: 'Yesterday',
    type: 'comment',
  },
  {
    id: 3,
    user: 'Patek Philippe Cubitus',
    message: 'New watch available',
    time: 'New watch available',
    type: 'product',
  },
  {
    id: 4,
    user: 'Jenna Sullivan',
    message: 'Left a review',
    time: '2 days ago',
    type: 'review',
  },
]

export function NotificationsCard({ className }: { className?: string }) {
  return (
    <Card
      className={`bg-[#0B0B1A] border-[#2A2A37] overflow-hidden flex flex-col ${className}`}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="font-medium">Notifications</CardTitle>
        <Select defaultValue="recent">
          <SelectTrigger className="w-[160px] h-8 text-xs bg-[#15151E] border-[#2A2A37]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#15151E] border-[#2A2A37] text-white">
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="important">Important</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 flex-1">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center p-2 hover:bg-[#15151E] rounded-md transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#15151E] flex items-center justify-center text-[#2E62E8]">
                {notification.type === 'message' && (
                  <MessageCircle className="h-4 w-4" />
                )}
                {notification.type === 'comment' && (
                  <Edit className="h-4 w-4" />
                )}
                {notification.type === 'product' && (
                  <Star className="h-4 w-4" />
                )}
                {notification.type === 'review' && (
                  <MessageCircle className="h-4 w-4" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{notification.user}</p>
                <p className="text-xs text-[#878787]">{notification.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#878787]">
                  {notification.time}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-[#2A2A37]"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-[#2E62E8] hover:text-[#2E62E8]/80 hover:bg-transparent font-medium"
        >
          <span>All notifications</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
