import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { chats } from '@/db/schema'
import { eq } from 'drizzle-orm'

// @eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userChats = await db.query.chats.findMany({
      where: eq(chats.userId, userId),
      with: {
        messages: true,
      },
      orderBy: (chats, { desc }) => [desc(chats.updatedAt)],
    })

    const formattedChats = userChats.map((chat) => ({
      ...chat,
      messages: chat.messages.map((msg) => ({
        ...msg,
        timestamp: msg.createdAt,
      })),
    }))

    return NextResponse.json(formattedChats)
  } catch (error) {
    console.error('Chat history API error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
