'use client'

import { Message } from 'ai'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  message: Message
  isTyping: boolean
  isLast: boolean
}

export function ChatMessage({ message, isTyping, isLast }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        message.role === 'user' && 'flex-row-reverse'
      )}
    >
      <Avatar
        className={cn(
          'h-8 w-8 border-2',
          message.role === 'assistant' ? 'border-[#2E62E8]' : 'border-white/20'
        )}
      >
        <AvatarImage
          src={message.role === 'assistant' ? '/logo.webp' : undefined}
        />
        <AvatarFallback
          className={message.role === 'assistant' ? 'bg-[#2E62E8]' : ''}
        >
          {message.role === 'assistant' ? 'AI' : 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="group relative">
        <div
          className={cn(
            'group relative rounded-2xl px-4 py-3 text-sm transition-all',
            message.role === 'assistant'
              ? 'bg-[#15151E] text-white'
              : 'bg-gradient-to-r from-[#2E62E8] to-[#1E50D5] text-white'
          )}
        >
          {message.role === 'assistant' ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : (
            message.content
          )}
          {isTyping && isLast && message.role === 'assistant' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1 mt-2"
            >
              <div className="w-2 h-2 rounded-full bg-[#2E62E8] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#2E62E8] animate-bounce delay-150" />
              <div className="w-2 h-2 rounded-full bg-[#2E62E8] animate-bounce delay-300" />
            </motion.div>
          )}
        </div>
        <div
          className={cn(
            'absolute -bottom-5 left-0 text-xs text-[#878787] opacity-0 transition-opacity',
            'group-hover:opacity-100'
          )}
        >
          {new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  )
}
