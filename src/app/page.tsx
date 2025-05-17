import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full text-center">
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Image
              src="/logo.webp"
              alt=""
              width={200}
              height={200}
              className="object-cover hue-rotate-90"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/sign-up" passHref>
            <Button className="h-10 px-4 text-white text-sm bg-blue-600 hover:bg-blue-700 transition-colors rounded-full">
              Register
              <span className="ml-2 text-xs bg-blue-500/20 px-2 py-0.5 rounded-md">
                ⌘ R
              </span>
            </Button>
          </Link>

          <Link href="/sign-in" passHref>
            <Button
              variant="outline"
              className="h-10 px-4 text-sm border-2 transition-colors rounded-full"
            >
              Login
            </Button>
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-600">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span>Currently in Development mode</span>
        </div>
      </div>
    </div>
  )
}

export default App
