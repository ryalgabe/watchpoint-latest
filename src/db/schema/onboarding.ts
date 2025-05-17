import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './user'

export const onboardingQuestions = pgTable('onboarding_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  experience: text('experience').notNull(),
  investmentGoals: text('investment_goals').notNull(),
  preferredBrands: text('preferred_brands').array(),
  priceRange: text('price_range').notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const onboardingQuestionRelations = relations(
  onboardingQuestions,
  ({ one }) => ({
    user: one(users, {
      fields: [onboardingQuestions.userId],
      references: [users.id],
    }),
  })
)
