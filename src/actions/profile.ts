'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users, onboardingQuestions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const profileSchema = z.object({
  userId: z.string().min(1),
  fullName: z.string().min(1, 'Full name is required'),
  username: z.string().min(1, 'Username is required'),
})

const preferencesSchema = z.object({
  userId: z.string().min(1),
  experience: z.string().min(1, 'Experience is required'),
  priceRange: z.string().min(1, 'Price range is required'),
  preferredBrands: z.array(z.string()),
})

export async function updateProfile(formData: {
  userId: string
  fullName: string
  username: string
}) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: 'Authentication required' }
    }

    // Validate form data
    const validationResult = profileSchema.safeParse(formData)
    if (!validationResult.success) {
      return { error: 'Invalid form data' }
    }

    // Update user in Clerk
    const client = await clerkClient()
    await client.users.updateUser(formData.userId, {
      firstName: formData.fullName.split(' ')[0],
      lastName: formData.fullName.split(' ').slice(1).join(' '),
      username: formData.username,
    })

    // Update user in database
    await db
      .update(users)
      .set({
        name: formData.fullName,
        username: formData.username,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, formData.userId))

    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { error: `Failed to update profile: ${error}` }
  }
}

export async function updateOnboardingPreferences(formData: {
  userId: string
  experience: string
  priceRange: string
  collections: string[]
  preferredBrands: string[]
}) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: 'Authentication required' }
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    })

    if (!user) {
      return { error: 'User not found in database' }
    }

    // Update user onboarding status
    await db
      .update(users)
      .set({
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    // Check for existing onboarding data
    const existingOnboarding = await db.query.onboardingQuestions.findFirst({
      where: eq(onboardingQuestions.userId, user.id),
    })

    const onboardingData = {
      experience: formData.experience,
      collections: formData.collections.join(', '),
      preferredBrands: formData.preferredBrands.join(', '),
      priceRange: formData.priceRange,
      completed: true,
      updatedAt: new Date(),
    }

    if (existingOnboarding) {
      await db
        .update(onboardingQuestions)
        .set(onboardingData)
        .where(eq(onboardingQuestions.userId, user.id))
    } else {
      await db.insert(onboardingQuestions).values({
        userId: user.id,
        ...onboardingData,
        createdAt: new Date(),
      })
    }

    // Update Clerk user metadata
    const client = await clerkClient()
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        experience: formData.experience,
        collections: formData.collections.join(', '),
        preferredBrands: formData.preferredBrands,
        priceRange: formData.priceRange,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating preferences:', error)
    return { error: `Failed to update preferences: ${error}` }
  }
}

export async function deleteAccount() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: 'Authentication required' }
    }

    // Delete user from database first
    await db.delete(users).where(eq(users.clerkId, userId))

    // Delete user from Clerk
    const client = await clerkClient()
    await client.users.deleteUser(userId)

    return { success: true }
  } catch (error) {
    console.error('Error deleting account:', error)
    return { error: `Failed to delete account: ${error}` }
  }
}
