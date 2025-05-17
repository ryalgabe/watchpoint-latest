import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const client = await clerkClient()
    const user = await client.users.createUser({
      emailAddress: [email],
    })

    await client.users.updateUser(user.id, {
      publicMetadata: {
        onboardingComplete: false,
      },
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
