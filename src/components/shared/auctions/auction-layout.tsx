'use client'

import { Search, SlidersHorizontal, Clock, Flame, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuctionCard } from './auction-card'
import { AuctionStats } from './auction-stats'
import { FeaturedAuction } from './featured-auction'
import { AuctionFilters } from './auction-filters'
import { useState } from 'react'

const upcomingAuctions = [
  {
    id: 1,
    name: 'GMT Master II',
    reference: '#2018-001',
    location: 'France',
    status: 'Upcoming auction',
    image: '/oyster_tiffany.png',
    currentBid: '€45,000',
    endTime: '2h 15m',

    watchDetails: {
      brand: 'Rolex',
      year: '2018',
      condition: 'Excellent',
      papers: true,
      box: true,
    },
  },
  {
    id: 2,
    name: 'Submariner',
    reference: '#2020-045',
    location: 'Germany',
    status: 'Upcoming auction',
    image: '/master2_batgirl.png',
    currentBid: '€38,000',
    endTime: '5h 30m',

    watchDetails: {
      brand: 'Rolex',
      year: '2020',
      condition: 'Very Good',
      papers: true,
      box: true,
    },
  },
  {
    id: 3,
    name: 'Daytona',
    reference: '#2019-167',
    location: 'Italy',
    status: 'Upcoming auction',
    image: '/nautilus.png',
    currentBid: '€75,000',
    endTime: '4h 45m',

    watchDetails: {
      brand: 'Rolex',
      year: '2019',
      condition: 'Mint',
      papers: true,
      box: true,
    },
  },
  {
    id: 4,
    name: 'Royal Oak',
    reference: '#2021-089',
    location: 'Spain',
    status: 'Upcoming auction',
    image: '/master2_pepsi.png',
    currentBid: '€92,000',
    endTime: '6h',

    watchDetails: {
      brand: 'Audemars Piguet',
      year: '2021',
      condition: 'Excellent',
      papers: true,
      box: true,
    },
  },
]

const liveAuctions = [
  {
    id: 4,
    name: 'GMT Master II Pepsi',
    reference: '#2018-004',
    location: 'India',
    status: 'Live auction',
    image: '/master2_pepsi.png',
    currentBid: '€52,000',
    endTime: '15m',
    bidders: 12,

    watchDetails: {
      brand: 'Rolex',
      year: '2018',
      condition: 'Mint',
      papers: true,
      box: true,
    },
  },
  {
    id: 6,
    name: 'Nautilus',
    reference: '#2019-078',
    location: 'Switzerland',
    status: 'Live auction',
    image: '/nautilus.png',
    currentBid: '€82,000',
    endTime: '1h 20m',
    bidders: 15,

    watchDetails: {
      brand: 'Patek Philippe',
      year: '2019',
      condition: 'Mint',
      papers: true,
      box: true,
    },
  },
  {
    id: 7,
    name: 'GMT Master II Bartgirl',
    reference: '#2021-256',
    location: 'UAE',
    status: 'Live auction',
    image: '/master2_batgirl.png',
    currentBid: '€125,000',
    endTime: '2h',
    bidders: 20,

    watchDetails: {
      brand: 'Rolex',
      year: '2021',
      condition: 'Mint',
      papers: true,
      box: true,
    },
  },
  {
    id: 8,
    name: 'Oyster Tiffany',
    reference: '#2017-445',
    location: 'UK',
    status: 'Live auction',
    image: '/oyster_tiffany.png',
    currentBid: '€44,000',
    endTime: '30m',
    bidders: 10,

    watchDetails: {
      brand: 'Rolex',
      year: '2017',
      condition: 'Very Good',
      papers: true,
      box: true,
    },
  },
]

export function AuctionsLayout() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-main-background">
      <div className="rounded-[38px] border-[#ECECEC]/10 mx-6 my-6 shadow-md border">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-2xl font-bold text-darkest inline-flex gap-3 items-center">
                <DollarSign className="text-darkest/80 bg-darkest/10 rounded-lg p-1"/>
                Auctions
              </h1>
              <p className="text-darkest/70">
                Discover rare and exclusive timepieces from around the world
              </p>
            </div>
            <AuctionStats />
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 py-0 md:px-6 lg:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center mb-8">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-darkest/70" />
            <Input
              type="search"
              placeholder="Search through auctions..."
              className="w-full pl-10 bg-[#ECECEC]/5 border-[#ECECEC]/30 text-darkest placeholder:text-darkest/70
                       focus-visible:ring-[#2E62E8] focus-visible:ring-offset-[#FFFF] h-10 border-none"
            />
          </div>
          <Button
            variant="outline"
            className="bg-[#ECECEC]/5 border-[#ECECEC]/30 text-darkest hover:bg-darkest/10 h-10 px-6 rounded-full border-none hover:text-darkest"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && <AuctionFilters className="mb-8" />}

        <div className="grid grid-cols-1 gap-8">

          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-300/10 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-blue-300" />
                </div>
                <h2 className="text-xl font-semibold text-darkest">
                  Live Auctions
                </h2>
                <span className="px-2 py-1 rounded-full bg-blue-300/10 text-blue-300 text-xs font-medium">
                  {liveAuctions.length} Active
                </span>
              </div>
              <Button variant="link" className="text-[#2E62E8]">
                View all
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {liveAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} isLive={true} />
              ))}
            </div>
          </section>

          {/* Upcoming Auctions */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2E62E8]/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#2E62E8]" />
                </div>
                <h2 className="text-xl font-semibold text-darkest">
                  Upcoming Auctions
                </h2>
              </div>
              <Button variant="link" className="text-[#2E62E8]">
                View all
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {upcomingAuctions.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  isLive={false}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
