'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Play, Clock, BarChart, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const courses = [
  {
    id: 1,
    title: 'Watch Investment Fundamentals',
    description:
      'Learn the basics of investing in luxury watches and dynamics.',
    thumbnail: '/placeholder.avif?height=400&width=600',
    duration: '45 mins',
    lessons: 5,
    progress: 100,
    category: 'beginner',
  },
  {
    id: 2,
    title: 'Advanced Market Analysis',
    description:
      'Deep dive into market trends, price movements, and strategies.',
    thumbnail: '/placeholder.avif?height=400&width=600',
    duration: '1h 15mins',
    lessons: 8,
    progress: 60,
    category: 'advanced',
  },
  {
    id: 3,
    title: 'Brand Value & Authentication',
    description:
      'Understanding brand equity and authenticating luxury timepieces.',
    thumbnail: '/placeholder.avif?height=400&width=600',
    duration: '55 mins',
    lessons: 6,
    progress: 0,
    category: 'intermediate',
  },
]

const STATS = [
  {
    icon: <Clock className="w-5 h-5 text-[#2E62E8]" />,
    text: '3 hours of content',
  },
  {
    icon: <BarChart className="w-5 h-5 text-[#2E62E8]" />,
    text: '12 courses',
  },
]

const CATEGORIES = [
  { value: 'all', label: 'All Courses' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const commonClasses = {
  statBox:
    'flex items-center gap-3 text-[#878787] bg-primary/10 px-4 py-2 rounded-md backdrop-blur-sm border-[#2A2A37]/30 hover:border-[#2E62E8]/30 transition-all duration-300',
  tabTrigger:
    'px-4 sm:px-8 py-3 text-sm sm:text-base rounded-md data-[state=active]:bg-accent data-[state=active]:text-white transition-all duration-300 font-medium',
}

export function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const renderCourseCard = (course: any) => (
    <Link key={course.id} href={`/dashboard/learn/${course.id}`}>
      <Card className="group bg-[#0B0B1A]/80 border-[#2A2A37]/50 hover:border-[#2E62E8]/50 transition-all duration-500 overflow-hidden rounded-xl">
        <div className="relative">
          <div className="aspect-video overflow-hidden rounded-2xl p-4">
            <Image
              src={course.thumbnail || '/placeholder.avif'}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110 rounded-xl"
              width={1200}
              height={600}
            />
          </div>
          <div className="absolute inset-0 bginline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground bg-[#15151E] border-[#2A2A37] capitalize-gradient-to-t from-[#0B0B1A] to-transparent opacity-0" />
          <Button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-[#2E62E8] hover:bg-[#2E62E8]/90 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100"
            size="icon"
          >
            <Play className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-primary border-primary capitalize"
            >
              {course.category}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-[#878787] bg-[#2E62E8]/10 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-[#2E62E8]" />
              {course.duration}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold group-hover:text-[#2E62E8] transition-colors">
              {course.title}
            </h3>
            <p className="text-[#878787] text-base line-clamp-2">
              {course.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#878787] font-medium">
                {course.progress}% Complete
              </span>
              <span className="text-[#878787] font-medium">
                {course.lessons} Lessons
              </span>
            </div>
            <Progress
              value={course.progress}
              className="h-2 bg-[#2E62E8]/10 rounded-full"
            />
          </div>

          {course.progress === 100 ? (
            <div className="flex items-center gap-3 text-[#2E62E8] bg-[#2E62E8]/10 px-4 py-3 rounded-full">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Completed</span>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full bg-[#0B0B1A] border-[#2A2A37]/50 hover:bg-[#2E62E8] hover:text-white transition-all duration-300 rounded-full py-6"
            >
              {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060614] to-[#0B0B1A] text-white">
      <div className="rounded-md border border-[#2A2A37]/50 backdrop-blur-lg sticky top-0 mx-6 my-6">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 mb-2">
                Watch Investment Lessons
              </h1>
              <p className="text-[#878787]">
                Master the art of watch investing through our expert-led courses
              </p>
            </div>
            <div className="flex items-center gap-4">
              {STATS.map((stat, index) => (
                <div key={index} className={commonClasses.statBox}>
                  {stat.icon}
                  <span className="text-lg whitespace-nowrap">{stat.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex items-center justify-center sm:justify-start gap-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((category) => (
            <Button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-4 h-7 rounded-md ease-in-out text-lg transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-[#2E62E8] text-white'
                  : 'bg-[#2E62E8]/10 text-[#878787] hover:bg-[#2E62E8]/30'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {selectedCategory === 'all'
            ? courses.map(renderCourseCard)
            : courses
                .filter((course) => course.category === selectedCategory)
                .map(renderCourseCard)}
        </div>
      </div>
    </div>
  )
}
