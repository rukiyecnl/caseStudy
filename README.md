# caseStudy

## Render üzerinde deploy edilen url
https://casestudy-vgnh.onrender.com

# Product Listing Backend API

## Açıklama
Bu proje, ürün listeleme API’si sağlar ve her ürünün fiyatı dinamik olarak altın fiyatına göre hesaplanır.  
Backend Node.js ve Express kullanılarak geliştirilmiştir.

---

## Kurulum

1. Node.js kurulu olmalı.
2. Proje klasörüne gidin:
   ```bash
   cd case-study
   npm install
3. .env dosyası oluşturun
    PORT=4000
    GOLDAPI_KEY=senin_api_key (goldapi.io sitesinden ücretsiz alabilirsiniz)
    FALLBACK_GOLD_PRICE_PER_GRAM=120

## Çalıştırma

1. node server.js
Backend running at http://localhost:4000 yazısı terminalde görünmeli

## API Endpoints

### GET `/api/products`

Ürün listesini JSON formatında döner.  
Her ürün, dinamik olarak altın fiyatına göre hesaplanmış bir fiyat bilgisine sahiptir.

#### Query Parametreleri (Opsiyonel)
| Parametre | Açıklama | Örnek |
|------------|-----------|--------|
| `minPrice` | Minimum fiyat filtresi | `minPrice=500` |
| `maxPrice` | Maksimum fiyat filtresi | `maxPrice=2000` |
| `minPopularity` | Minimum popülerlik skoru | `minPopularity=2` |
| `maxPopularity` | Maksimum popülerlik skoru | `maxPopularity=5` |

#### Örnek İstek
```bash
GET /api/products?minPrice=400&maxPrice=1000&minPopularity=2&maxPopularity=4

(popularityScore değişkeni 1 den küçük değerler halinde geliyor. bu durumu kod içerisinde değiştirdim.)
#### Örnek yanıt
{
  "goldPricePerGram": 64.87,
  "products": [
    {
      "id": "prod-1",
      "name": "Gold Ring",
      "weight": 20,
      "popularityScore": 0.85,
      "images": {
        "yellow": "https://example.com/yellow-ring.jpg",
        "white": "https://example.com/white-ring.jpg",
        "rose": "https://example.com/rose-ring.jpg"
      },
      "priceUSD": 1245.50
    }
  ]
}

## Test Etme

http://localhost:4000/api/products yolundan test işleminin yapabilirsiniz.


