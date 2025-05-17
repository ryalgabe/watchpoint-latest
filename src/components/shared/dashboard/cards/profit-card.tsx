import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProfitCard({ className }: { className?: string }) {
  return (
    <Card
      className={`bg-[#0B0B1A] border-[#2A2A37] overflow-hidden flex flex-col ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#878787]">
          My Profits
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex justify-between">
          <div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">2,635</span>
              <span className="text-lg font-bold ml-1">$</span>
            </div>
            <p className="text-xs text-[#878787] mt-1">This year</p>
          </div>
          <div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">365</span>
              <span className="text-lg font-bold ml-1">$</span>
            </div>
            <p className="text-xs text-[#878787] mt-1">This month</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-[#2E62E8] hover:text-[#2E62E8]/80 hover:bg-transparent font-medium"
        >
          <span>Manage income and outcomes</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
