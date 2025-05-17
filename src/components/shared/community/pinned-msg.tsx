import { ScrollArea } from '@/components/ui/scroll-area'
import { Pin } from 'lucide-react'

const pinnedMessages = [
  {
    id: 1,
    content: 'Welcome to the community! Please read the rules before posting.',
    author: 'Admin',
  },
  {
    id: 2,
    content: 'Our next community event is on Friday at 7 PM EST.',
    author: 'Moderator',
  },
]

export function PinnedMessages() {
  return (
    <div className="bg-secondary-background border-b border-[#2a2a37] p-2">
      <ScrollArea className="h-20">
        <div className="space-y-2">
          {pinnedMessages.map((message) => (
            <button
              key={message.id}
              onClick={() => {
                document
                  .getElementById(`message-${message.id}`)
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex items-start space-x-2 text-sm w-full text-left hover:bg-[#2a2a37]/50 p-2 rounded-md transition-colors"
            >
              <Pin className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">{message.author}</p>
                <p className="text-[#878787]">{message.content}</p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
