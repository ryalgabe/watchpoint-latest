'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SignInPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      return router.push('/dashboard')
    }
  }, [isLoaded, user, router])

  const handleSignInAttempt = async (attemptContext: any) => {
    try {
      // If email doesn't exist, create account instead
      if (
        attemptContext.status === 'complete' &&
        attemptContext.reason === 'user_not_found'
      ) {
        setIsCreatingAccount(true)

        // Get the email from the attempt
        const email = attemptContext.identifier

        // Create user account using Clerk
        const response = await fetch('/api/auth/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        if (!response.ok) {
          throw new Error('Failed to create account')
        }

        // Show success message
        toast.success('Account created! Redirecting to onboarding...')

        // Redirect to onboarding
        router.push('/onboarding')
      }
    } catch (error) {
      console.error('Error handling sign in:', error)
      toast.error('Something went wrong. Please try again.')
      setIsCreatingAccount(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.spinner className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid w-full flex-grow items-center px-4 sm:justify-center">
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignIn.Step name="start">
                <Card className="w-full space-y-6 rounded-2xl bg-zinc-900/25 backdrop-blur-sm bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96">
                  <CardHeader>
                    <header className="text-center flex items-center flex-col">
                      <Image
                        src="/logo.webp"
                        alt="WatchPoint"
                        width={48}
                        height={48}
                      />
                      <h1 className="mt-4 text-xl font-medium tracking-tight text-white">
                        {isCreatingAccount
                          ? 'Creating Account...'
                          : 'Sign In to WatchPoint'}
                      </h1>
                    </header>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <div className="grid grid-cols-1 gap-x-4">
                      <Clerk.Connection name="google" asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          type="button"
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Loading scope="provider:google">
                            {(isLoading) =>
                              isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                <>
                                  <Icons.google className="mr-2 size-4" />
                                  <p className="text-sm font-medium text-white/70">
                                    Sign in with Google
                                  </p>
                                </>
                              )
                            }
                          </Clerk.Loading>
                        </Button>
                      </Clerk.Connection>
                    </div>
                    <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                      or
                    </p>
                    <Clerk.Field name="identifier" className="space-y-2">
                      <Clerk.Label className="text-sm font-medium text-white">
                        Email address
                      </Clerk.Label>
                      <Clerk.Input type="email" required asChild>
                        <Input placeholder="your@example.com" />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-red-400" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                'Continue'
                              )
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>

                      <p className="text-center text-sm text-zinc-400">
                        Don&apos;t have an account?{' '}
                        <Clerk.Link
                          navigate="sign-up"
                          className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
                        >
                          Sign up
                        </Clerk.Link>
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>

              <SignIn.Step name="choose-strategy">
                <Card className="w-full space-y-6 rounded-2xl bg-zinc-900/25 backdrop-blur-sm bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8">
                  <CardHeader>
                    <CardTitle className="text-xl font-medium tracking-tight text-white">
                      Use another method
                    </CardTitle>
                    <CardDescription>
                      Facing issues? You can use any of these methods to sign
                      in.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <SignIn.SupportedStrategy name="email_code" asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={isGlobalLoading}
                      >
                        Email code
                      </Button>
                    </SignIn.SupportedStrategy>
                    <SignIn.SupportedStrategy name="password" asChild>
                      <Button
                        type="button"
                        variant="link"
                        disabled={isGlobalLoading}
                      >
                        Password
                      </Button>
                    </SignIn.SupportedStrategy>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action navigate="previous" asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                'Go back'
                              )
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>

              <SignIn.Step name="verifications">
                <SignIn.Strategy name="password">
                  <Card className="w-full space-y-6 rounded-2xl bg-zinc-900/25 backdrop-blur-sm bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8">
                    <CardHeader>
                      <CardTitle className="text-xl font-medium tracking-tight text-white">
                        Check your email
                      </CardTitle>
                      <CardDescription>
                        Enter the verification code sent to your email
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">
                        Welcome back <SignIn.SafeIdentifier />
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="password" className="space-y-2">
                        <Clerk.Label className="text-sm font-medium text-white">
                          Password
                        </Clerk.Label>
                        <div className="relative">
                          <Clerk.Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            asChild
                          >
                            <Input />
                          </Clerk.Input>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Icons.eyeOff className="size-4" />
                            ) : (
                              <Icons.eye className="size-4" />
                            )}
                          </Button>
                        </div>
                        <Clerk.FieldError className="block text-sm text-red-400" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
                          <Button
                            disabled={isGlobalLoading}
                            className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
                          >
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  'Continue'
                                )
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button
                            type="button"
                            size="sm"
                            variant="link"
                            className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
                          >
                            Use another method
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>

                <SignIn.Strategy name="email_code">
                  <Card className="w-full space-y-6 rounded-2xl bg-zinc-900/25 backdrop-blur-sm bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8">
                    <CardHeader>
                      <CardTitle className="text-xl font-medium tracking-tight text-white">
                        Check your email
                      </CardTitle>
                      <CardDescription>
                        Enter the verification code sent to your email
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">
                        Welcome back <SignIn.SafeIdentifier />
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="code">
                        <Clerk.Label className="sr-only">
                          Email verification code
                        </Clerk.Label>
                        <div className="grid gap-y-2 items-center justify-center">
                          <div className="flex justify-center text-center">
                            <Clerk.Input
                              type="otp"
                              autoSubmit
                              className="flex justify-center has-[:disabled]:opacity-50"
                              render={({ value, status }) => {
                                return (
                                  <div
                                    data-status={status}
                                    className="relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md data-[status=selected]:ring-1 data-[status=selected]:ring-ring data-[status=cursor]:ring-1 data-[status=cursor]:ring-ring"
                                  >
                                    {value}
                                  </div>
                                )
                              }}
                            />
                          </div>
                          <Clerk.FieldError className="block text-sm text-red-400 text-center" />
                          <SignIn.Action
                            asChild
                            resend
                            className="text-muted-foreground"
                            fallback={({ resendableAfter }) => (
                              <Button
                                variant="link"
                                size="sm"
                                disabled
                                className="font-medium text-white/50 decoration-white/20 underline-offset-4"
                              >
                                Didn&apos;t recieve a code? Resend (
                                <span className="tabular-nums">
                                  {resendableAfter}
                                </span>
                                )
                              </Button>
                            )}
                          >
                            <Button
                              variant="link"
                              size="sm"
                              className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
                            >
                              Didn&apos;t recieve a code? Resend
                            </Button>
                          </SignIn.Action>
                        </div>
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
                          <Button
                            disabled={isGlobalLoading}
                            className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
                          >
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  'Continue'
                                )
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button
                            size="sm"
                            variant="link"
                            className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
                          >
                            Use another method
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>
              </SignIn.Step>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  )
}
