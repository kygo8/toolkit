# ToolX - Developer Tools

> Website: https://toolx.app

A Nuxt 4 + Vue 3 SSR developer tools website optimized for Cloudflare Pages.

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

### Network Tools (`/network`)
| Tool | Description |
|------|-------------|
| 📡 Network Check | Check browser online status, connection information, site reachability and latency |
| 🌍 Domain Check | Parse domains and query A/AAAA/CNAME/MX/NS/TXT DNS records |
| 🚀 cURL Test | Parse cURL commands, send requests and inspect status, headers and body |
| 🔄 To Code | Convert cURL to Python/JavaScript/Go/PHP/Java code |
| 🛠️ Builder | Visual form to build cURL command |

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

- **Frontend**: Nuxt 4 + Vue 3 (Composition API)
- **Deployment**: Cloudflare Pages SSR (Nitro `cloudflare_pages`)
- **SEO**: SSR pages, route-level meta/canonical, `/sitemap.xml`, `/robots.txt`

## Project Structure

```
pages/
├── codec/        # Codec pages
├── dev/          # Developer tool pages
├── seo/          # SEO tool pages
├── qrcode/       # QR code pages
├── network/      # Network tool pages
├── index.vue
├── password.vue
└── json.vue
src/
├── views/
│   ├── codec/        # 7 codec tool components
│   ├── dev/          # 6 dev tool components
│   ├── seo/          # 10 SEO tool components
│   ├── qrcode/       # 3 QR code components
│   ├── network/      # Network check and domain check components
│   └── curl/         # 3 cURL components
├── seo/              # Route SEO metadata
server/
├── api/proxy.post.js # API proxy
└── routes/           # sitemap.xml / robots.txt
app.vue
nuxt.config.js
```

## License

MIT
