import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Bookmark } from 'lucide-react'

interface WatchCardProps {
  name: string
  model: string
  percentage: number
  image: string
}

export function WatchCard({ name, model, percentage, image }: WatchCardProps) {
  return (
    <Card className="relative overflow-hidden bg-[#15151e] border-[#2a2a37]">
      <div className="flex p-4 gap-4">
        <div className="relative w-32 h-32">
          <Image
            src={image || '/watch1.png'}
            alt={name}
            width={128}
            height={128}
            className="w-full h-full object-contain"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#15151e]/20" />
        </div>

        <div className="flex flex-col flex-1 justify-between">
          <div className="space-y-0.5">
            <h3 className="font-semibold text-white">{name}</h3>
            <p className="text-sm text-secondary-text">{model}</p>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${percentage < 0 ? 'text-red-500' : 'text-emerald-500'}`}
              >
                {percentage < 0 ? percentage : '+' + percentage}%
              </span>
              <div className="h-1 flex-1 rounded-full bg-[#2a2a37]">
                <div
                  className={`h-1 rounded-full ${percentage < 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.abs(percentage)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start mt-2 space-y-1">
            <Button
              variant="link"
              size="sm"
              className="text-[#878787] hover:text-white p-0 h-fit"
            >
              <Eye className="h-4 w-4 mr-0.5 " />
              View Watch
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-[#878787] hover:text-white p-0 h-fit"
            >
              <Bookmark className="h-4 w-4 mr-0.5" />
              Add to favorite
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
