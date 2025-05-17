import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { chats } from '@/db/schema'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { title = 'New Chat' } = await req.json()

    const [newChat] = await db
      .insert(chats)
      .values({
        id: crypto.randomUUID(),
        userId,
        title,
      })
      .returning()

    // Return the chat with empty messages array
    return NextResponse.json({
      ...newChat,
      messages: [],
    })
  } catch (error) {
    console.error('Create chat API error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
