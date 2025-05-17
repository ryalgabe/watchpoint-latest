import { OnboardingLayout } from '@/components/layouts/onboarding-layout'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return <OnboardingLayout />
}
