import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { format } from 'date-fns'
import { urlFor } from '@/lib/sanity'

interface BlogPostProps {
  post: {
    title: string
    mainImage: any
    body: any[]
    publishedAt: string
    author: {
      name: string
      image: any
    }
    categories: {
      title: string
    }[]
  }
}

export function BlogPost({ post }: BlogPostProps) {
  const formattedDate = format(new Date(post.publishedAt), 'MMMM d, yyyy')

  return (
    <article className="min-h-screen bg-[#060614] text-white">
      {/* Header */}
      <div className="border-b border-[#2A2A37]">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/blogs">
              <Button variant="ghost" className="hover:bg-[#15151E]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
            <Button variant="ghost" className="hover:bg-[#15151E]">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 md:px-6">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {post.categories?.map((category) => (
                <Badge
                  key={category.title}
                  variant="outline"
                  className="bg-[#15151E] border-[#2A2A37] capitalize"
                >
                  {category.title}
                </Badge>
              ))}
              <div className="flex items-center gap-4 text-sm text-[#878787]">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formattedDate}
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

            <div className="flex items-center gap-3">
              {post.author?.image && (
                <Avatar className="h-10 w-10 border-2 border-[#2A2A37]">
                  <AvatarImage src={urlFor(post.author.image).url()} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div>
                <p className="font-medium">{post.author?.name}</p>
              </div>
            </div>
          </div>

          {post.mainImage && (
            <div className="relative h-[400px] rounded-xl overflow-hidden bg-[#15151E]">
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.title}
                className="w-full h-full object-cover"
                width={1200}
                height={600}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060614] to-transparent opacity-60" />
            </div>
          )}

          <div className="prose prose-invert max-w-none prose-lg">
            <PortableText value={post.body} />
          </div>
        </div>
      </div>
    </article>
  )
}
