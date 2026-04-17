# ToolX - Developer Tools

> Website: https://toolx.app

A Vue 3 + Vite based online developer tools website.

## Features

### Codec Tools (`/codec`)
| Tool | Description |
|------|-------------|
| ↔ Base64 | Base64 encode/decode |
| 🔗 URL | URL encode/decode |
| <> HTML | HTML entity encode/decode |
| 🌐 Unicode | Unicode encode (`\uXXXX` format) |
| 🔢 HEX | Hex encode/decode |
| 🔑 JWT | JWT Token decode (Header/Payload) |
| # Hash | MD5 / SHA-1 / SHA-256 / SHA-512 |

### Developer Tools (`/dev`)
| Tool | Description |
|------|-------------|
| 🕐 Timestamp | Unix timestamp ↔ datetime, sec/ms conversion |
| 🎨 Color | HEX / RGB / HSL real-time sync, color picker |
| 🔍 Regex | Regex match highlight, group capture, replace preview |
| 🔢 Base | Binary/Octal/Decimal/Hex conversion |
| 🆔 UUID | Batch generate UUID v4, uppercase support |
| 📄 Diff | Line-by-line diff highlight |

### QR Code Tools (`/qrcode`)
| Tool | Description |
|------|-------------|
| 📱 Generate | Generate QR from text/URL, size/error correction/color |
| 🔍 Decode | Upload/drag/paste image to decode QR |
| 🎨 Beautify | Gradient color/rounded/dot style/logo embed |

### cURL Tools (`/curl`)
| Tool | Description |
|------|-------------|
| 🔄 To Code | Convert cURL to Python/JavaScript/Go/PHP/Java code |
| 🛠️ Builder | Visual form to build cURL command |
| 🔍 Parser | Parse cURL, extract Headers(k:v), send request and get response |

### SEO Tools (`/seo`)
| Tool | Description |
|------|-------------|
| 🌐 Batch URL | Batch extract domain and open URLs |
| 🕷️ Crawler | Recursive crawl internal links, CORS proxy, find dead links and 404 |
| 📝 Meta | Generate title/description/keywords etc |
| 📊 Density | Analyze keyword frequency and density |
| 🗺️ Sitemap | Generate XML sitemap |
| 🔍 404 Check | Batch check if URLs return 404 |
| 🔗 Dead Link | Detect invalid links in webpage |
| 🤖 Robots.txt | Generate standards-compliant robots.txt |
| # H-Tag | Check webpage H1-H6 tag structure |
| 🔢 Counter | Count title/description character length |

### Home Tools
| Tool | Description |
|------|-------------|
| 🔑 Password | Random password, length/char type support, strength detection |
| {} JSON | JSON format/minify, syntax highlight |

## Tech Stack

- **Frontend**: Vue 3 (Composition API) + Vue Router + Vite

## Project Structure

```
src/
├── views/
│   ├── codec/        # 7 codec tools
│   ├── dev/          # 6 dev tools
│   ├── seo/          # 10 SEO tools
│   ├── qrcode/       # 3 QR code tools
│   ├── curl/         # 3 cURL tools
│   ├── CodecTools.vue
│   ├── DevTools.vue
│   ├── SeoTools.vue
│   ├── QrcodeTools.vue
│   ├── CurlTools.vue
│   ├── Home.vue
│   ├── PasswordGenerator.vue
│   └── JsonFormatter.vue
├── router/
├── App.vue
└── main.js
functions/
├── api/proxy.js      # API proxy
└── _routes.json     # Route config
```

## License

MIT