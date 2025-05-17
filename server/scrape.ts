import fetch from "node-fetch";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { scrappedWatches } from "@/db/schema";

dotenv.config();

// Initialize Postgres pool & Drizzle ORM
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const db = drizzle(pool, { schema: { scrappedWatches } });

// Define the shape of scraped data
interface Scraped {
  url: string;
  name: string;
  model: string;
  price: number;
  availability: string;
  description: string;
  stockInfo: string;
  sellerInfo: Record<string, any>;
  photos: string[];
  marketValue: number;
}

/**
 * Scrapes a WatchCharts listing page for all relevant fields
 */
async function scrapeWatchListing(url: string): Promise<Scraped> {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  // TODO: confirm these selectors against the live page
  const name = $(".listing-title").text().trim();
  const model = $(".watch-model").text().trim();
  const priceText = $(".price").text().trim();
  const marketText = $(".market-value").text().trim();

  return {
    url,
    name,
    model,
    price: parseFloat(priceText.replace(/[^0-9.]/g, "")),
    availability: $(".availability").text().trim(),
    description: $(".description").text().trim(),
    stockInfo: $(".stock-info").text().trim(),
    sellerInfo: {
      username: $(".seller .name").text().trim(),
      rating: parseInt($(".seller .rating").text().trim(), 10) || 0,
      feedback: $(".seller .feedback-count").text().trim(),
    },
    photos: $(".photo-gallery img")
      .map((_, img) => $(img).attr("src") || "")
      .get(),
    marketValue: parseFloat(marketText.replace(/[^0-9.]/g, "")),
  };
}

/**
 * Inserts or updates a scraped watch into the database using UPSERT
 */
async function upsertWatch(data: Scraped) {
  await db
    .insert(scrappedWatches)
    .values({
      url: data.url,
      name: data.name,
      model: data.model,
      price: data.price,
      availability: data.availability,
      description: data.description,
      stockInfo: data.stockInfo,
      sellerInfo: data.sellerInfo,
      photos: data.photos,
      marketValue: data.marketValue,
    })
    .onConflictDoUpdate({
      target: scrappedWatches.url,
      set: {
        name: data.name,
        model: data.model,
        price: data.price,
        availability: data.availability,
        description: data.description,
        stockInfo: data.stockInfo,
        sellerInfo: data.sellerInfo,
        photos: data.photos,
        marketValue: data.marketValue,
        scrapedAt: new Date(),
      },
    });
}

/**
 * Example entry point: scrape a single URL or a list
 */
async function main() {
  const targets = [
    // Add your WatchCharts listing URLs here
    "https://watchcharts.com/listing/12953259-2-800-cad-2023-longines-spirit-37mm-silver-dial-chronometer-certified",
  ];

  for (const url of targets) {
    try {
      console.log(`Scraping ${url}...`);
      const data = await scrapeWatchListing(url);
      await upsertWatch(data);
      console.log(`✅ Stored ${data.name}`);
    } catch (err) {
      console.error(`❌ Failed ${url}:`, err);
    }
  }

  // Close DB pool when done
  await pool.end();
}

// Run if invoked directly
if (require.main === module) {
  main().catch((e) => console.error(e));
}
