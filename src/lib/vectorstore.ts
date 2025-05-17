import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from '@langchain/openai'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  // environment: process.env.PINECONE_ENVIRONMENT!
})

export async function initVectorStore() {
  return pinecone
}

export async function searchSimilarDocs(query: string) {
  const pinecone = await initVectorStore()
  const index = pinecone.Index(process.env.PINECONE_INDEX!)

  const embeddings = new OpenAIEmbeddings()
  const queryEmbedding = await embeddings.embedQuery(query)

  const results = await index.query({
    vector: queryEmbedding,
    topK: 3,
    includeMetadata: true,
  })

  return results.matches
}
