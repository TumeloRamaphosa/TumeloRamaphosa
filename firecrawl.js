import FirecrawlApp from "@mendable/firecrawl-js";
import { config } from "dotenv";

config();

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const url = process.argv[2] || "https://firecrawl.dev";
console.log(`Scraping: ${url}`);

const result = await app.scrapeUrl(url);

if (result.success) {
  console.log("Scrape successful!\n");
  console.log(result.markdown);
} else {
  console.error("Scrape failed:", result.error);
}
