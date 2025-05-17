import { LayoutTransition } from '@/components/provider/layout-transition'
import { EnhancedButton } from '@/components/ui/enchancedbtn'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Particles from '@/components/ui/particles'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LayoutTransition
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed top-4 left-4 m-4">
            <Link href="/">
              <EnhancedButton
                variant="expandIcon"
                Icon={ArrowLeft}
                className="flex items-center justify-center gap-2"
                iconPlacement="left"
              >
                Go Back
              </EnhancedButton>
            </Link>
          </div>
          {children}
        </LayoutTransition>
        <div className="fixed bottom-4 text-center text-sm text-zinc-500">
          <Link href="#" className="hover:text-zinc-300 transition-all">
            Terms of Service
          </Link>
          {' · '}
          <Link href="#" className="hover:text-zinc-300 transition-all">
            Privacy Policy
          </Link>
        </div>
      </div>
      <Particles
        quantityDesktop={160}
        quantityMobile={100}
        ease={80}
        refresh={true}
      />
    </>
  )
}
