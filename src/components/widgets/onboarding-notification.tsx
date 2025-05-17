'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface OnboardingNotificationProps {
  variant?: 'alert' | 'popover'
}

export function OnboardingNotification({
  variant = 'alert',
}: OnboardingNotificationProps) {
  const router = useRouter()

  if (variant === 'alert') {
    return (
      <Alert className="border-amber-500/50 bg-amber-500/10 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/5 dark:text-amber-400">
        <AlertCircle className="h-5 w-5" />
        <div className="flex w-full flex-col gap-y-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <AlertTitle className="text-base font-medium">
              Complete Your Profile
            </AlertTitle>
            <AlertDescription className="text-amber-600/90 dark:text-amber-400/90">
              Please complete your onboarding to unlock all features.
            </AlertDescription>
          </div>
          <Button
            className="mt-2 bg-amber-500 text-white hover:bg-amber-600 sm:mt-0"
            size="sm"
            onClick={() => router.push('/onboarding')}
          >
            Complete Now
          </Button>
        </div>
      </Alert>
    )
  }

  return (
    <Link href="/onboarding">
      <div className="px-4 py-3 hover:bg-[#15151E] transition-colors cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="mt-1 w-2 h-2 bg-red-500 rounded-full" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-white">
              Complete Your Profile
            </p>
            <p className="text-xs text-zinc-400">
              Please complete your onboarding to unlock all features and
              personalized recommendations.
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
