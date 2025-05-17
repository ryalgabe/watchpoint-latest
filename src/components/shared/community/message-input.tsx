import { useState, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { SendHorizontal, Smile, Loader2 } from 'lucide-react'
import { socket } from '@/lib/socket'

interface MessageInputProps {
  onSendMessage: (content: string) => void
  disabled?: boolean
  placeholder?: string
  conversationId?: string
  isDM?: boolean
}

export function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type your message...',
  conversationId,
  isDM = false,
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [message])

  // Handle typing indicator
  useEffect(() => {
    if (!conversationId) return

    if (message && !isTyping) {
      setIsTyping(true)
      socket.emit('typing-start', { channelId: conversationId })
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false)
        socket.emit('typing-stop', { channelId: conversationId })
      }
    }, 1000)

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [message, isTyping, conversationId])

  const handleSendMessage = () => {
    const trimmed = message.trim()
    if (trimmed && !disabled) {
      onSendMessage(trimmed)
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }

      // Stop typing indicator when message is sent
      if (isTyping) {
        setIsTyping(false)
        socket.emit('typing-stop', { channelId: conversationId })
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          placeholder={placeholder}
          className="min-h-[44px] max-h-[200px] resize-none bg-main-background border-purple-border/50 text-white placeholder-[#878787] focus:ring-purple-400/30 pr-10"
          disabled={disabled}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#878787] hover:text-white hover:bg-[#2a2a37]"
        >
          <Smile className="h-5 w-5" />
        </Button>
      </div>
      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || disabled}
        className="bg-primary-blue hover:bg-primary-blue/80 transition-colors"
      >
        {disabled ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <SendHorizontal className="h-5 w-5" />
        )}
      </Button>
    </div>
  )
}
