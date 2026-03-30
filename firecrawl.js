/**
 * Firecrawl API integration for StudEx Online Ecosystem.
 * Scrapes web content using the Firecrawl v2 API.
 *
 * Usage:
 *   1. Copy .env.example to .env and add your API key
 *   2. Run: node firecrawl.js [url]
 *
 * Example:
 *   node firecrawl.js https://firecrawl.dev
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    console.error(
      "Error: .env file not found. Copy .env.example to .env and add your API key."
    );
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    process.env[key] = value;
  }
}

function scrape(url) {
  loadEnv();

  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey || apiKey === "your_firecrawl_api_key_here") {
    console.error(
      "Error: FIRECRAWL_API_KEY not set. Update your .env file with a valid key."
    );
    process.exit(1);
  }

  const postData = JSON.stringify({ url });

  const options = {
    hostname: "api.firecrawl.dev",
    port: 443,
    path: "/v2/scrape",
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = https.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      try {
        const result = JSON.parse(data);
        console.log(JSON.stringify(result, null, 2));
      } catch {
        console.error("Failed to parse response:", data);
      }
    });
  });

  req.on("error", (err) => {
    console.error("Request failed:", err.message);
    process.exit(1);
  });

  req.write(postData);
  req.end();
}

const url = process.argv[2] || "https://firecrawl.dev";
console.log(`Scraping: ${url}`);
scrape(url);
