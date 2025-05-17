'use client'

import { Bell, ChevronDown, Menu, LogOut } from 'lucide-react'
import { SignOutButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useDashboard } from '../context/dashboard-context'
import { SearchBar } from '@/components/shared/searchBar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Link from 'next/link'
import { OnboardingNotification } from '@/components/widgets/onboarding-notification'
import { menuItems } from '@/constants'

export function DashboardHeader() {
  const { user } = useUser()
  const { setIsSidebarOpen } = useDashboard()
  const hasCompletedOnboarding = user?.publicMetadata?.onboardingComplete

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#2a2a37] bg-[#060614] px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-[#878787] hover:text-white hover:bg-[#2a2a37]"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-xl font-semibold text-white">WP.</span>
        </div>

        <div className="hidden md:block max-w-[400px] w-full mx-4">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {!hasCompletedOnboarding && (
                  <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 bg-[#0B0B1A] border-[#2a2a37] p-0"
            >
              <div className="flex flex-col">
                <div className="px-4 py-3 border-b border-[#2a2a37]">
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>

                <div className="py-2">
                  {!hasCompletedOnboarding ? (
                    <OnboardingNotification variant="popover" />
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-zinc-400">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2.5 px-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                <Avatar className="h-8 w-8 border border-zinc-700/50">
                  <AvatarImage src={user?.imageUrl} className="object-cover" />
                  <AvatarFallback className="bg-zinc-800 text-zinc-200">
                    {user?.firstName?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline font-medium">
                  Hi, {user?.firstName}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#0B0B1A] border-[#2a2a37] shadow-xl shadow-black/20 p-1"
            >
              {menuItems.map((item, index) => (
                <Link href={item.href} key={index}>
                  <DropdownMenuItem className={item.className}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                </Link>
              ))}
              <DropdownMenuSeparator className="bg-[#2a2a37] my-1" />
              <SignOutButton redirectUrl="/">
                <DropdownMenuItem className="text-red-400 hover:bg-zinc-800/70 focus:bg-zinc-800/70 cursor-pointer flex items-center gap-2 py-2.5">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="p-4 md:hidden">
        <SearchBar />
      </div>
    </>
  )
}
