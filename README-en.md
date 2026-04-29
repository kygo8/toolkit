# ToolX - Developer Tools

> Website: https://toolx.app

ToolX is a Nuxt 4 + Vue 3 SSR online toolkit optimized for Cloudflare Pages. It includes developer tools, image conversion, network diagnostics, QR code tools, and SEO utilities.

## Features

### Image Tools (`/image`)
| Tool | Description |
|------|-------------|
| 🖼️ Image Convert | Convert PNG, JPG, and WebP locally |
| 📉 Image Compress | Compress images by quality and size |
| 🔤 Image to Base64 | Generate Base64 and Data URL output |

### Network Tools (`/network`)
| Tool | Description |
|------|-------------|
| 📡 Network Check | Check online status, connection info, reachability, and latency |
| 🌍 Domain Check | Parse domains and query DNS records |
| 🚀 cURL Test | Parse cURL, send requests, and inspect responses |
| 🔄 cURL to Code | Convert cURL to Python/JavaScript/Go/PHP/Java code |
| 🛠️ cURL Builder | Visual form to build cURL commands |

### Codec Tools (`/codec`)
| Tool | Description |
|------|-------------|
| ↔ Base64 | Base64 encode/decode |
| 🔗 URL | URL encode/decode |
| <> HTML | HTML entity encode/decode |
| 🌐 Unicode | Unicode encode/decode |
| 🔢 HEX | Hex encode/decode |
| 🔑 JWT | JWT Token decode |
| # Hash | MD5 / SHA-1 / SHA-256 / SHA-512 |

### Developer Tools (`/dev`)
| Tool | Description |
|------|-------------|
| 🕒 Timestamp | Unix timestamp and datetime conversion |
| 🎨 Color | HEX / RGB / HSL conversion |
| 🔍 Regex | Regex highlight, capture, and replace preview |
| 🔢 Base | Binary/Octal/Decimal/Hex conversion |
| 🆔 UUID | Batch generate UUID v4 |
| 📋 Diff | Line-by-line diff highlight |

### QR Code Tools (`/qrcode`)
| Tool | Description |
|------|-------------|
| 📱 Generate | Generate QR from text/URL |
| 🔍 Decode | Upload image to decode QR |
| 🎨 Beautify | Customize color, shape, and logo |

### SEO Tools (`/seo`)
| Tool | Description |
|------|-------------|
| 🏷️ Meta | Generate title/description/keywords |
| 📊 Density | Analyze keyword frequency and density |
| 🗺️ Sitemap | Generate XML sitemap |
| 🤖 Robots.txt | Generate robots.txt |
| 🔗 Dead Link | Detect invalid links |
| # H-Tag | Check H1-H6 heading structure |
| 🔢 Counter | Count title/description length |
| 🕷️ Crawler | Crawl internal links |
| 🌐 Batch URL | Batch extract domains and open URLs |
| 🔍 404 Check | Batch check URL status |

### Other Tools (`/other`)
| Tool | Description |
|------|-------------|
| 🔑 Random Password | Generate secure random passwords |
| {} JSON Formatter | Format, minify, and validate JSON |

### Home Tools
The homepage highlights common entry points such as image conversion, image compression, cURL testing, domain checks, JSON formatting, and random password generation.

## Tech Stack

- **Frontend**: Nuxt 4 + Vue 3 Composition API
- **Deployment**: Cloudflare Pages SSR, Nitro `cloudflare_pages`
- **SEO**: SSR pages, route-level meta/canonical, `/sitemap.xml`, `/robots.txt`

## Project Structure

```text
pages/
├── image/        # Image tool pages
├── other/        # Other tool pages
├── network/      # Network tool pages
├── codec/        # Codec pages
├── dev/          # Developer tool pages
├── qrcode/       # QR code pages
├── seo/          # SEO tool pages
├── index.vue
├── password.vue
└── json.vue
src/
├── views/
│   ├── image/    # Image tool components
│   ├── OtherTools.vue # Other tools category
│   ├── network/  # Network check and domain check components
│   ├── curl/     # cURL components
│   ├── codec/    # Codec components
│   ├── dev/      # Developer tool components
│   ├── qrcode/   # QR code components
│   └── seo/      # SEO components
└── seo/          # Route SEO metadata
server/
├── api/proxy.post.js
└── routes/
```

## License

MIT
