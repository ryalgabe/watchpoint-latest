'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  X,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  DollarSign,
} from 'lucide-react'

interface AIAnalysisProps {
  onClose: () => void
}

export function AIAnalysis({ onClose }: AIAnalysisProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-main-background border-[#ECECEC]/30">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#ECECEC]/30">
            <div>
              <h2 className="text-xl font-bold">AI Market Analysis</h2>
              <p className="text-darkest/70">
                GMT Master II Pepsi Price Trends
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-main-background/10"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="max-h-[600px]">
            <div className="p-6 space-y-6">
              {/* Market Summary */}
              <Card className="bg-darkest/5 border-[#ECECEC]/30 p-4">
                <h3 className="font-semibold mb-3">Market Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-darkest/70 text-sm">YoY Growth</p>
                      <p className="font-medium text-green-500">+12.4%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-darkest/70 text-sm">Avg. Sale Price</p>
                      <p className="font-medium">$41,850</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-darkest/70 text-sm">
                        Market Volatility
                      </p>
                      <p className="font-medium text-yellow-500">Medium</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Price Analysis */}
              <div className="space-y-4">
                <h3 className="font-semibold">Price Analysis</h3>
                <div className="prose prose-invert max-w-none">
                  <p>
                    The GMT Master II Pepsi has shown strong price stability
                    over the past 5 years, with a consistent upward trend. The
                    average annual appreciation rate of 8.5% indicates steady
                    market demand and growing collector interest.
                  </p>
                  <p>Key factors influencing the price:</p>
                  <ul>
                    <li>Limited production numbers</li>
                    <li>Strong brand recognition</li>
                    <li>High demand in Asian markets</li>
                    <li>Excellent condition retention</li>
                  </ul>
                </div>
              </div>

              {/* Market Predictions */}
              <Card className="bg-darkest/5 border-[#ECECEC]/30 p-4">
                <h3 className="font-semibold mb-4">12-Month Forecast</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-main-background rounded-xl border border-[#ECECEC]/30">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span>Optimistic</span>
                    </div>
                    <span className="font-medium">$46,500</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-main-background rounded-xl border border-[#ECECEC]/30">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      <span>Conservative</span>
                    </div>
                    <span className="font-medium">$43,800</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-main-background rounded-xl border border-[#ECECEC]/30">
                    <div className="flex items-center gap-3">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      <span>Bearish</span>
                    </div>
                    <span className="font-medium">$40,200</span>
                  </div>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </Card>
      </motion.div>
    </motion.div>
  )
}
