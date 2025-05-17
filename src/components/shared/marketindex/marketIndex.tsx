'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  InfoIcon as InfoCircle,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

// Sample data for charts
const generateChartData = (
  startValue: number,
  trend: 'up' | 'down' | 'mixed',
  points = 30
) => {
  const data = []
  let currentValue = startValue

  for (let i = 0; i < points; i++) {
    if (trend === 'up') {
      currentValue = currentValue * (1 + Math.random() * 0.03)
    } else if (trend === 'down') {
      currentValue = currentValue * (1 - Math.random() * 0.02)
    } else {
      // Mixed trend
      const change = (Math.random() - 0.48) * 0.05
      currentValue = currentValue * (1 + change)
    }

    data.push({
      date: new Date(2023, 0, i + 1).toISOString().split('T')[0],
      value: Math.round(currentValue * 100) / 100,
    })
  }

  return data
}

const marketData = [
  {
    id: 'overall',
    name: 'Overall Market',
    value: 39921,
    change: -5.64,
    changeValue: -2387,
    data: generateChartData(45000, 'down'),
  },
  {
    id: 'rolex',
    name: 'Rolex',
    value: 20515,
    change: -4.7,
    changeValue: -1009,
    data: generateChartData(22000, 'down'),
  },
  {
    id: 'patek',
    name: 'Patek Philippe',
    value: 166962,
    change: -5.5,
    changeValue: -9723,
    data: generateChartData(180000, 'down'),
  },
  {
    id: 'ap',
    name: 'Audemars Piguet',
    value: 89275,
    change: -5.6,
    changeValue: -5300,
    data: generateChartData(95000, 'down'),
  },
  {
    id: 'omega',
    name: 'Omega',
    value: 8712,
    change: -4.5,
    changeValue: -410,
    data: generateChartData(9200, 'down'),
  },
  {
    id: 'cartier',
    name: 'Cartier',
    value: 8488,
    change: -4.0,
    changeValue: -354,
    data: generateChartData(9000, 'down'),
  },
  {
    id: 'breitling',
    name: 'Breitling',
    value: 4264,
    change: -11.7,
    changeValue: -565,
    data: generateChartData(5000, 'down'),
  },
  {
    id: 'tudor',
    name: 'Tudor',
    value: 3203,
    change: -3.9,
    changeValue: -130,
    data: generateChartData(3400, 'down'),
  },
]

export function MarketIndexLayout() {
  const [timeframe, setTimeframe] = useState('1Y')

  return (
    <div className="min-h-screen text-darkest px-6 py-6">
      {/* Header Tickers */}
      <div className="border-none rounded-[38px] overflow-hidden">
        <div className="mx-auto">
          <div className="flex overflow-x-auto p-0 scrollbar-hide">
            {marketData.map((item) => (
              <div key={item.id} className="flex-shrink-0 mr-4 last:mr-0">
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 border-[#2A2A37] text-darkest/70"
                >
                  <span className="mr-2 font-medium">{item.name}</span>
                  <span>{item.value.toLocaleString()}</span>
                  <span
                    className={`ml-2 ${item.change < 0 ? 'text-red-500' : 'text-green-500'}`}
                  >
                    {item.change}%
                  </span>
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8 md:px-6 lg:px-0">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Market Indexes</h1>
            <div className="w-16 h-1 bg-[#2E62E8]"></div>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="text-md mr-2 bg-darkest/5 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="brand"
                className="text-md mr-2 bg-darkest/5 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Brand Indexes
              </TabsTrigger>
              <TabsTrigger
                value="group"
                className="text-md mr-2 bg-darkest/5 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Group Indexes
              </TabsTrigger>
              <TabsTrigger
                value="price"
                className="text-md bg-darkest/5 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Price Range Indexes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Info Box */}
              <div className="flex items-start gap-3 p-4 rounded-[26px] bg-darkest/5 border-none">
                <InfoCircle className="w-5 h-5 text-[#2E62E8] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-darkest/70">
                  <p>
                    For standardization purposes, all market index values and
                    weightings are calculated in USD.
                  </p>
                  <p className="">
                    WatchPoint market indexes serve as the gold standard for
                    tracking price trends on the secondary watch market, and are
                    trusted by top watch brands and financial institutions.<br></br>
                    <Button
                      variant="link"
                      className="text-[#2E62E8] p-0 h-auto text-sm mt-2"
                    >
                      Learn how we calculate our indexes
                    </Button>
                  </p>
                </div>
              </div>

              {/* Featured Indexes */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Featured Indexes</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {marketData.slice(0, 2).map((index) => (
                    <IndexCard
                      key={index.id}
                      index={index}
                      timeframe={timeframe}
                      setTimeframe={setTimeframe}
                    />
                  ))}
                </div>
              </div>

              {/* All Indexes */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">All Indexes</h2>

                {/* Overall Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Overall</h3>
                  <IndexRow index={marketData[0]}/>
                </div>

                {/* Brands Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Brands</h3>
                    <Button variant="link" className="text-[#2E62E8]">
                      View All <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-0 bg-darkest/5 rounded-[38px] p-4">
                    {marketData.slice(1).map((index) => (
                      <IndexRow key={index.id} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="brand">
              <div className="h-64 flex items-center justify-center">
                Brand indexes content
              </div>
            </TabsContent>

            <TabsContent value="group">
              <div className="h-64 flex items-center justify-center">
                Group indexes content
              </div>
            </TabsContent>

            <TabsContent value="price">
              <div className="h-64 flex items-center justify-center">
                Price range indexes content
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

interface IndexCardProps {
  index: (typeof marketData)[0]
  timeframe: string
  setTimeframe: (value: string) => void
}

function IndexCard({ index, timeframe, setTimeframe }: IndexCardProps) {
  return (
    <Card className="bg-darkest/5 border-none overflow-hidden">
      <div className="p-4 border-b border-[#2A2A37]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-darkest/70">{index.name} Index</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-baseline mt-1">
          <span className="text-2xl font-bold text-darkest">
            {index.value.toLocaleString()}
          </span>
          <span
            className={`ml-3 ${index.change < 0 ? 'text-red-500' : 'text-green-500'} font-medium`}
          >
            {index.change}%
          </span>
          <span
            className={`ml-2 ${index.change < 0 ? 'text-red-500' : 'text-green-500'}`}
          >
            {index.change < 0 ? '' : '+'}
            {index.changeValue.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {['1M', '6M', '1Y', '5Y', 'Max'].map((period) => (
              <Button
                key={period}
                variant="ghost"
                size="sm"
                className={`h-7 px-2 ${
                  timeframe === period
                    ? 'bg-[#2A2A37] text-white'
                    : 'text-[#878787] hover:text-white hover:bg-[#15151E]'
                }`}
                onClick={() => setTimeframe(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={index.data}>
              <defs>
                <linearGradient
                  id={`gradient-${index.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#2E62E8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2E62E8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#878787' }}
                tickLine={{ stroke: '#2A2A37' }}
                axisLine={{ stroke: '#2A2A37' }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', { month: 'short' })
                }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#878787' }}
                tickLine={{ stroke: '#2A2A37' }}
                axisLine={{ stroke: '#2A2A37' }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A37" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F1318',
                  borderColor: '#2A2A37',
                  color: '#fff',
                  borderRadius: '26px',
                  padding: '16px',
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: any) => [
                  `${value.toLocaleString()}`,
                  'Value',
                ]}
                labelFormatter={(label) => {
                  const date = new Date(label)
                  return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2E62E8"
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${index.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}

interface IndexRowProps {
  index: (typeof marketData)[0]
}

function IndexRow({ index }: IndexRowProps) {
  return (
    // if index is last, no border:
    <motion.div
      whileHover={{ backgroundColor: '#0F131855' }}
      className="bg-transparent rounded-none grid grid-cols-[1fr,auto,auto] gap-4 p-3 border-b border-[#2A2A37] cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-24 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={index.data}>
              <defs>
                <linearGradient
                  id={`sparkline-${index.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={index.change < 0 ? '#f43f5e' : '#22c55e'}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={index.change < 0 ? '#f43f5e' : '#22c55e'}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={index.change < 0 ? '#f43f5e' : '#22c55e'}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#sparkline-${index.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <span className="font-medium">{index.name}</span>
      </div>
      <div className="text-right font-semibold">
        {index.value.toLocaleString()}
      </div>
      <div
        className={`text-right ${index.change < 0 ? 'text-red-500' : 'text-green-500'}`}
      >
        <div className="flex items-center justify-end">
          {index.change < 0 ? (
            <ArrowDown className="w-4 h-4 mr-1" />
          ) : (
            <ArrowUp className="w-4 h-4 mr-1" />
          )}
          <span>{Math.abs(index.change).toFixed(1)}% 1Y</span>
        </div>
      </div>
    </motion.div>
  )
}
