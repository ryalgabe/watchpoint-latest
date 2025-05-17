'use server'

import { currentUser } from '@clerk/nextjs/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const authenticateUser = async () => {
  try {
    const user = await currentUser()

    if (!user) {
      return { status: 403, message: 'No user found' }
    }

    console.log('Clerk user:', user.id)

    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, user.id),
    })

    if (existingUser) {
      return { status: 200, user: existingUser }
    }

    const uniqueId = user.id

    // const userWithSameId = await db.query.users.findFirst({
    //   where: eq(users.id, uniqueId),
    // })

    // if (userWithSameId) {
    //   return { status: 409, message: 'User already exists' }
    // }

    const [newUser] = await db
      .insert(users)
      .values({
        id: uniqueId,
        clerkId: user.id,
        name: user.fullName || '',
        username: user.username || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        imageUrl: user.imageUrl || '',
        isPremium: false,
        onboardingCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    console.log('New user created:', newUser)

    const client = await clerkClient()
    await client.users.updateUser(user.id, {
      publicMetadata: {
        onboardingComplete: false,
        isPremium: false,
      },
    })

    return { status: 201, user: newUser }
  } catch (error) {
    console.error('Error authenticating/creating user:', error)
    return { status: 500, message: 'Error authenticating/creating user' }
  }
}
