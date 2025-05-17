import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface ComparisonMetricsProps {
  watches: Array<{
    id: string
    brand: string
    model: string
    price: number
    change: number
  }>
}

export function ComparisonMetrics({ watches }: ComparisonMetricsProps) {
  const metrics = [
    { label: 'Current Price', key: 'price' },
    { label: 'Price Change', key: 'change' },
    {
      label: 'Opening Price',
      value: (w: any) => w.price * (1 + w.change / 100),
    },
    { label: 'Minimum Price', value: (w: any) => w.price * 0.95 },
    { label: 'Maximum Price', value: (w: any) => w.price * 1.15 },
  ]

  return (
    <Card className="bg-darkest/5 border-none">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6 text-darkest">
          Price Comparison
        </h2>
        <Table>
          <TableHeader>
            <TableRow className="border-darkest/10 hover:bg-transparent">
              <TableHead className="text-darkest/50">Metric</TableHead>
              {watches.map((watch) => (
                <TableHead key={watch.id} className="text-darkest/50">
                  {watch.brand} {watch.model}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow
                key={metric.label}
                className="border-darkest/10 hover:bg-main-background/30 text-darkest/70"
              >
                <TableCell className="font-medium">{metric.label}</TableCell>
                {watches.map((watch) => (
                  <TableCell key={watch.id}>
                    {metric.key === 'change' ? (
                      <div className="flex items-center gap-1">
                        {watch[metric.key] >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={
                            watch[metric.key] >= 0
                              ? 'text-green-500'
                              : 'text-red-500'
                          }
                        >
                          {watch[metric.key]}%
                        </span>
                      </div>
                    ) : (
                      <>
                        {metric.value
                          ? metric.value(watch).toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })
                          : watch[
                              metric.key as keyof typeof watch
                            ].toLocaleString()}
                      </>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
