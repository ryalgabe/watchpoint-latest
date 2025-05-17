import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  jsonb,
  serial,
  real,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  clerkId: text('clerk_id').notNull(),
  name: text('name'),
  username: text('username'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  isPremium: boolean('is_premium').default(false).notNull(),
})

// AI Chat Messages
export const chats = pgTable('chats', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Community Chat Tables
export const communityRooms = pgTable('community_rooms', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  isPrivate: boolean('is_private').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const channels = pgTable('channels', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  isPrivate: boolean('is_private').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const communityChat = pgTable('community_chat', {
  id: uuid('id').defaultRandom().primaryKey(),
  channelId: uuid('channel_id')
    .references(() => channels.id)
    .notNull(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Messages table
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  chatId: text('chat_id')
    .references(() => chats.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  role: text('role', { enum: ['user', 'assistant'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  tokens: integer('tokens'),
})

// Onboarding questions table
export const onboardingQuestions = pgTable('onboarding_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  experience: text('experience').notNull(),
  collections: text('collections').notNull(),
  preferredBrands: text('preferred_brands').notNull(),
  priceRange: text('price_range').notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Direct Messages
export const dmConversations = pgTable('dm_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  user1Id: text('user1_id')
    .references(() => users.id)
    .notNull(),
  user2Id: text('user2_id')
    .references(() => users.id)
    .notNull(),
  lastMessageAt: timestamp('last_message_at').defaultNow(),
  lastMessage: text('last_message'),
  unreadCount: text('unread_count').default('0'),
})

export const directMessages = pgTable('direct_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id')
    .references(() => dmConversations.id)
    .notNull(),
  senderId: text('sender_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  read: boolean('read').default(false),
})

// Relations
export const userRelations = relations(users, ({ many }) => ({
  chats: many(chats),
  onboardingQuestions: many(onboardingQuestions),
  messages: many(communityChat),
  directMessages: many(directMessages),
  conversations1: many(dmConversations, { relationName: 'user1' }),
  conversations2: many(dmConversations, { relationName: 'user2' }),
}))

export const chatRelations = relations(chats, ({ many, one }) => ({
  messages: many(messages),
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
}))

export const chatMessageRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}))

export const onboardingQuestionRelations = relations(
  onboardingQuestions,
  ({ one }) => ({
    user: one(users, {
      fields: [onboardingQuestions.userId],
      references: [users.id],
    }),
  })
)

export const communityChatRelations = relations(communityChat, ({ one }) => ({
  user: one(users, {
    fields: [communityChat.userId],
    references: [users.id],
  }),
  channel: one(channels, {
    fields: [communityChat.channelId],
    references: [channels.id],
  }),
}))

export const communityRoomRelations = relations(communityRooms, ({ many }) => ({
  messages: many(communityChat),
}))

export const dmConversationsRelations = relations(
  dmConversations,
  ({ one, many }) => ({
    user1: one(users, {
      fields: [dmConversations.user1Id],
      references: [users.id],
    }),
    user2: one(users, {
      fields: [dmConversations.user2Id],
      references: [users.id],
    }),
    messages: many(directMessages),
  })
)

export const directMessagesRelations = relations(directMessages, ({ one }) => ({
  conversation: one(dmConversations, {
    fields: [directMessages.conversationId],
    references: [dmConversations.id],
  }),
  sender: one(users, {
    fields: [directMessages.senderId],
    references: [users.id],
  }),
}))

export const watches = pgTable('watches', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  brand: text('brand').notNull(),
  brand_uuid: uuid('brand_uuid').notNull(),
  collection: text('collection').notNull(),
  model: text('model').notNull(),
  reference: text('reference').notNull(),
  nickname: text('nickname'),
  market_price: integer('market_price').notNull(),
  dealer_price: integer('dealer_price').notNull(),
  volatility: text('volatility').notNull(),
  updated: timestamp('updated').notNull().defaultNow(),
})

export const watchRelations = relations(watches, ({ many }) => ({
  priceHistory: many(watchPriceHistory),
}))

// schema/price-history.ts
export const watchPriceHistory = pgTable('watch_price_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  watch_uuid: uuid('watch_uuid')
    .notNull()
    .references(() => watches.uuid),
  date: timestamp('date').notNull().defaultNow(),
  price: integer('price').notNull(),
  volatility: text('volatility').notNull(),
})

export const priceHistoryRelations = relations(
  watchPriceHistory,
  ({ one }) => ({
    watch: one(watches, {
      fields: [watchPriceHistory.watch_uuid],
      references: [watches.uuid],
    }),
  })
)

export const scrappedWatches = pgTable('scrapped_watches', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  name: text('name').notNull(),
  model: text('model'),
  price: real('price'),
  availability: text('availability'),
  description: text('description'),
  stockInfo: text('stock_info'),
  sellerInfo: jsonb('seller_info'),
  photos: jsonb('photos'),
  marketValue: real('market_value'),
  scrapedAt: timestamp('scraped_at').defaultNow(),
})
