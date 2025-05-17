'use client'

import { ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const quickPrompts = [
  { id: 1, text: 'Trending watches', icon: Sparkles },
  { id: 2, text: 'Market analysis', icon: ChevronRight },
  { id: 3, text: 'Investment opportunities', icon: ChevronRight },
  { id: 4, text: 'Price predictions', icon: ChevronRight },
]

interface QuickPromptsProps {
  onSelect: (value: string) => void
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="flex gap-2 pb-2">
      {quickPrompts.map((prompt) => (
        <Button
          key={prompt.id}
          variant="outline"
          className="flex-shrink-0 bg-[#15151E]/50 border-[#2A2A37] hover:bg-[#15151E] hover:border-[#2E62E8] transition-all duration-200"
          onClick={() => onSelect(prompt.text)}
        >
          <prompt.icon className="w-4 h-4 mr-2" />
          {prompt.text}
        </Button>
      ))}
    </div>
  )
}
