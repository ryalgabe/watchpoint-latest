'use server'

import { db } from '@/db'
import { dmConversations, users } from '@/db/schema'
import { eq, or } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'

export async function getDMConversations() {
  const user = await currentUser()
  if (!user) {
    return []
  }

  // Only fetch convos where current user is a participant
  const conversations = await db.query.dmConversations.findMany({
    where: or(
      eq(dmConversations.user1Id, user.id),
      eq(dmConversations.user2Id, user.id)
    ),
    orderBy: (fields) => fields.lastMessageAt,
  })

  // Enrich with other user data
  const result = await Promise.all(
    conversations.map(async (conv) => {
      const otherId = conv.user1Id === user.id ? conv.user2Id : conv.user1Id
      const other = await db.query.users.findFirst({
        where: eq(users.id, otherId),
      })
      return {
        ...conv,
        user: {
          userId: otherId,
          username: other?.username || 'Unknown User',
          avatarUrl: other?.imageUrl || '',
        },
      }
    })
  )

  // Sort by most recent message
  return result.sort(
    (a, b) =>
      (b.lastMessageAt?.getTime() || 0) - (a.lastMessageAt?.getTime() || 0)
  )
}
