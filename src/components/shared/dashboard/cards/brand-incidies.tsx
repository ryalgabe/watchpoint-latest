'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight, ArrowDown, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

const brandIndices = [
  {
    name: 'GLOBAL',
    value: '39,859',
    change: -0.5,
    data: [
      { value: 40 },
      { value: 60 },
      { value: 45 },
      { value: 70 },
      { value: 50 },
      { value: 65 },
      { value: 40 },
      { value: 55 },
    ],
  },
  {
    name: 'ROLEX',
    value: '20,557',
    change: -4.1,
    data: [
      { value: 30 },
      { value: 50 },
      { value: 35 },
      { value: 55 },
      { value: 30 },
      { value: 45 },
      { value: 25 },
      { value: 40 },
    ],
  },
]

export function BrandIndicesCard({ className }: { className?: string }) {
  return (
    <Card
      className={`bg-[#0B0B1A] border-[#2A2A37] overflow-hidden flex flex-col ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Brands market index
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        {brandIndices.map((index) => (
          <div key={index.name} className="space-y-1">
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={index.data}>
                  <defs>
                    <linearGradient
                      id={`gradient-${index.name}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={index.change < 0 ? '#ef4444' : '#22c55e'}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={index.change < 0 ? '#ef4444' : '#22c55e'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={index.change < 0 ? '#ef4444' : '#22c55e'}
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill={`url(#gradient-${index.name})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">{index.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{index.value}</span>
                <div
                  className={`text-xs flex items-center ${index.change < 0 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {index.change < 0 ? (
                    <ArrowDown className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowUp className="h-3 w-3 mr-0.5" />
                  )}
                  {Math.abs(index.change)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-[#2E62E8] hover:text-[#2E62E8]/80 hover:bg-transparent font-medium"
        >
          <span>See all brand indexes</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
