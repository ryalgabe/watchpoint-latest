import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

interface LessonDescriptionProps {
  showDescription: boolean
  setShowDescription: (show: boolean) => void
}

export function LessonDescription({
  showDescription,
  setShowDescription,
}: LessonDescriptionProps) {
  return (
    <div className="bg-[#0B0B1A]/50 rounded-2xl p-8 border border-[#2A2A37]/50 backdrop-blur-sm">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
        Lesson 1: Introduction to watch investment
      </h1>
      <Button
        variant="ghost"
        className="w-full justify-between hover:bg-[#15151E]/50 mb-4 py-4 rounded-xl"
        onClick={() => setShowDescription(!showDescription)}
      >
        <span className="font-semibold">Lesson Description</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            showDescription ? 'transform rotate-180' : ''
          }`}
        />
      </Button>
      {showDescription && <DescriptionContent />}
    </div>
  )
}

function DescriptionContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="prose prose-invert max-w-none"
    >
      <p className="text-[#878787] leading-relaxed">
        In this video lesson, we're going to cover the fundamentals of watch
        investment. You'll learn about the key factors that make certain
        timepieces valuable, how to identify potential investment opportunities,
        and understand the basics of market dynamics.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-4">Key Topics:</h3>
      <ul className="space-y-2 text-[#878787]">
        <li className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2E62E8]" />
          Understanding watch market fundamentals
        </li>
        <li className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2E62E8]" />
          Identifying valuable timepieces
        </li>
        <li className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2E62E8]" />
          Basic market analysis techniques
        </li>
        <li className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2E62E8]" />
          Risk assessment in watch investment
        </li>
      </ul>
    </motion.div>
  )
}
