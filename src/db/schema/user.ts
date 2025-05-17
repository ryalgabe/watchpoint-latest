import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { chats } from './chat'
import { onboardingQuestions } from './onboarding'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  clerkId: text('clerk_id').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  experience: text('experience'),
  investmentGoals: text('investment_goals'),
  riskTolerance: text('risk_tolerance'),
})

export const userRelations = relations(users, ({ many }) => ({
  chats: many(chats),
  onboardingQuestions: many(onboardingQuestions),
}))
