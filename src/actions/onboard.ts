'use server'

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { db } from '@/db'
import { onboardingQuestions, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const onboardingSchema = z.object({
  experience: z.string().min(1, 'Experience is required'),
  collections: z.string().min(1, 'Collections are required'),
  preferredBrands: z.string().min(1, 'Preferred brands are required'),
  priceRange: z.string().min(1, 'Price range is required'),
})

export async function completeOnboarding(formData: FormData) {
  try {
    const { userId } = await auth()
    const clerkUser = await currentUser()

    if (!userId || !clerkUser) {
      return { error: 'Authentication required' }
    }

    // Extract and parse form data
    // const formValues = {
    //   experience: formData.get('experience') as string,
    //   collections: formData.get('collections') as string,
    //   preferredBrands: formData.get('preferredBrands') as string,
    //   priceRange: formData.get('priceRange') as string,
    // }

    const formValues = {
      experience: formData.get('experience') as string,
      collections: formData.get('collections') as string,
      preferredBrands: formData.get('preferredBrands') as string,
      priceRange: formData.get('priceRange') as string,
    }

    // const onboardingData = {
    //   experience: formValues.experience,
    //   collections: formValues.collections,
    //   preferredBrands: formValues.preferredBrands,
    //   priceRange: formValues.priceRange,
    //   completed: true,
    // }

    console.log('Form values:', formValues)

    // Validate form data
    const validationResult = onboardingSchema.safeParse(formValues)
    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error)
      return { error: 'Invalid form data' }
    }

    // Find user in database
    let user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    })

    // If user doesn't exist in our database yet, create them
    if (!user) {
      console.log('User not found, creating now')
      const [newUser] = await db
        .insert(users)
        .values({
          id: clerkUser.id,
          clerkId: clerkUser.id,
          name: clerkUser.fullName || '',
          username: clerkUser.username || '',
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          imageUrl: clerkUser.imageUrl || '',
          isPremium: false,
          onboardingCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      user = newUser
    }

    if (!user) {
      return { error: 'Failed to create or find user' }
    }

    console.log('Working with user:', user)

    // Update user onboarding status
    await db
      .update(users)
      .set({ onboardingCompleted: true })
      .where(eq(users.id, user.id))

    // Check for existing onboarding data
    const existingOnboarding = await db.query.onboardingQuestions.findFirst({
      where: eq(onboardingQuestions.userId, user.id),
    })

    // Update or insert onboarding data
    const onboardingData = {
      experience: formValues.experience,
      collections: formValues.collections,
      preferredBrands: formValues.preferredBrands,
      priceRange: formValues.priceRange,
      completed: true,
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
      })
    }

    // Update Clerk user metadata
    const client = await clerkClient()
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        experience: formValues.experience,
        collections: formValues.collections,
        preferredBrands: formValues.preferredBrands.split(', '),
        priceRange: formValues.priceRange,
        isPremium: false,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return { error: `Failed to complete onboarding: ${error}` }
  }
}
