'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { cache } from 'react'

// Create a cached version of getUserById to improve performance
export const getUserById = cache(async (userId: string) => {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return {
      id: user.id,
      username: user.username || user.firstName || 'Unknown User',
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress,
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { error: 'Failed to fetch user' }
  }
})

// Add a function to get multiple users at once for better performance
export async function getUsersByIds(userIds: string[]) {
  try {
    // Remove duplicates
    const uniqueIds = [...new Set(userIds)]

    if (uniqueIds.length === 0) {
      return []
    }

    // Fetch all users in a single request
    const client = await clerkClient()
    const users = await client.users.getUserList({
      userId: uniqueIds,
    })

    return users.data.map((user: any) => ({
      id: user.id,
      username: user.username || user.firstName || 'Unknown User',
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress,
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    return { error: 'Failed to fetch users' }
  }
}
