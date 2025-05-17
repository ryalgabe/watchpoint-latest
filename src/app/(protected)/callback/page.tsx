import { authenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CallbackPage() {
  console.log('Callback page hit')

  const auth = await authenticateUser()
  console.log('Auth result:', auth)

  if (auth.status === 201) {
    console.log('User created, redirecting to onboarding')
    return redirect('/onboarding')
  }

  if (auth.status === 200) {
    console.log('User authenticated, redirecting to dashboard')
    return redirect('/dashboard')
  }

  if (auth.status === 403) {
    console.log('User not found, redirecting to sign in')
    return redirect('/sign-in')
  }

  console.error('Problems with authentication:', auth)
  return redirect('/sign-in')
}
