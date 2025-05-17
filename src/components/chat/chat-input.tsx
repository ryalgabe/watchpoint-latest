'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { QuickPrompts } from './quick-prompts'

interface ChatInputProps {
  isLoading: boolean
  onSubmit: (value: string) => Promise<void>
  showQuickPrompts?: boolean
}

export function ChatInput({
  isLoading,
  onSubmit,
  showQuickPrompts = false,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setInputValue('')
    await onSubmit(inputValue)
  }

  return (
    <div className="space-y-4">
      {showQuickPrompts && (
        <ScrollArea className="w-full">
          <QuickPrompts
            onSelect={(value) => {
              setInputValue(value)
              onSubmit(value)
            }}
          />
        </ScrollArea>
      )}

      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask your question..."
          className="flex-1 h-12 pl-4 pr-12 bg-[#15151E]/50 border-[#2A2A37] text-white placeholder:text-[#878787] 
                   focus-visible:ring-[#2E62E8] focus-visible:ring-offset-0 focus-visible:border-[#2E62E8]
                   rounded-xl transition-all duration-200"
        />
        <Button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="h-12 px-4 bg-gradient-to-r from-[#2E62E8] to-[#1E50D5] hover:from-[#2456D1] hover:to-[#1A47C0]
                   rounded-xl transition-all duration-200"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
