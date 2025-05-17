import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import Image from 'next/image'

interface AuctionCardProps {
  auction: {
    id: number
    name: string
    reference: string
    price: string
    location: string
    image: string
    color?: string
  }
}

export function AuctionCard({ auction }: AuctionCardProps) {
  return (
    <Card className="group bg-[#0B0B1A] border-[#2A2A37] hover:border-[#2E62E8] transition-all duration-300">
      <div className="p-4 flex items-start gap-4">
        <div
          className={`relative w-16 h-16 rounded-lg overflow-hidden ${auction.color || ''} flex-shrink-0`}
        >
          <Image
            src={auction.image || '/placeholder.svg'}
            alt={auction.name}
            fill
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-white truncate">
                {auction.name}
              </h3>
              <p className="text-sm text-[#878787]">{auction.reference}</p>
            </div>
            <div className="flex items-center text-sm text-[#878787]">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{auction.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#2E62E8]">
              {auction.price}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#878787] hover:text-white hover:bg-[#15151E]"
            >
              bid on auction site
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
