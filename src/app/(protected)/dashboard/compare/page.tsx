import { getAllWatches } from '@/actions/compare'
import { WatchComparator } from '@/components/shared/compare/watch-comparator'

export default async function ComparePage() {
  const watches = await getAllWatches()

  return <WatchComparator allWatches={watches} />
}
