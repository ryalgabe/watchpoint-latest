import { getAllWatches } from '@/actions/compare'
import { WatchComparator } from '@/components/shared/compare/watch-comparator'

export default async function ComparePage() {
  const watches = await getAllWatches()

  if (!watches) {
    return <div>No watches found</div>
  }

  //@ts-ignore
  return <WatchComparator allWatches={watches} />
}
