'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { LineChartIcon, Search, TrendingUp } from 'lucide-react'

const data = [
  { year: '2018', value: 30 },
  { year: '2019', value: 40 },
  { year: '2020', value: 30 },
  { year: '2021', value: 50 },
  { year: '2022', value: 55 },
  { year: '2023', value: 80 },
  { year: '2024', value: 70 },
  { year: '2025', value: 100 },
]

export function GrowthCard({ className }: { className?: string }) {
  return (
    <Card
      className={`bg-[#0B0B1A] border-[#2A2A37] overflow-hidden flex flex-col ${className}`}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="font-medium">Growth</CardTitle>
        <Select defaultValue="annual">
          <SelectTrigger className="w-fit bg-transparent rounded-full focus:border-none border-none text-sm font-medium text-muted-foreground">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent className="bg-accent/25 backdrop-blur-md">
            <SelectItem value="annual">Annual</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4 flex-1">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E62E8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2E62E8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2A2A37"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                axisLine={{ stroke: '#2A2A37' }}
                tickLine={false}
                tick={{ fill: '#878787', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#878787', fontSize: 12 }}
                domain={[0, 'dataMax + 10']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#15151E',
                  borderColor: '#2A2A37',
                  borderRadius: '6px',
                  color: 'white',
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'white', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2E62E8"
                strokeWidth={2}
                activeDot={{
                  r: 6,
                  fill: '#2E62E8',
                  strokeWidth: 2,
                  stroke: '#0B0B1A',
                }}
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-2 mt-auto flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-full bg-[#15151E] border-none hover:bg-[#2A2A37] text-[#878787] hover:text-white font-medium"
        >
          <LineChartIcon className="mr-1 h-4 w-4" />
          <span>Analyze with AI</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-full bg-[#15151E] border-none hover:bg-[#2A2A37] text-[#878787] hover:text-white font-medium"
        >
          <TrendingUp className="mr-1 h-4 w-4" />
          <span>Simulate investment</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-full bg-[#15151E] border-none hover:bg-[#2A2A37] text-[#878787] hover:text-white font-medium"
        >
          <Search className="mr-1 h-4 w-4" />
          <span>See evolution of a period</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
