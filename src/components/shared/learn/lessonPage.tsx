'use client'

import { useState } from 'react'
import { CourseSidebar } from './CourseSidebar'
import { CourseHeader } from './CourseHeader'
import { VideoPlayer } from './VideoPlayer'
import { LessonDescription } from './LessonDescription'

const lessons = [
  {
    id: 1,
    title: 'Introduction to watch investment',
    duration: '3:06',
    completed: true,
  },
  {
    id: 2,
    title: 'Understanding market dynamics',
    duration: '5:22',
    completed: true,
  },
  {
    id: 3,
    title: 'Brand value and recognition',
    duration: '4:15',
    completed: false,
  },
  {
    id: 4,
    title: 'Authentication and condition',
    duration: '6:30',
    completed: false,
  },
  {
    id: 5,
    title: 'Investment strategies',
    duration: '7:45',
    completed: false,
  },
]

export function LessonPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(30)
  const [showDescription, setShowDescription] = useState(true)

  return (
    <div className="min-h-screen bg-main-background text-white">
      <CourseHeader progress={40} />

      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
          <div className="space-y-8">
            <VideoPlayer
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              progress={progress}
            />
            <LessonDescription
              showDescription={showDescription}
              setShowDescription={setShowDescription}
            />
          </div>

          <CourseSidebar lessons={lessons} currentLessonId={1} />
        </div>
      </div>
    </div>
  )
}
