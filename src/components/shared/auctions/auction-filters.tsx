import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const brands = [
  'Rolex',
  'Patek Philippe',
  'Audemars Piguet',
  'Omega',
  'Cartier',
]
const conditions = ['Mint', 'Excellent', 'Very Good', 'Good', 'Fair']

interface AuctionFiltersProps {
  className?: string
}

export function AuctionFilters({ className }: AuctionFiltersProps) {
  const [sliderValue, setSliderValue] = useState(20000)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(sliderValue.toString())

  const handleDoubleClick = () => {
    setIsEditing(true)
    setInputValue(sliderValue.toString())
  }

  const handleSave = () => {
    const newValue = Number(inputValue)
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100000) {
      setSliderValue(newValue)
    }
    setIsEditing(false)
  }

  return (
    <Card className={cn('bg-darkest/5 border-[#ECECEC]/30 p-6', className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-darkest font-semibold mb-4">Price Range</h3>
          <div className="space-y-4">
            <Slider
              value={[sliderValue]}
              max={100000}
              step={500}
              className="w-full"
              onValueChange={(value) => {
                setSliderValue(value[0])
              }}
            />

            <div className="flex justify-between text-sm text-darkest/70">
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-24 h-6 text-sm"
                  />
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="h-6 px-2 py-0 text-xs"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <span onDoubleClick={handleDoubleClick}>
                  €{Number(sliderValue).toLocaleString()}
                </span>
              )}
              <span>€{Number(100000).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-darkest font-semibold mb-4">Brands</h3>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <Badge
                key={brand}
                variant="secondary"
                className="bg-darkest/5 text-darkest/70 border border-[#ECECEC]/30 cursor-pointer
                         hover:border-[#2E62E8] hover:text-darkest transition-colors"
              >
                {brand}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-darkest font-semibold mb-4">Condition</h3>
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition) => (
              <Badge
                key={condition}
                variant="secondary"
                className="bg-darkest/5 text-darkest/70 border border-[#ECECEC]/30 cursor-pointer
                         hover:border-[#2E62E8] hover:text-darkest transition-colors"
              >
                {condition}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t border-[#ECECEC]/30">
        <Button variant="outline" className="mr-2 h-12 px-6">
          Reset
        </Button>
        <Button className="bg-primary-blue text-darkest hover:bg-[#2E62E8]/90 h-12 px-6">
          Apply Filters
        </Button>
      </div>
    </Card>
  )
}
