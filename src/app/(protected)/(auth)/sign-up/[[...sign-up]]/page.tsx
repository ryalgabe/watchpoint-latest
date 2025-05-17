'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function SignUpPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const sanitizedValue = value.replace(/[^a-z0-9-]/g, '').toLowerCase()
    setUsername(sanitizedValue)
  }

  useEffect(() => {
    if (isLoaded && user) {
      router.push('/callback')
    }
  }, [isLoaded, user, router])

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.spinner className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid w-full flex-grow items-center px-4 sm:justify-center">
      <SignUp.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignUp.Step
                name="start"
                className="w-full space-y-6 rounded-2xl bg-zinc-900/25 backdrop-blur-sm bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8"
              >
                <header className="text-center flex items-center flex-col">
                  <Image
                    src="/logo.webp"
                    alt="WatchPoint"
                    width={48}
                    height={48}
                  />
                  <h1 className="mt-4 text-xl font-medium tracking-tight text-white">
                    Create an account
                  </h1>
                </header>
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
                                Sign up with Google
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
                <Clerk.GlobalError className="block text-sm text-red-400" />
                <div className="space-y-4">
                  <Clerk.Field name="email" className="space-y-2">
                    <Clerk.Label className="text-sm font-medium text-white">
                      Email address
                    </Clerk.Label>
                    <Clerk.Input
                      type="email"
                      placeholder="create@example.com"
                      required
                      asChild
                    >
                      <Input />
                    </Clerk.Input>
                    <Clerk.FieldError className="block text-sm text-red-400" />
                  </Clerk.Field>
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
                </div>
                {/* CAPTCHA Widget */}
                <div className="captcha-container">
                  <div
                    id="clerk-captcha"
                    data-cl-theme="dark"
                    data-cl-size="normal"
                    data-cl-language="auto"
                  ></div>
                  <SignUp.Captcha className="empty:hidden" />
                </div>
                <SignUp.Action
                  submit
                  className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
                >
                  Sign Up
                </SignUp.Action>
                <p className="text-center text-sm text-zinc-400">
                  Have an account?{' '}
                  <Clerk.Link
                    navigate="sign-in"
                    className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
                  >
                    Sign in
                  </Clerk.Link>
                </p>
              </SignUp.Step>

              <SignUp.Step name="continue">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>Continue registration</CardTitle>
                    <CardDescription>
                      Please fill in the following details to continue
                      registration.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Clerk.Field name="username" className="space-y-2">
                      <Clerk.Label>
                        <Label>Username</Label>
                      </Clerk.Label>
                      <Clerk.Input
                        type="text"
                        required
                        asChild
                        onChange={handleUsernameChange}
                        value={username}
                      >
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-red-500" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignUp.Action submit asChild>
                        <Button disabled={isGlobalLoading}>
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
                      </SignUp.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignUp.Step>

              <SignUp.Step
                name="verifications"
                className="w-full space-y-6 rounded-2xl bg-neutral-900 bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8"
              >
                <header className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 40 40"
                    className="mx-auto size-10"
                  >
                    <mask
                      id="a"
                      width="40"
                      height="40"
                      x="0"
                      y="0"
                      maskUnits="userSpaceOnUse"
                    >
                      <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
                    </mask>
                    <g fill="#fff" mask="url(#a)">
                      <path d="M43.5 3a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V2ZM43.5 8a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V7ZM43.5 13a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 18a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 23a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 28a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 33a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 38a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1Z" />
                      <path d="M27 3.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 8.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM23 13.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM21.5 18.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM20.5 23.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM22.5 28.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 33.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM27 38.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2Z" />
                    </g>
                  </svg>
                  <h1 className="mt-4 text-xl font-medium tracking-tight text-white">
                    Verify email code
                  </h1>
                </header>
                <Clerk.GlobalError className="block text-sm text-red-400" />
                <SignUp.Strategy name="email_code">
                  <Clerk.Field name="code" className="space-y-2">
                    <Clerk.Label className="text-sm font-medium text-white">
                      Email code
                    </Clerk.Label>
                    <Clerk.Input
                      required
                      className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
                    />
                    <Clerk.FieldError className="block text-sm text-red-400" />
                  </Clerk.Field>
                  <SignUp.Action
                    submit
                    className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
                  >
                    Finish registration
                  </SignUp.Action>
                </SignUp.Strategy>
                <p className="text-center text-sm text-zinc-400">
                  Have an account?{' '}
                  <Clerk.Link
                    navigate="sign-in"
                    className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
                  >
                    Sign in
                  </Clerk.Link>
                </p>
              </SignUp.Step>
            </>
          )}
        </Clerk.Loading>
      </SignUp.Root>
    </div>
  )
}
