'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BlogCard } from './blog-card'
import { client, urlFor } from '@/lib/sanity'
import { format } from 'date-fns'

const categories = [
  { id: 'market', label: 'Market' },
  { id: 'others', label: 'Others' },
]

interface BlogPostcard {
  _id: string
  title: string
  excerpt: string
  description: string
  mainImage: any
  slug: {
    current: string
  }
  publishedAt: string
  readTime: string
  author: {
    name: string
    image: any
  }
  categories: {
    title: string
  }[]
  body: any[]
}

export function BlogList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [posts, setPosts] = useState<BlogPostcard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const categoryFilter = selectedCategory
          ? `&& '${selectedCategory}' in categories[].title`
          : ''
        const searchFilter = searchQuery
          ? `&& title match '${searchQuery}*'`
          : ''

        const query = `*[_type == 'post' ${categoryFilter} ${searchFilter}] | order(publishedAt desc) {
          _id,
          title,
          excerpt,
          description,
          mainImage,
          slug,
          publishedAt,
          readTime,
          body,
          author-> {
            name,
            image
          },
          categories[]-> {
            title
          }
        }`

        const fetchedPosts: BlogPostcard[] = await client.fetch(
          query,
          {},
          { cache: 'no-store' }
        )
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [searchQuery, selectedCategory])

  return (
    <div className="min-h-screen bg-[#060614] text-white">
      <div className="border-b border-[#2A2A37] bg-[#0B0B1A]">
        <div className="max-w-[1800px] mx-auto px-4 py-6 md:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#878787]" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-[#15151E] border-[#2A2A37] text-white placeholder:text-[#878787]
                         focus-visible:ring-[#2E62E8] focus-visible:ring-offset-[#060614] h-12 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className={`
                  px-6 py-2 rounded-full transition-all duration-200 ease-in-out
                  ${!selectedCategory ? 'bg-[#2E62E8] text-white border-transparent' : 'bg-[#15151E] border-[#2A2A37] hover:bg-[#2A2A37]'}
                `}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className={`
                    px-6 py-2 rounded-full transition-all duration-200 ease-in-out
                    ${selectedCategory === category.id ? 'bg-[#2E62E8] text-white border-transparent' : 'bg-[#15151E] border-[#2A2A37] hover:bg-[#2A2A37]'}
                  `}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 py-8 md:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E62E8]"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-[#878787]">
              No posts found
            </h3>
            <p className="text-[#878787] mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
