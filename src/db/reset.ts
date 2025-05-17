import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const reset = async () => {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ No database connection string provided')
    process.exit(1)
  }

  try {
    console.log('⏳ Resetting database...')
    const sql = neon(databaseUrl)

    // Drop tables one by one (Neon does not allow multiple statements)
    await sql`DROP TABLE IF EXISTS messages CASCADE;`
    await sql`DROP TABLE IF EXISTS chats CASCADE;`
    await sql`DROP TABLE IF EXISTS onboarding_questions CASCADE;`
    await sql`DROP TABLE IF EXISTS users CASCADE;`
    await sql`DROP TABLE IF EXISTS community_chat CASCADE;`
    await sql`DROP TABLE IF EXISTS channels CASCADE;`
    await sql`DROP TABLE IF EXISTS direct_messages CASCADE;`
    await sql`DROP TABLE IF EXISTS community_rooms CASCADE;`
    await sql`DROP TABLE IF EXISTS dm_conversations CASCADE;`
    await sql`DROP TABLE IF EXISTS dm_messages CASCADE;`
    await sql`DROP TABLE IF EXISTS community_chat_messages CASCADE;`

    console.log('✅ Database reset complete')
    process.exit(0)
  } catch (error) {
    console.error('❌ Reset failed:', error)
    process.exit(1)
  }
}

reset().catch(console.error)
