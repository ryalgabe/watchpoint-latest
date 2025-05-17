import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Hash, Lock } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Channel } from '@/types'

interface ChannelListProps {
  channels: Channel[]
  activeChannel: Channel | null
  onSelectChannel: (channel: Channel) => void
}

export function ChannelList({
  channels,
  activeChannel,
  onSelectChannel,
}: ChannelListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-[#878787] uppercase tracking-wider px-2">
            Channels
          </h3>
        </div>
        <div className="space-y-[2px]">
          <TooltipProvider>
            {channels.map((channel) => (
              <Tooltip key={channel.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start px-2 py-1.5 h-auto text-sm rounded-md transition-colors ${
                      activeChannel?.id === channel.id
                        ? 'bg-[#2A2A37] text-white'
                        : 'text-[#878787] hover:text-white hover:bg-[#15151E]'
                    }`}
                    onClick={() => onSelectChannel(channel)}
                  >
                    {channel.isPrivate ? (
                      <Lock className="mr-2 h-4 w-4 shrink-0 text-[#878787]" />
                    ) : (
                      <Hash className="mr-2 h-4 w-4 shrink-0 text-[#878787]" />
                    )}
                    <span className="truncate">{channel.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-[#15151E] border-[#2A2A37] text-white"
                >
                  <p className="font-medium"># {channel.name}</p>
                  {channel.description && (
                    <p className="text-xs text-[#878787] mt-1">
                      {channel.description}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </ScrollArea>
  )
}
