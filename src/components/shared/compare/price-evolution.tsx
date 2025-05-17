'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
} from 'recharts'

interface PriceEvolutionProps {
  watches: Array<{
    id: string
    brand: string
    model: string
    price: number
  }>
}

// Generate sample data for the chart
const generateChartData = (basePrice: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return months.map((month) => ({
    month,
    price: basePrice * (1 + (Math.random() * 0.2 - 0.1)),
  }))
}

export function PriceEvolution({ watches }: PriceEvolutionProps) {
  // Combine data for all watches
  const chartData = watches[0].price
    ? generateChartData(watches[0].price).map((data, i) => {
        const point: any = { month: data.month }
        watches.forEach((watch, index) => {
          point[`watch${index + 1}`] = generateChartData(watch.price)[i].price
        })
        return point
      })
    : []

  const colors = ['#1C246C', '#2F4D2A', '#8B5CF6']

  return (
    <Card className="bg-darkest/5 border-none">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-2 text-darkest">Price Evolution</h2>
            <div className="flex gap-2">
              {watches.map((watch, index) => (
                <Badge
                  key={watch.id}
                  variant="outline"
                  className="bg-darkest/5 border-none"
                  style={{ color: colors[index] }}
                >
                  {watch.brand} {watch.model}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#01223F30" />
              <XAxis
                dataKey="month"
                stroke="#01223F30"
                tick={{ fill: '#878787' }}
              />
              <YAxis
                stroke="#01223F30"
                tick={{ fill: '#878787' }}
                tickFormatter={(value) => `€${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  padding: '16px',
                  backgroundColor: '#fff',
                  border: 'none',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '26px',
                }}
                itemStyle={{ color: '#01223FAA' }}
                labelStyle={{ color: '#878787' }}
              />
              {watches.map((_, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={`watch${index + 1}`}
                  stroke={colors[index]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: colors[index],
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
