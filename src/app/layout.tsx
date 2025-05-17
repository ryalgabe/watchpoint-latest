import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/provider/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { LayoutTransition } from '@/components/provider/layout-transition'
import { Toaster } from 'sonner'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Watchpoint Advisory',
  description: 'Get detailed information about the watches in the market',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${spaceGrotesk.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutTransition
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {children}
              <Toaster richColors position="top-right" closeButton />
            </LayoutTransition>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
