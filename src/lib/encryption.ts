import { AES, enc } from 'crypto-js'

// Generate a unique encryption key for each conversation
export function generateConversationKey(
  user1Id: string,
  user2Id: string
): string {
  // Sort IDs to ensure the same key is generated regardless of order
  const sortedIds = [user1Id, user2Id].sort().join('_')
  // Create a deterministic but secure key based on the user IDs
  return enc.Hex.stringify(enc.Utf8.parse(sortedIds))
}

// Encrypt message content
export function encryptMessage(
  content: string,
  conversationKey: string
): string {
  return AES.encrypt(content, conversationKey).toString()
}

// Decrypt message content
export function decryptMessage(
  encryptedContent: string,
  conversationKey: string
): string {
  try {
    const bytes = AES.decrypt(encryptedContent, conversationKey)
    return bytes.toString(enc.Utf8)
  } catch (error) {
    console.error('Failed to decrypt message:', error)
    return '[Encrypted message]'
  }
}
