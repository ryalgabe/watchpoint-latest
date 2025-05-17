import { Card } from '@/components/ui/card'
import { Flame, Clock, DollarSign } from 'lucide-react'

export function AuctionStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-main-background/50 border-[#ECECEC]/30 p-4 rounded-[26px] border-none">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-300/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <p className="text-darkest/70 text-sm">Live Auctions</p>
            <p className="text-xl font-bold text-darkest">12</p>
          </div>
        </div>
      </Card>

      <Card className="bg-main-background/50  border-[#ECECEC]/30 p-4 rounded-[26px] border-none">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-[#2E62E8]/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#2E62E8]" />
          </div>
          <div>
            <p className="text-darkest/70 text-sm">Upcoming</p>
            <p className="text-xl font-bold text-darkest">24</p>
          </div>
        </div>
      </Card>

      <Card className="bg-main-background/50 border-[#ECECEC]/30 p-4 rounded-[26px] border-none">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-darkest/70 text-sm">Total Value</p>
            <p className="text-xl font-bold text-darkest">€2.4M</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
