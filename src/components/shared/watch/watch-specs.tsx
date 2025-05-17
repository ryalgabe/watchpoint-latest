import { Card } from '@/components/ui/card'

const specs = [
  { label: 'Case Material', value: 'Oystersteel' },
  { label: 'Case Size', value: '40mm' },
  { label: 'Movement', value: 'Automatic' },
  { label: 'Power Reserve', value: '70 hours' },
  { label: 'Water Resistance', value: '100m' },
  { label: 'Crystal', value: 'Sapphire' },
  { label: 'Bracelet', value: 'Jubilee' },
  { label: 'Year', value: '2021' },
]

export function WatchSpecs() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {specs.map((spec) => (
        <Card key={spec.label} className="bg-darkest/5 border-[#ECECEC]/30 p-4">
          <p className="text-darkest/70 text-sm mb-1">{spec.label}</p>
          <p className="font-medium">{spec.value}</p>
        </Card>
      ))}
    </div>
  )
}
