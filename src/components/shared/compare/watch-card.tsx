import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Heart, ArrowUpRight, ArrowDownRight, Watch } from 'lucide-react'

interface WatchCardProps {
  watch: {
    id: string
    brand: string
    model: string
    nickname?: string
    reference: string
    price: number
    change: number
    volume: number
    image: string
  }
  index: number
  total: number
  onRemove: () => void
}

export function WatchCard({ watch, index, total, onRemove }: WatchCardProps) {
  return (
    <Card className="bg-darkest/5 border-none overflow-hidden group p-4 pb-6">
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 rounded-full backdrop-blur-sm"
          onClick={onRemove}
        >
          <X className="w-4 h-4 text-darkest/30" />
        </Button>
        <div className="relative h-48 bg-none">
          <img
            src={watch.image || '/placeholder.svg'}
            alt={`${watch.brand} ${watch.model}`}
            className="w-full h-full object-contain p-3 pt-0 bg-gradient-to-b from-white/50 to-darkest/5 border-white rounded-3xl"
          />
          <div className="absolute inset-0 bg-none opacity-60" />
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary/5 text-darkest/50 backdrop-blur-sm border-none"
            >
              {index} of {total} watches
            </Badge>
        </div>
        <div className="flex items-start justify-between mt-4">
          <div className="flex gap-2">
          
            <h3 className="text-lg font-semibold mb-1 text-darkest">{watch.brand} {watch.model}</h3>
            <Watch className='text-darkest/70 w-5'></Watch>
            {watch.nickname && (
              
              <p className="text-lg text-darkest/80">{watch.nickname}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-icon rounded-full text-darkest/50 hover:text-none"
            // On click, fill text becomes red
            onClick={() => {
              const textElement = document.querySelector(
                '.h'
              ) as HTMLElement
              if (textElement) {
                textElement.getAttribute('fill') === 'transparent'
                  ? textElement.setAttribute('fill', 'red')
                  : textElement.setAttribute('fill', 'transparent')
                textElement.classList.toggle('text-red-500')
              }
            }}
          >
            <Heart className="h w-4 h-4" fill="transparent"/>
          </Button>
        </div>
        <div className="flex gap-3">
          <div>
            <p className="text-sm text-darkest/70">
              € {watch.price.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {watch.change >= 0 ? (
              <ArrowUpRight className="w-3 h-3 text-green-500/70" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500/70" />
            )}
            <span
              className={watch.change >= 0 ? 'text-green-500' : 'text-red-500'}
            >
              {watch.change}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
