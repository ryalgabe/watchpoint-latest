'use server'

import { db } from '@/db'
import { eq, asc, InferSelectModel } from 'drizzle-orm'
import { load } from 'cheerio'
import { cache } from 'react'
import { watches, watchPriceHistory } from '@/db/schema'

export type Watch = InferSelectModel<typeof watches> & {
  priceHistory: PriceHistoryEntry[]
}

export type PriceHistoryEntry = InferSelectModel<typeof watchPriceHistory>

// Main data loader with error resilience
export async function getAllWatches(): Promise<
  Array<{
    id: string
    brand: string
    model: string
    reference: string
    nickname?: string
    price: number
    change: number
    volume: number
    image: string
    lastUpdated: string
  }>
> {
  try {
    const watches = (await db.query.watches.findMany({
      with: {
        priceHistory: {
          columns: {
            price: true,
            date: true,
          },
          orderBy: asc(watchPriceHistory.date),
          limit: 7,
        },
      },
    })) as Watch[]

    return await Promise.all(
      watches.map(async (watch) => {
        const hist = watch.priceHistory
        const change =
          hist.length >= 2
            ? Math.round(
                ((hist[hist.length - 1].price - hist[0].price) /
                  hist[0].price) *
                  10000
              ) / 100
            : 0

        const image =
          // (await fetchWatchChartsImage(watch.uuid)) ||
          // (await fetchWikiThumbnail(watch.brand, watch.model)) ||
          '/watch1.png'

        return {
          id: watch.uuid,
          brand: watch.brand,
          model: watch.model,
          reference: watch.reference,
          nickname: watch.nickname || undefined,
          price: watch.market_price,
          change,
          volume: Number(watch.volatility),
          image,
          history: watch.priceHistory.map((h) => ({
            date: h.date.toISOString(),
            price: h.price,
          })),
          lastUpdated: watch.updated.toISOString(),
        }
      })
    )
  } catch (error) {
    console.error('Database fetch failed:', error)
    return []
  }
}

// Helper functions
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const isValidImageUrl = (url: string): boolean => {
  return (
    /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url) &&
    !url.includes('placeholder') &&
    !url.includes('logo')
  )
}

const normalizeUrl = (url: string): string => {
  if (url.startsWith('//')) return `https:${url}`
  if (url.startsWith('/')) return `https://watchcharts.com${url}`
  return url
}

// Cached image fetcher with improved scraping
const fetchWatchChartsImage = cache(
  async (uuid: string): Promise<string | null> => {
    try {
      await delay(1000 + Math.random() * 2000) // 1-3s randomized delay

      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://watchcharts.com/',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }

      const response = await fetch(`https://watchcharts.com/watch/${uuid}`, {
        headers,
        next: { revalidate: 604800 }, // 1 week cache
      })

      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      const $ = load(html)

      // Priority-based image source selection
      const imageSources = [
        $('meta[property="og:image"]').attr('content'),
        $('meta[name="twitter:image"]').attr('content'),
        $('.watch-image-container img').attr('src'),
        $('.gallery-image').first().attr('src'),
        $('img[alt*="watch"]').first().attr('src'),
        $('img[alt*="timepiece"]').first().attr('src'),
      ]

      for (const url of imageSources) {
        if (url && isValidImageUrl(url)) {
          return normalizeUrl(url)
        }
      }

      return null
    } catch (error) {
      console.error(`WatchCharts scrape failed for ${uuid}:`, error)
      return null
    }
  }
)

// Improved Wikipedia fallback with better error handling
interface WikiSummary {
  thumbnail?: { source?: string }
  content_urls?: { desktop?: { page?: string } }
}

const fetchWikiThumbnail = cache(
  async (brand: string, model: string): Promise<string | null> => {
    try {
      const title = `${brand}_${model}`
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')

      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        {
          headers: { Accept: 'application/json' },
          next: { revalidate: 604800 },
        }
      )

      if (!response.ok) return null

      const data: WikiSummary = await response.json()

      // Validate image source
      if (data.thumbnail?.source && isValidImageUrl(data.thumbnail.source)) {
        return data.thumbnail.source
      }

      // Try page content fallback
      if (data.content_urls?.desktop?.page) {
        const pageResponse = await fetch(data.content_urls.desktop.page)
        const pageHtml = await pageResponse.text()
        const $ = load(pageHtml)

        const contentImage = $('.infobox img').first().attr('src')
        if (contentImage) {
          return `https:${contentImage}`
        }
      }

      return null
    } catch (error) {
      console.error('Wikipedia fetch failed:', error)
      return null
    }
  }
)
