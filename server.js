import express from "express";
import { readFileSync } from "fs";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Altın fiyatı cache için
let goldCache = { pricePerGram: null, ts: 0 };

// Altın fiyatı çekme fonksiyonu
async function fetchGoldPrice() {
  const now = Date.now();
  if (goldCache.pricePerGram && now - goldCache.ts < 5 * 60 * 1000) {
    return goldCache.pricePerGram; // 5 dk cache
  }

  try {
    const resp = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: { 'x-access-token': process.env.GOLDAPI_KEY }
    });

    /*
    const pricePerOunce = resp.data.price; 
    // 1 troy ounce = 31.1034768 gram
    const pricePerGram = pricePerOunce / 31.1034768;
    goldCache = { pricePerGram, ts: now };
    */

    const pricePerGram = resp.data.price_gram_24k;
    goldCache = { pricePerGram, ts: now };
    console.log("Altın fiyatı (USD/gram):", pricePerGram);

    return pricePerGram;
  } catch (err) {
    console.error("Altın fiyatı alınamadı:", err.message);
    return 120; 
  }
}

function calculatePrice(popularityScore, weight, goldPrice) {
  const result = (popularityScore + 1) * weight * goldPrice;
  return Number(result.toFixed(2));
}

app.use(cors({
  origin: "*"   // Geliştirme için açık
}));

// Root endpoint
app.get("/", (req, res) => res.send("Hello minimal backend!"));

// /api/products endpoint
app.get("/api/products", async (req, res) => {
  try {
    const products = JSON.parse(readFileSync("products.json", "utf-8"));
    const goldPrice = await fetchGoldPrice();

    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;

    let productsWithPrice = products.map(p => ({
      ...p,
      priceUSD: calculatePrice(p.popularityScore, p.weight, goldPrice)
    }));

    if (minPrice) {
      productsWithPrice = productsWithPrice.filter(p => p.priceUSD >= Number(minPrice));
    }
    if (maxPrice) {
      productsWithPrice = productsWithPrice.filter(p => p.priceUSD <= Number(maxPrice));
    }
    if (minPopularity) {
      productsWithPrice = productsWithPrice.filter(p => p.popularityScore * 5 >= Number(minPopularity));
    }
    if (maxPopularity) {
      productsWithPrice = productsWithPrice.filter(p => p.popularityScore * 5 <= Number(maxPopularity));
    }

    console.log("/api/products çağrıldı, products:", productsWithPrice);
    res.json({ goldPricePerGram: goldPrice, products: productsWithPrice });
  } catch (err) {
    console.error("products.json okunamadı:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
