'use client'

import { WatchCard } from '../watchCard'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { sidebarItems, toolItems } from '@/constants'
import { WatchCollection } from '../watchCollections'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useDashboard } from '../context/dashboard-context'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar'

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, setIsSidebarOpen } = useDashboard()

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-[#15151e] overflow-hidden
          transform transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:translate-x-0 lg:h-screen
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          <SidebarHeader className="border-b border-purple-border p-4 bg-third-background">
            <WatchCard
              name="Rolex"
              model="GMT Master II"
              percentage={13.7}
              image="/watch1.png"
            />
          </SidebarHeader>

          <SidebarContent className="bg-third-background">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-1">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-[#878787]">
                    Navigation
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <div>
                      {sidebarItems.map((item) => (
                        <Link href={item.href} key={item.label}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start gap-2 text-[#878787] hover:text-white hover:bg-[#2a2a37] ${pathname === item.href ? 'text-white bg-[#2a2a37]/50' : ''}`}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel className="text-[#878787]">
                    Tools
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <div className="space-y-1">
                      {toolItems.map((item) => (
                        <Link href={item.href} key={item.label}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start gap-3 text-[#878787] hover:text-white hover:bg-[#2a2a37] ${pathname === item.href ? 'text-white bg-[#2a2a37]/50' : ''}`}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>

                <WatchCollection />
              </div>
            </ScrollArea>
          </SidebarContent>
        </div>
      </aside>
    </>
  )
}
