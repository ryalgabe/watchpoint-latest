'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Menu,
  User,
  Settings,
  Bell,
  CreditCard,
  Shield,
  LogOut,
  HelpCircle,
} from 'lucide-react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface MobileNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function MobileNavigation({
  activeTab,
  setActiveTab,
}: MobileNavigationProps) {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [isOpen, setIsOpen] = useState(false)

  const isPremium = isLoaded
    ? (user?.publicMetadata.isPremium as boolean) || false
    : false

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setIsOpen(false)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden bg-[#15151E]/60 rounded-xl"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-[#0B0B1A] border-[#2A2A37] p-0 w-[300px]"
        >
          <SheetHeader className="p-6 text-left border-b border-[#2A2A37]">
            <SheetTitle className="text-white text-xl">
              Account Settings
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col items-center text-center p-6 border-b border-[#2A2A37]">
            <Avatar className="w-20 h-20 border-2 border-[#2A2A37]">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-[#15151E] text-xl font-bold">
                {user?.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 font-semibold text-lg">{user?.fullName}</h2>
            <p className="text-[#878787]">@{user?.username}</p>

            <Badge
              className={`mt-3 ${
                isPremium
                  ? 'bg-[#2E62E8]/10 text-[#2E62E8] border border-[#2E62E8]/30 px-3 py-1 rounded-lg'
                  : 'bg-[#15151E] border-[#2A2A37] px-3 py-1 rounded-lg'
              }`}
            >
              {isPremium ? 'Premium' : 'Free'} Plan
            </Badge>
          </div>

          <div className="p-4">
            <Button
              variant="ghost"
              className={`w-full justify-start p-3 mb-2 rounded-xl ${
                activeTab === 'profile' ? 'bg-[#15151E]' : 'hover:bg-[#15151E]'
              }`}
              onClick={() => handleTabChange('profile')}
            >
              <User className="w-5 h-5 mr-3" />
              Profile
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start p-3 mb-2 rounded-xl ${
                activeTab === 'preferences'
                  ? 'bg-[#15151E]'
                  : 'hover:bg-[#15151E]'
              }`}
              onClick={() => handleTabChange('preferences')}
            >
              <Settings className="w-5 h-5 mr-3" />
              Preferences
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start p-3 mb-2 rounded-xl ${
                activeTab === 'notifications'
                  ? 'bg-[#15151E]'
                  : 'hover:bg-[#15151E]'
              }`}
              onClick={() => handleTabChange('notifications')}
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start p-3 mb-2 rounded-xl ${
                activeTab === 'subscription'
                  ? 'bg-[#15151E]'
                  : 'hover:bg-[#15151E]'
              }`}
              onClick={() => handleTabChange('subscription')}
            >
              <CreditCard className="w-5 h-5 mr-3" />
              Subscription
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start p-3 mb-2 rounded-xl ${
                activeTab === 'security' ? 'bg-[#15151E]' : 'hover:bg-[#15151E]'
              }`}
              onClick={() => handleTabChange('security')}
            >
              <Shield className="w-5 h-5 mr-3" />
              Security
            </Button>
          </div>

          <Separator className="bg-[#2A2A37] my-2" />

          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start p-3 mb-2 rounded-xl hover:bg-[#15151E]"
              onClick={() => router.push('/help')}
            >
              <HelpCircle className="w-5 h-5 mr-3" />
              Help & Support
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start p-3 text-red-400 hover:bg-[#15151E] hover:text-red-300 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
