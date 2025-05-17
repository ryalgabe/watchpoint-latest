import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="ml-2">Please wait...</span>
    </div>
  )
}
