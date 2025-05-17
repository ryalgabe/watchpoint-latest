import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, ArrowUpRight, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface AuctionCardProps {
  auction: {
    id: number
    name: string
    reference: string
    location: string
    status: string
    image: string
    currentBid: string
    endTime: string
    bidders?: number
    watchDetails: {
      brand: string
      year: string
      condition: string
      papers: boolean
      box: boolean
    }
  }
  isLive: boolean
}

export function AuctionCard({ auction, isLive }: AuctionCardProps) {
  return (
    <Card className="group overflow-hidden bg-darkest/5 border-[#ECECEC]/30 hover:border-[#2E62E8]/50 transition-all duration-300 border-none shadow-md">
      <div className="relative h-48 overflow-hidden bg-">
        <Image
          src={auction.image || '/placeholder.avif'}
          alt={auction.name}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105 shadow-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-main-background/30 to-transparent opacity-100" />
        <div className="absolute top-4 left-4 flex gap-2">

        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg text-darkest">
                {auction.name}
              </h3>
              <p className="text-sm text-darkest/70">{auction.reference}</p>
            </div>
            <div className="flex items-center text-sm text-darkest/70">
              <MapPin className="w-4 h-4 mr-1" />
              {auction.location}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <p className="text-darkest/70 text-sm">Current Bid</p>
              <p className="text-darkest font-semibold">{auction.currentBid}</p>
            </div>
            <div className="space-y-1">
              <p className="text-darkest/70 text-sm">Ends in</p>
              <div className="flex items-center text-darkest">
                <Clock className="w-4 h-4 mr-1 text-[#2E62E8]" />
                {auction.endTime}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(auction.watchDetails).map(([key, value]) =>
              typeof value === 'boolean' ? (
                value && (null
                  //<Badge
                  //  key={key}
                  //  variant="secondary"
                  //  className="bg-darkest/5 text-darkest/70 border border-[#ECECEC]/30"
                  //>
                  //</div>  {key[0].toUpperCase() + key.slice(1).toLowerCase()}
                  //</Badge>
                )
              ) : (
                <Badge
                  key={key}
                  variant="secondary"
                  className="bg-darkest/5 text-darkest/70 border border-[#ECECEC]/30"
                >
                  {value}
                </Badge>
              )
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button className="text-darkest bg-darkest/5 border-[#ECECEC]/30 px-6 rounded-full font-regular">
            <MessageCircle className="w-4 h-4 mr-0.5" />
            <span>Artificial intelligence</span>
          </Button>
          <Button
            variant="secondary"
            className=" text-darkest border border-none
                      transition-all duration-300 rounded-full bg-primary/20"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Auction site</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
