import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

interface DealerPostProps {
  post: {
    id: number
    title: string
    date: string
    price: string
    image: string
    dealer: string
    location: string
    color?: string
  }
}

export function DealerPost({ post }: DealerPostProps) {
  return (
    <Card className="group overflow-hidden bg-[#0B0B1A] border-[#2A2A37] hover:border-[#2E62E8] transition-all duration-300">
      <div className={`relative h-48 overflow-hidden ${post.color || ''}`}>
        <Image
          src={post.image || '/placeholder.svg'}
          alt={post.title}
          fill
          className="object-contain opacity-75 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B1A] to-transparent opacity-60" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-white mb-1">{post.title}</h3>
            <p className="text-sm text-[#878787]">{post.date}</p>
          </div>
          <span className="text-[#2E62E8] font-medium">{post.price}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-white">{post.dealer}</span>
            <div className="flex items-center text-sm text-[#878787]">
              <MapPin className="w-4 h-4 mr-1" />
              {post.location}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#878787] hover:text-white hover:bg-[#15151E]"
          >
            <ArrowUpRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
