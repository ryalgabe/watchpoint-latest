import { Plus, MoreVertical, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { watches } from '@/constants'

export function WatchCollection() {
  return (
    <SidebarGroup>
      <div className="flex items-center justify-between mb-3">
        <SidebarGroupLabel className="text-[#878787] m-0">
          Your Collections
        </SidebarGroupLabel>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 text-[#878787] hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1">
        {watches.map((watch) => (
          <div
            key={watch.id}
            className="group relative flex items-center gap-3 rounded-lg bg-[#15151e] p-3 hover:bg-[#2a2a37] transition-colors border border-purple-border"
          >
            <Image
              src={watch.image || '/placeholder.svg'}
              alt={watch.name}
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {watch.name}
              </p>
              <p className="text-xs text-[#878787] truncate">{watch.model}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#878787] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-[#2a2a37] border-[#3a3a47] text-white"
              >
                <DropdownMenuItem className="hover:bg-[#3a3a47] focus:bg-[#3a3a47]">
                  Edit Watch
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#3a3a47] focus:bg-[#3a3a47]">
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 hover:bg-[#3a3a47] focus:bg-[#3a3a47]">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Watch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-white mt-3 border border-[#2a2a37] p-3 hover:bg-[#2a2a37]"
      >
        <Plus className="w-4 h-4" />
        Add a new watch
        <span className="ml-auto text-xs text-[#878787]">3/10</span>
      </Button>
    </SidebarGroup>
  )
}
