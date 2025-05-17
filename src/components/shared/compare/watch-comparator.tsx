'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Command } from 'cmdk'
import { Search, X, Plus, GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { WatchCard } from './watch-card'
import { PriceEvolution } from './price-evolution'
import { ComparisonMetrics } from './comparison-metric'
import { toast } from 'sonner'

const watches = [
  {
    id: '126710BLRO-0001',
    brand: 'Rolex',
    model: 'GMT-Master II',
    nickname: 'Pepsi',
    reference: '126710BLRO',
    price: 19337,
    change: -6.22,
    volume: 27605,
    image: '/watch2.png',
  },
  {
    id: '116508-0013',
    brand: 'Rolex',
    model: 'Daytona',
    nickname: 'Gold Green Dial',
    reference: '116508',
    price: 65706,
    change: -5.43,
    volume: 12026,
    image: '/watch3.png',
  },
]

export function WatchComparator() {
  const [selectedWatches, setSelectedWatches] = useState<typeof watches>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleAddWatch = (watch: (typeof watches)[0]) => {
    if (selectedWatches.length < 3) {
      const isAlreadySelected = selectedWatches.some((w) => w.id === watch.id)
      if (isAlreadySelected) {
        toast.error(
          'This watch is already selected. Please choose a different one.'
        )
        return
      }
      setSelectedWatches([...selectedWatches, watch])
    }
    setIsSearchOpen(false)
  }

  const handleRemoveWatch = (watchId: string) => {
    setSelectedWatches(selectedWatches.filter((w) => w.id !== watchId))
  }

  return (
    <div className="min-h-screen bg-main-background text-darkest p-4 md:p-6 lg:p-6">
      <div className="mx-0">
        {/* Header */}
        <div className="rounded-[38px] border-[#ECECEC]/10 shadow-md border mb-6">
          <div className="max-w-[1800px] mx-auto px-6 py-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex-1 max-w-2xl">
                <h1 className="text-2xl font-bold text-darkest mb-2 inline-flex gap-3 items-center">
                  <GitCompare className="text-darkest/80 bg-darkest/10 rounded-lg p-1"/>
                  Watch Comparator
                </h1>
                <p className="text-darkest/70">
                  Compare specifications and market performances
                </p>
              </div>
                <Button
                  className="bg-gradient-to-r from-darkest/5 to-main-background hover:from-darkest/10 hover:to-darkest/5"
                  variant = "ghost"
                  onClick={() => setIsSearchOpen(true)}
                  disabled={selectedWatches.length >= 3}
                  >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Watch
              </Button>
            </div>
          </div>
        </div>
        

        {/* Watch Selection Area */}
        {selectedWatches.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[400px]">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="h-full rounded-[38px] bg-gradient-to-t from-darkest/5 to-main-background  border-2 border-dashed border-darkest/10 hover:border-2 hover:border-dashed hover:border-darkest/20 transition-colors duration-200 flex flex-col items-center justify-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-none flex items-center justify-center">
                <Plus className="w-6 h-6 text-darkest/50" />
              </div>
              <p className="text-[#878787]">Add Watch to Compare</p>
            </button>
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-darkest/10 rounded-[38px] bg-transparent"/>
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-darkest/10 rounded-[38px] bg-transparent"/>
          </div>

        ) : (
          <div className="space-y-8">
            {/* Watch Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedWatches.map((watch, index) => (
                <WatchCard
                  key={watch.id}
                  watch={watch}
                  index={index + 1}
                  total={selectedWatches.length}
                  onRemove={() => handleRemoveWatch(watch.id)}
                />
              ))}
              {selectedWatches.length < 3 && (
                <button
                onClick={() => setIsSearchOpen(true)}
                className="h-full rounded-[38px] bg-gradient-to-t from-darkest/5 to-main-background  border-2 border-dashed border-darkest/10 hover:border-2 hover:border-dashed hover:border-darkest/20 transition-colors duration-200 flex flex-col items-center justify-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-none flex items-center justify-center">
                  <Plus className="w-6 h-6 text-darkest/50" />
                </div>
                <p className="text-[#878787]">Add Watch to Compare</p>
              </button>
              )}
            </div>

            {selectedWatches.length >= 2 && (
              <>
                {/* Comparison Metrics */}
                <ComparisonMetrics watches={selectedWatches} />

                {/* Price Evolution */}
                <PriceEvolution watches={selectedWatches} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-xl mx-4"
            >
              <Command className="border-none bg-main-background rounded-[38px] overflow-hidden p-6">
                <div className="flex items-center border-none bg-darkest/5 rounded-full px-6 mb-6">
                  <Search className="w-5 h-5 text-[#878787]" />
                  <Command.Input
                    placeholder="Search watches..."
                    className="flex-1 h-14 px-4 border-0 outline-none text-darkest placeholder:text-[#878787] bg-transparent"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-[#15151E]"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <ScrollArea className="h-[400px]">
                  <Command.List>
                    <Command.Empty className="p-6 text-center text-[#878787]">
                      No watches found.
                    </Command.Empty>
                    {watches.map((watch) => (
                      <Command.Item
                        key={watch.id}
                        value={`${watch.brand} ${watch.model}`}
                        onSelect={() => handleAddWatch(watch)}
                        className="flex items-center gap-4 p-4 hover:bg-darkest/5 cursor-pointer rounded-[26px]"
                      >
                        <div className="w-12 h-12 rounded-lg bg-none border-none overflow-hidden">
                          <img
                            src={watch.image || '/placeholder.svg'}
                            alt={watch.model}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-darkest">
                            {watch.brand} {watch.model}
                          </p>
                          <p className="text-sm text-[#878787]">
                            {watch.reference}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-darkest/50">
                            €{watch.price.toLocaleString()}
                          </p>
                          <p
                            className={`text-sm ${watch.change >= 0 ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {watch.change >= 0 ? '+' : ''}
                            {watch.change}%
                          </p>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.List>
                </ScrollArea>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
