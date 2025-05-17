import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, Clock, Home, Settings, User, Watch } from 'lucide-react'
import { RevenueCard } from '../shared/dashboard/cards/revenue-card'
import { ProfitCard } from '../shared/dashboard/cards/profit-card'
import { RiskCard } from '../shared/dashboard/cards/risk-card'
import { RecentSalesCard } from '../shared/dashboard/cards/recent-sales'
import { GrowthCard } from '../shared/dashboard/cards/growth-card'
import { BrandIndicesCard } from '../shared/dashboard/cards/brand-incidies'
import { ModelIndicesCard } from '../shared/dashboard/cards/model-indicies'
import { NotificationsCard } from '../shared/dashboard/cards/notification-card'

export function DashboardLayout() {
  return (
    <div className="min-h-screen">
      {/* <div className="fixed inset-y-0 left-0 w-16 bg-[#0B0B1A] border-r border-[#2A2A37] flex flex-col items-center py-6 z-10">
        <div className="w-10 h-10 rounded-full bg-[#2E62E8] flex items-center justify-center mb-8">
          <Watch className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col items-center space-y-6 flex-1">
          <Button variant="ghost" size="icon" className="text-[#2E62E8]">
            <Home className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#878787] hover:text-white">
            <BarChart3 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#878787] hover:text-white">
            <Clock className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#878787] hover:text-white">
            <User className="w-5 h-5" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="text-[#878787] hover:text-white mt-auto">
          <Settings className="w-5 h-5" />
        </Button>
      </div> */}
      {/* Main Content */}
      <div>
        <div className="max-w-[1800px] mx-auto px-4 py-6 md:px-6 lg:px-8">
          {/* <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-[#878787]">
                Welcome back to your Watchpoint dashboard
              </p>
            </div>
          </div> */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Top Row */}
              <RevenueCard />
              <ProfitCard />
              <RiskCard riskPercentage={14} />
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 col-span-full">
              <RecentSalesCard className="lg:col-span-2 xl:col-span-2" />
              <GrowthCard className="lg:col-span-2 xl:col-span-2" />
            </div>
            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 col-span-full">
              <BrandIndicesCard className="col-span-1" />
              <ModelIndicesCard className="col-span-1" />
              <NotificationsCard className="col-span-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
