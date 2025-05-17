import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RevenueCard({ className }: { className?: string }) {
  return (
    <Card
      className={`bg-[#0B0B1A] border-[#2A2A37] overflow-hidden flex flex-col ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#878787]">
          Revenues
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold">15</span>
          <span className="text-2xl font-bold ml-1">%</span>
          <div className="ml-2 flex items-center text-green-500">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <p className="text-xs text-[#878787] mt-1">Compared to last week</p>
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-[#2E62E8] hover:text-[#2E62E8]/80 hover:bg-transparent font-medium"
        >
          <span>My revenues</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
