import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, ArrowRight, MessageCircle } from 'lucide-react'
import Image from 'next/image'

export function FeaturedAuction() {
  return (
    <Card className="overflow-hidden bg-main-background border-[#ECECEC]/30 group">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image Section */}
        <div className="relative h-[300px] lg:h-full overflow-hidden">
          <Image
            src="/watch1.png"
            alt="Featured Watch"
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkest/5 to-transparent opacity-60" />
          <Badge
            variant="secondary"
            className="absolute top-4 left-4 bg-red-500/10 text-blue-500"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />
            Featured
          </Badge>
        </div>

        {/* Content Section */}
        <div className="p-6 lg:p-8 flex flex-col">
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-darkest mb-2">
                Rolex GMT Master II
              </h2>
              <p className="text-darkest/70">Ref. 2018-001</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-darkest/70 text-sm mb-1">Current Bid</p>
                <p className="text-xl font-bold text-darkest">€120,000</p>
              </div>
              <div>
                <p className="text-darkest/70 text-sm mb-1">Time Left</p>
                <div className="flex items-center text-darkest">
                  <Clock className="w-4 h-4 mr-2 text-[#2E62E8]" />
                  <span className="font-bold">04:21:33</span>
                </div>
              </div>
              <div>
                <p className="text-darkest/70 text-sm mb-1">Bidders</p>
                <div className="flex items-center text-darkest">
                  <Users className="w-4 h-4 mr-2 text-darkest/70" />
                  <span className="font-bold">69</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {['Mint', 'Box', 'Papers', '2021'].map((detail) => (
                <Badge
                  key={detail}
                  variant="secondary"
                  className="bg-darkest/5 text-darkest/70 border border-[#ECECEC]/30 justify-center"
                >
                  {detail}
                </Badge>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                size="lg"
                variant="secondary"
                className="w-full bg-primary-blue hover:bg-primary-blue/90 h-11"
              >
                <span>Place bid</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button size="lg" variant="secondary" className="w-full h-11">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>ASK AI</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
