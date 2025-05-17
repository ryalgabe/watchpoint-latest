'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060614] text-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <h1 className="text-7xl font-bold text-[#2E62E8] mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-[#878787] mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link href="/">
          <Button
            variant="outline"
            className="bg-[#15151E] border-[#2A2A37] hover:bg-[#2A2A37] text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
