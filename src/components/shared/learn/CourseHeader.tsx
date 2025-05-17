import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface CourseHeaderProps {
  progress: number
}

export function CourseHeader({ progress }: CourseHeaderProps) {
  return (
    <div className="sticky top-0 backdrop-blur-lg border-b border-purple-border">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <Button
            variant="ghost"
            className="hover:bg-[#15151E]/80 transition-colors duration-200 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-3" />
            Back to Courses
          </Button>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <span className="text-[#878787] font-medium text-sm sm:text-base">
              Course Progress
            </span>
            <Progress
              value={progress}
              className="w-24 sm:w-40 h-2 bg-[#15151E]"
            />
            <span className="text-[#2E62E8] font-semibold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
