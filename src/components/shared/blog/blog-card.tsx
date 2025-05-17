import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Clock } from 'lucide-react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { format } from 'date-fns'

interface BlogCardProps {
  post: {
    title: string
    excerpt: string
    description: string
    categories: { title: string }[] | null
    publishedAt: string
    readTime: string
    mainImage: any
    slug: {
      current: string
    }
  }
}

export function BlogCard({ post }: BlogCardProps) {
  const category =
    post.categories && post.categories.length > 0
      ? post.categories[0].title
      : 'Uncategorized'

  const formattedDate = format(new Date(post.publishedAt), 'MMMM d, yyyy')

  return (
    <Link href={`/dashboard/blogs/${post.slug.current}`}>
      <Card className="group bg-[#0B0B1A] border-[#2A2A37] hover:border-[#2E62E8] transition-all duration-300">
        <div className="grid md:grid-cols-[2fr,3fr] gap-6 p-6">
          <div className="relative h-48 md:h-full rounded-xl overflow-hidden bg-[#15151E]">
            {post.mainImage && (
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.title}
                className="w-full h-full object-cover transition-transform aspect-video duration-500 group-hover:scale-105"
                width={1200}
                height={600}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B1A] to-transparent opacity-60" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant="outline"
                className="bg-[#15151E] border-[#2A2A37] capitalize"
              >
                {category}
              </Badge>
              <div className="flex items-center text-sm text-[#878787]">
                <Clock className="w-4 h-4 mr-1" />
                {formattedDate}
              </div>
            </div>

            <h2 className="text-xl font-bold mb-3 group-hover:text-[#2E62E8] transition-colors duration-300">
              {post.title}
            </h2>

            <p className="text-[#878787] mb-4 line-clamp-2">{post.excerpt}</p>

            <p className="text-sm text-[#878787] line-clamp-3 mb-4">
              {post.description}
            </p>

            <div className="mt-auto flex items-center text-[#2E62E8] font-medium">
              Read Article
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
