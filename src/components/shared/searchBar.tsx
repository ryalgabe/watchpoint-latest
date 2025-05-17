import { Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SearchBar() {
  return (
    <div className="flex items-center gap-2 max-w-2xl w-full mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Look for a brand or a model..."
          className="w-full bg-zinc-900/50 border-zinc-800 pl-10 pr-4 h-10 text-sm text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-l-none hover:bg-zinc-800/50 transition-colors"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
