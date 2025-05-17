'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface RiskCardProps {
  className?: string
  riskPercentage?: number
}

export function RiskCard({ className, riskPercentage = 14 }: RiskCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 800
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const value = Math.floor(progress * riskPercentage)
      setAnimatedValue(value)

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [riskPercentage])

  return (
    <Card
      className={`bg-[#0B0B1A] border-[#2A2A37] overflow-hidden ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#878787]">
          Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <div className="relative w-44 h-22">
          <svg viewBox="0 0 120 70" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 10 60 A 50 50 0 0 1 110 60"
              fill="none"
              stroke="#2A2A37"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Animated arc */}
            <path
              d="M 10 60 A 50 50 0 0 1 110 60"
              fill="none"
              stroke="url(#gauge-gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="157"
              strokeDashoffset={`${157 - (animatedValue / 100) * 157}`}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
            <defs>
              <linearGradient id="gauge-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
            </defs>
          </svg>

          {/* Percentage text */}
          <div className="absolute left-1/2 top-[55%] transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-3xl font-bold text-white">
              {animatedValue}%
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-[#2E62E8] hover:text-[#2E62E8]/80 hover:bg-transparent font-medium"
        >
          <span>How we proceed</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
