'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Settings,
  Bell,
  CreditCard,
  Shield,
  LogOut,
  HelpCircle,
} from 'lucide-react'
import { useUser, useClerk } from '@clerk/nextjs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProfileSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function ProfileSidebar({
  activeTab,
  setActiveTab,
}: ProfileSidebarProps) {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      const metadata = user.publicMetadata
      setIsPremium((metadata.isPremium as boolean) || false)
    }
  }, [user, isLoaded])

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
    <div className="hidden lg:flex flex-col max-w-fit bg-[#0B0B1A] border rounded-xl border-[#2A2A37]">
      <div className="flex flex-col items-center text-center p-6 border-b border-[#2A2A37]">
        <Avatar className="w-20 h-20 border-2 border-[#2A2A37]">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback className="bg-[#15151E]">
            {user?.fullName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <h2 className="mt-4 font-semibold text-lg">{user?.fullName}</h2>
        <p className="text-[#878787]">@{user?.username}</p>

        <Badge
          variant="outline"
          className={`mt-3 ${
            isPremium
              ? 'bg-[#2E62E8]/10 text-[#2E62E8] border-[#2E62E8]'
              : 'bg-[#15151E] border-[#2A2A37]'
          }`}
        >
          {isPremium ? 'Premium' : 'Free'} Plan
        </Badge>
      </div>

      <Separator className="bg-[#2A2A37]" />

      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start',
              activeTab === 'profile' && 'bg-[#15151E]'
            )}
            onClick={() => setActiveTab('profile')}
          >
            <User className="w-5 h-5 mr-3" />
            <span>Profile</span>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start',
              activeTab === 'preferences' && 'bg-[#15151E]'
            )}
            onClick={() => setActiveTab('preferences')}
          >
            <Settings className="w-5 h-5 mr-3" />
            <span>Preferences</span>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start',
              activeTab === 'notifications' && 'bg-[#15151E]'
            )}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="w-5 h-5 mr-3" />
            <span>Notifications</span>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start',
              activeTab === 'subscription' && 'bg-[#15151E]'
            )}
            onClick={() => setActiveTab('subscription')}
          >
            <CreditCard className="w-5 h-5 mr-3" />
            <span>Subscription</span>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start',
              activeTab === 'security' && 'bg-[#15151E]'
            )}
            onClick={() => setActiveTab('security')}
          >
            <Shield className="w-5 h-5 mr-3" />
            <span>Security</span>
          </Button>
        </nav>
      </div>

      <div className="p-4 border-t border-[#2A2A37]">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => router.push('/help')}
          >
            <HelpCircle className="w-5 h-5 mr-3" />
            <span>Help & Support</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
