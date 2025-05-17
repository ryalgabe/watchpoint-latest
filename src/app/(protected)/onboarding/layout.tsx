import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  const user = await currentUser()
  if (userId && user?.publicMetadata?.onboardingComplete === true) {
    redirect('/dashboard')
  }

  console.log('onboardingComplete', user?.publicMetadata?.onboardingComplete)

  return <>{children}</>
}
