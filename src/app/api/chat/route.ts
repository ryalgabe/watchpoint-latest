import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { messages as dbMessages, chats } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new NextResponse('Unauthorized', { status: 401 })

    const { messages, chatId } = await req.json()

    if (!userId || !messages?.length || !chatId) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Insert user message
    await db.insert(dbMessages).values({
      id: crypto.randomUUID(),
      chatId,
      userId,
      content: messages[messages.length - 1].content,
      role: 'user',
    })

    // For new chats, generate and update title
    const isNewChat = messages.length === 1
    if (isNewChat) {
      const titleResponse = await streamText({
        model: openai('gpt-4o-mini'),
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that generates short 2-3 word titles for chat conversations. Generate a title for this chat based on the first message.',
          },
          messages[0],
        ],
      })

      const title = (await titleResponse.text) || 'New Chat'

      await db
        .update(chats)
        .set({
          title,
          updatedAt: new Date(),
        })
        .where(eq(chats.id, chatId))
    }

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      onFinish: async (event) => {
        await db.insert(dbMessages).values({
          id: crypto.randomUUID(),
          chatId,
          userId,
          content: event.steps[event.steps.length - 1].text,
          role: 'assistant',
        })

        await db
          .update(chats)
          .set({
            updatedAt: new Date(),
          })
          .where(eq(chats.id, chatId))
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error in chat route:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
