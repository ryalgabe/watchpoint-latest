import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'

const recentSales = [
  {
    id: 1,
    watch: 'Cubitus',
    brand: 'Patek Philippe',
    image: '/watch1.png',
    time: 'Just now',
  },
  {
    id: 2,
    watch: 'Datejust 41',
    brand: 'Rolex',
    image: '/watch1.png',
    time: '2 minutes ago',
  },
  {
    id: 3,
    watch: 'GMT Master II Batgirl',
    brand: 'Rolex',
    image: '/watch1.png',
    time: '5 minutes ago',
  },
  {
    id: 4,
    watch: 'Tradition 7097 Automatique',
    brand: 'Breguet',
    image: '/watch1.png',
    time: '6 minutes ago',
  },
]

export function RecentSalesCard({ className }: { className?: string }) {
  return (
    <Card
      className={`bg-[#0B0B1A] border-[#2A2A37] overflow-hidden ${className}`}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Recent Sales</CardTitle>
        <Select defaultValue="recent">
          <SelectTrigger className="w-fit bg-transparent rounded-full focus:border-none border-none text-sm font-medium text-muted-foreground">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent className="bg-accent/25 backdrop-blur-md">
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="asc">Price: High to Low</SelectItem>
            <SelectItem value="dsc">Price: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 flex-1">
        <div className="space-y-4">
          {recentSales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center p-2 hover:bg-[#15151E] rounded-md transition-colors"
            >
              {sale.image ? (
                <>
                  <Image
                    src={sale.image}
                    width={10}
                    height={10}
                    alt={sale.watch[0]}
                    className="object-contain h-10 w-10 aspect-auto"
                  />
                </>
              ) : (
                <>
                  <div className="h-10 w-10 bg-[#1c1c1c] rounded-full flex items-center justify-center">
                    {sale.watch[0]}
                  </div>
                </>
              )}
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium">{sale.watch}</p>
                <p className="text-xs text-[#878787]">{sale.brand}</p>
              </div>
              <div className="text-xs text-[#878787]">{sale.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-[#2E62E8] hover:text-[#2E62E8]/80 hover:bg-transparent"
        >
          <span>View all watches</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
