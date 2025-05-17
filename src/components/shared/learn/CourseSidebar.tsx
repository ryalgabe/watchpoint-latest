import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Play, CheckCircle2 } from 'lucide-react'

interface Lesson {
  id: number
  title: string
  duration: string
  completed: boolean
}

interface CourseSidebarProps {
  lessons: Lesson[]
  currentLessonId: number
}

export function CourseSidebar({
  lessons,
  currentLessonId,
}: CourseSidebarProps) {
  return (
    <div className="sticky top-24 h-fit bg-[#0B0B1A]/50 backdrop-blur-sm border border-[#2A2A37]/50 rounded-2xl overflow-hidden">
      <div className="border-b border-[#2A2A37]/50 p-6">
        <h2 className="text-lg font-semibold">Course Content</h2>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="p-4 space-y-3">
          {lessons.map((lesson) => (
            <Button
              key={lesson.id}
              variant="ghost"
              className={`
                w-full justify-start p-4 rounded-xl
                hover:bg-[#15151E]/50 transition-all duration-200
                ${lesson.id === currentLessonId ? 'bg-[#15151E]/50 border-l-2 border-[#2E62E8]' : ''}
              `}
            >
              <div className="flex items-center w-full gap-4">
                {lesson.completed ? (
                  <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-green-500" />
                ) : (
                  <Play className="flex-shrink-0 w-5 h-5 text-[#878787]" />
                )}

                <div className="flex-1 text-left">
                  <p className="mb-1 font-medium">Lesson {lesson.id}</p>
                  <p className="text-sm text-[#878787] truncate">
                    {lesson.title}
                  </p>
                </div>

                <span className="text-sm font-medium text-[#878787]">
                  {lesson.duration}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
