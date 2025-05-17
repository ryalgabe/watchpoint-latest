import { LayoutTransition } from '@/components/provider/layout-transition'
import DashboardWindow from '@/components/shared/dashboard-window'
import { AIAssistant } from '@/components/widgets/ai-layout'
import { currentUser } from '@clerk/nextjs/server'
import { OnboardingNotification } from '@/components/widgets/onboarding-notification'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  if (!user?.publicMetadata?.onboardingComplete) {
    redirect('/onboarding')
  }

  const needsOnboarding = !user?.publicMetadata?.onboardingComplete

  return (
    <div className="min-h-screen bg-background">
      {needsOnboarding && <OnboardingNotification variant="alert" />}
      <DashboardWindow>
        <LayoutTransition
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.15,
              ease: [0.4, 0, 1, 1],
            },
          }}
        >
          {children}
        </LayoutTransition>
        <AIAssistant />
      </DashboardWindow>
    </div>
  )
}
