import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const runMigration = async () => {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ Migration failed: No database connection string.')
    process.exit(1)
  }

  try {
    console.log('⏳ Running migrations...')
    const sql = neon(databaseUrl)
    const db = drizzle(sql)

    await migrate(db, { migrationsFolder: 'drizzle' })

    console.log('✅ Migrations completed.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration()
