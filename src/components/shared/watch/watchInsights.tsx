'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PriceChart } from './price-chart'
import { AIAnalysis } from './ai-analysis'
import { MarketStatistics } from './market-stats'
import {
  Plus,
  Eye,
  ArrowUpRight,
  Clock,
  Tag,
  Hash,
  Brain,
  ArrowRight,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function WatchInsights() {
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)

  return (
    <div className="min-h-screen bg-main-background text-darkest">
      <div className="relative overflow-hidden border-b border-[#ECECEC]/30">
        <div className="inset-0 bg-main-background" />
        <div className="mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-[400px] relative">
              <div className="aspect-square rounded-[38px] bg-gradient-to-br from-darkest/5 to-darkest/10 border border-none p-8 overflow-hidden group">
                <img
                  src="/watch1.png"
                  alt="GMT Master II Bruce Wayne"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-main-background via-transparent to-transparent opacity-60" />
              </div>
              <div className="mt-4 space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-[#2E62E8] to-[#1E50D5] hover:from-[#2456D1] hover:to-[#1A47C0] h-12 transform active:scale-95 transition-all duration-200 shadow-lg hover:shadow-[#2E62E8]/20"
                  onClick={() => {}}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Collection
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full bg-darkest/5 border-none h-12 hover:bg-darkest/10 hover:text-darkest active:bg-[#1F1F2A] transform active:scale-95 transition-all duration-200"
                    onClick={() => {}}
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    View Auctions
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-darkest/5 border-none h-12 hover:bg-darkest/10 hover:text-darkest active:bg-[#1F1F2A] transform active:scale-95 transition-all duration-200"
                    onClick={() => {}}
                  >
                    <Tag className="w-5 h-5 mr-2" />
                    View Sales
                  </Button>
                </div>
              </div>
            </div>

            {/* Watch Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-3">
                    GMT Master II Bruce Wayne
                  </h1>
                  <div className="flex items-center gap-3 text-darkest/20">
                    <Badge
                      variant="outline"
                      className="bg-darkest/5 border-none px-3 py-1 text-sm hover:bg-[#1A1A24] transition-colors duration-200 text-darkest/60"
                    >
                      Rolex
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 border-none text-green-500 px-3 py-1 text-sm hover:bg-green-500/20 transition-colors duration-200"
                    >
                      Active Listings
                    </Badge>
                    <span className="flex items-center">
                      <Hash className="w-4 h-4 mr-1" />
                      6708-5551-0001
                    </span>

                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-darkest/70 text-sm mb-1">
                      Current Market Value
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-darkest">
                        $42,426
                      </p>
                      <ArrowUpRight className="w-6 h-6 text-darkest/30" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Statistics */}
              <MarketStatistics />

              {/* Specifications Table */}
              <div className="mt-8">
                <Table>
                  <TableHeader>
                    <TableRow className="border-darkest/10 hover:bg-transparent">
                      <TableHead className="text-darkest/70">
                        Specification
                      </TableHead>
                      <TableHead className="text-darkest/70">Details</TableHead>
                      <TableHead className="text-darkest/70">
                        Additional Info
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-darkest/10 hover:bg-darkest/5">
                      <TableCell className="font-medium">
                        Case Material
                      </TableCell>
                      <TableCell>Oystersteel</TableCell>
                      <TableCell className="text-darkest/70">
                        904L Stainless Steel
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-darkest/10 hover:bg-darkest/5">
                      <TableCell className="font-medium">Movement</TableCell>
                      <TableCell>Caliber 3285</TableCell>
                      <TableCell className="text-darkest/70">
                        Automatic, GMT Function
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-darkest/10 hover:bg-darkest/5">
                      <TableCell className="font-medium">Case Size</TableCell>
                      <TableCell>40mm</TableCell>
                      <TableCell className="text-darkest/70">
                        Oyster Case
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-darkest/10 hover:bg-darkest/5">
                      <TableCell className="font-medium">
                        Water Resistance
                      </TableCell>
                      <TableCell>100m (330ft)</TableCell>
                      <TableCell className="text-darkest/70">
                        Triple Lock Crown
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Analysis Section */}
      <div className="mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Price Chart */}
          <div className="flex-1">
            <Card className="bg-darkest/5 border-none h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1 text-darkest">Price History</h2>
                    <p className="text-darkest/70">
                      Last 5 years market performance
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-darkest/5 border-none hover:bg-darkest/5 text-darkest hover:text-[#2E62E8] transform active:scale-95 transition-all duration-200"
                    onClick={() => setShowAIAnalysis(true)}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    AI Analysis
                  </Button>
                </div>
                <div className="h-[400px]">
                  <PriceChart />
                  <div className="flex items-left mt-6 gap-4">
                  <Button
                    variant="outline"
                    className="bg-darkest/5 border-none hover:bg-darkest/5 text-darkest hover:text-[#2E62E8] transform active:scale-95 transition-all duration-200"
                    onClick={() => setShowAIAnalysis(true)}
                  >
                    Analyze price trends
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-darkest/5 border-none hover:bg-darkest/5 text-darkest hover:text-[#2E62E8] transform active:scale-95 transition-all duration-200"
                    onClick={() => setShowAIAnalysis(true)}
                  >
                    Compare with similar models
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-darkest/5 border-none hover:bg-darkest/5 text-darkest hover:text-[#2E62E8] transform active:scale-95 transition-all duration-200"
                    onClick={() => setShowAIAnalysis(true)}
                  >
                    Predict future value
                  </Button>
                  </div>
                </div>
                
              </div>
            </Card>
          </div>

          {/* Market Activity */}
          <div className="w-full lg:w-[400px]">
            <Card className="bg-darkest/5 border-none">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 text-darkest">
                  Recent Market Activity
                </h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-3xl bg-darkest/5 border border-transparent hover:border-[#2E62E8] transition-all duration-200 hover:shadow-lg hover:shadow-[#2E62E8]/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-3xl bg-[#2E62E8]/10 flex items-center justify-center">
                          {i % 2 === 0 ? (
                            <Tag className="w-5 h-5 text-[#2E62E8]" />
                          ) : (
                            <Clock className="w-5 h-5 text-[#2E62E8]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-darkest">
                            {i % 2 === 0 ? 'Sale Completed' : 'Listed for Sale'}
                          </p>
                          <p className="text-sm text-darkest/70">2 hours ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-darkest/60">
                          ${(40000 + i * 1000).toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#2E62E8] hover:text-[#2E62E8]/80 hover:bg-[#2E62E8]/10 transform active:scale-95 transition-all duration-200"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Description Tabs */}
        <Card className="bg-darkest/5 border-none">
          <Tabs defaultValue="description" className="w-full">
            <div className="border-none">
              <div className="px-6">
                <TabsList className="bg-transparent border border-darkest/30 mt-5 rounded-full ">
                  <TabsTrigger
                    value="description"
                    className="text-darkest/70 data-[state=active]:bg-transparent data-[state=active]:text-darkest hover:bg-[#1A1A24] transition-colors duration-200"
                  >
                    Watch Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="brand"
                    className="text-darkest/70 data-[state=active]:bg-transparent data-[state=active]:text-darkest hover:bg-[#1A1A24] transition-colors duration-200"
                  >
                    About Rolex
                  </TabsTrigger>
                  <TabsTrigger
                    value="market"
                    className="text-darkest/70 data-[state=active]:bg-transparent data-[state=active]:text-darkest hover:bg-[#1A1A24] transition-colors duration-200"
                  >
                    Market Analysis
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            <ScrollArea className="h-[400px]">
              <TabsContent value="description" className="p-6 m-0">
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed">
                    The Rolex GMT-Master II "Pepsi" is one of the most iconic
                    timepieces in the world of luxury watches. First introduced
                    in 1955, the GMT-Master was developed in collaboration with
                    Pan American Airways for use by their pilots. The red and
                    blue bezel, which gave the watch its "Pepsi" nickname, was
                    designed to show the difference between day and night hours.
                  </p>
                  <p className="text-lg leading-relaxed mt-4">
                    This particular reference features the classic 40mm case in
                    Oystersteel, equipped with a bidirectional rotatable bezel
                    with a Cerachrom insert in red and blue ceramic. The watch
                    is powered by the Caliber 3285, a self-winding mechanical
                    movement entirely developed and manufactured by Rolex.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="brand" className="p-6 m-0">
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed">
                    Rolex SA is a luxury watch manufacturer based in Geneva,
                    Switzerland. Founded as Wilsdorf and Davis by Hans Wilsdorf
                    and Alfred Davis in London, England in 1905, the company
                    registered Rolex as the brand name of its watches in 1908.
                  </p>
                  <p className="text-lg leading-relaxed mt-4">
                    As one of the most prestigious watch brands in the world,
                    Rolex is known for its innovation in watchmaking and the
                    quality of its products. The company produces about 2,000
                    watches per day and generates annual revenues estimated at
                    USD 8 billion.
                  </p>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </Card>
      </div>

      {/* AI Analysis Modal */}
      <AnimatePresence>
        {showAIAnalysis && (
          <AIAnalysis onClose={() => setShowAIAnalysis(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
