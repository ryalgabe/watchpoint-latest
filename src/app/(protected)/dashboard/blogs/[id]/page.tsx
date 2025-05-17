import { client } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import { BlogPost } from '@/components/shared/blog/blog-post'

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    mainImage,
    body,
    publishedAt,
    author-> {
      name,
      image
    },
    categories[]-> {
      title
    }
  }`

  return await client.fetch(query, { slug })
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) return notFound()

  return <BlogPost post={post} />
}
