import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isOnboardingRoute = createRouteMatcher(['/onboarding'])
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  // FOR USERS VISITING /ONBOARDING DONT TRY TO REDIRECT
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next()
  }

  // USER IS NOT SIGNED IN AND THE ROUTE IS PRIVATE REDIRECT TO SIGNIN
  if (!userId && !isPublicRoute(req))
    return redirectToSignIn({ returnBackUrl: req.url })

  // CATCH USERS WHO DO NOT HAVE `onboardingComplete: true` IN THEIR PUBLICMETADATA
  // REDIRECT THEM TO THE /ONBOARDING ROUTE TO COMPLETE ONBOARDING
  // if (userId && sessionClaims?.metadata?.onboardingComplete) {
  //   const onboardingUrl = new URL('/onboarding', req.url)
  //   return NextResponse.redirect(onboardingUrl)
  // }

  // USER IS LOGGED IN AND THE ROUTE IS PROTECTED, LET THEM VIEW
  if (userId && !isPublicRoute(req)) return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
