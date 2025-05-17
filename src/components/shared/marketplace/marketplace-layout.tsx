'use client'

import { Search, SlidersHorizontal, X, PanelRightOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuctionCard } from './auction-card'
import { DealerPost } from './dealer-post'
import { MarketNews } from './market-news'
import { useState } from 'react'

const auctions = [
  {
    id: 1,
    name: 'GMT Master II',
    reference: '#2018-001',
    price: '€45,000',
    location: 'France',
    image: '/watch1.png',
    color: 'bg-emerald-600',
  },
  {
    id: 2,
    name: 'GMT Master II',
    reference: '#2018-002',
    price: '€42,000',
    location: 'Switzerland',
    image: '/watch1.png',
    color: 'bg-blue-600',
  },
  {
    id: 3,
    name: 'GMT Master II',
    reference: '#2018-003',
    price: '€48,000',
    location: 'Germany',
    image: '/watch1.png',
    color: 'bg-amber-600',
  },
]

const dealerPosts = [
  {
    id: 1,
    title: 'Patek Philippe Nautilus 5711',
    date: '2024/02/07',
    price: '€135,000',
    image: '/watch1.png',
    dealer: 'Luxury Watches AG',
    location: 'Zürich, Switzerland',
    color: 'bg-sky-700',
  },
  {
    id: 2,
    title: 'Rolex Daytona Platinum',
    date: '2024/02/07',
    price: '€98,000',
    image: '/watch1.png',
    dealer: 'Crown & Caliber',
    location: 'London, UK',
    color: 'bg-olive-700',
  },
  {
    id: 3,
    title: 'Audemars Piguet Royal Oak',
    date: '2024/02/07',
    price: '€125,000',
    image: '/watch1.png',
    dealer: 'Timepiece Trading',
    location: 'Dubai, UAE',
    color: 'bg-amber-800',
  },
  {
    id: 4,
    title: 'Vacheron Constantin Overseas',
    date: '2024/02/07',
    price: '€85,000',
    image: '/watch1.png',
    dealer: 'Prestige Time',
    location: 'New York, USA',
    color: 'bg-emerald-700',
  },
  {
    id: 5,
    title: 'A. Lange & Söhne Zeitwerk',
    date: '2024/02/07',
    price: '€145,000',
    image: '/watch1.png',
    dealer: 'Deutsche Uhren',
    location: 'Berlin, Germany',
    color: 'bg-purple-700',
  },
  {
    id: 6,
    title: 'Cartier Santos',
    date: '2024/02/07',
    price: '€32,000',
    image: '/watch1.png',
    dealer: 'Paris Timepieces',
    location: 'Paris, France',
  },
]

export function MarketplaceLayout() {
  const [showNews, setShowNews] = useState(true)

  return (
    <div className="min-h-screen bg-[#060614] text-white p-4 md:p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#878787]" />
                <Input
                  type="search"
                  placeholder="Search in marketplace..."
                  className="w-full pl-10 bg-[#0B0B1A] border-[#2A2A37] text-white placeholder:text-[#878787]
                           focus-visible:ring-[#2E62E8] focus-visible:ring-offset-[#060614] h-12"
                />
              </div>
              <Button
                variant="outline"
                className="bg-[#0B0B1A] h-12 border-[#2A2A37] text-white hover:bg-[#15151E] hover:border-[#2E62E8]"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
              {!showNews && (
                <Button
                  variant="outline"
                  className="bg-[#0B0B1A] h-12 border-[#2A2A37] text-white hover:bg-[#15151E] hover:border-[#2E62E8]"
                  onClick={() => setShowNews(true)}
                >
                  <PanelRightOpen className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealerPosts.map((post) => (
                <DealerPost key={post.id} post={post} />
              ))}
            </div>
          </div>

          {showNews && (
            <div className="lg:w-80 bg-[#0B0B1A] border border-[#2A2A37] rounded-lg overflow-hidden">
              <div className="p-4 border-b border-[#2A2A37] flex items-center justify-between">
                <h2 className="text-lg font-semibold">Market News</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#15151E]"
                  onClick={() => setShowNews(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <MarketNews />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
