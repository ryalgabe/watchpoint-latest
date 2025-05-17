'use server'

import { clerkClient } from '@clerk/nextjs/server'

export async function searchUsers(query: string) {
  try {
    const client = await clerkClient()
    const usersResponse = await client.users.getUserList({
      limit: 10,
    })

    // Extract users from the response
    const users = usersResponse.data || []

    // Filter users by username or email containing the query
    const filteredUsers = users.filter((user: any) => {
      const username = user.username || user.firstName || ''
      const email = user.emailAddresses[0]?.emailAddress || ''

      return (
        username.toLowerCase().includes(query.toLowerCase()) ||
        email.toLowerCase().includes(query.toLowerCase())
      )
    })

    return filteredUsers.map((user: any) => ({
      id: user.id,
      username: user.username || user.firstName || 'Unknown User',
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress,
    }))
  } catch (error) {
    console.error('Error searching users:', error)
    return { error: 'Failed to search users' }
  }
}
