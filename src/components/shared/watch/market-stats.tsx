import { Card } from '@/components/ui/card'
import { Clock, Tag, TrendingUp, Users } from 'lucide-react'

const stats = [
  {
    label: 'Market Trend',
    value: '+8.5%',
    subtext: 'Last 12 months',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    label: 'Active Listings',
    value: '102',
    subtext: 'Across platforms',
    icon: Tag,
    color: 'text-[#2E62E8]',
    bgColor: 'bg-[#2E62E8]/10',
  },
  {
    label: 'Total Sales',
    value: '5.6K',
    subtext: 'All time',
    icon: Users,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    label: 'Time to Sell',
    value: '48h',
    subtext: 'Average',
    icon: Clock,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
]

export function MarketStatistics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-darkest/5 border-none p-4 bg-gradient-to-br from-darkest/10 to-darkest/5 transition-colors duration-200"
        >
          <div className="items-center text-center gap-4">
            <div
              className={`w-12 h-12 rounded-3xl ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-darkest/70 text-sm mb-3">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-darkest/70">{stat.subtext}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
