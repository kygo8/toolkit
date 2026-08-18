# ToolX - 开发者在线工具站 | Developer Tools

> Website: https://toolx.app

[中文](README-zh.md) | [English](README-en.md)

ToolX 是一个基于 Nuxt 4 + Vue 3 的 SSR 在线工具站，面向 Cloudflare Pages 部署优化，提供开发者工具、图片转换、网络检测、二维码和 SEO 工具。

## 功能列表 | Features

### 图片工具 | Image Tools (`/image`)
| 工具 | 说明 | Description |
|------|------|-------------|
| 🖼️ 图片格式转换 | PNG、JPG、WebP 本地转换 | Convert PNG/JPG/WebP locally |
| 📉 图片压缩 | 调整质量和尺寸，压缩图片体积 | Compress images by quality and size |
| 🔤 图片转 Base64 | 生成 Base64 和 Data URL | Generate Base64 and Data URL |
| 印 图片水印 | 本地添加文字、Logo、印章和平铺水印 | Add text, logo, stamp and tiled watermarks locally |

### 网络工具 | Network Tools (`/network`)
| 工具 | 说明 | Description |
|------|------|-------------|
| 📡 网络检测 | 检测联网状态、网络信息、本站连通性和延迟 | Check online status, connection info, reachability and latency |
| 🌍 域名检测 | 解析域名并查询常见 DNS 记录 | Parse domains and query DNS records |
| 🚀 cURL 测试 | 解析 cURL，发送请求并查看响应 | Parse cURL, send request and inspect response |
| 🔄 cURL 转代码 | cURL 命令转为 Python/JavaScript/Go/PHP/Java 代码 | Convert cURL to Python/JavaScript/Go/PHP/Java code |
| 🛠️ cURL 构建器 | 可视化表单构建 cURL 命令 | Visual form to build cURL command |

### 编码/解码工具 | Codec Tools (`/codec`)
| 工具 | 说明 | Description |
|------|------|-------------|
| ↔ Base64 | Base64 编码与解码 | Base64 encode/decode |
| 🔗 URL | URL 编码与解码 | URL encode/decode |
| <> HTML | HTML 实体编码与解码 | HTML entity encode/decode |
| 🌐 Unicode | Unicode 编码转换 | Unicode encode/decode |
| 🔢 HEX | 十六进制编码与解码 | Hex encode/decode |
| 🔑 JWT | JWT Token 编解码（含 HS256 签名） | JWT encode/decode with HS256 signing |
| # Hash | MD5 / SHA-1 / SHA-256 / SHA-512 | MD5 / SHA-1 / SHA-256 / SHA-512 |
| 🔏 HMAC | HMAC-SHA1/256/512，输出 HEX 和 Base64 | HMAC-SHA1/256/512 with hex and Base64 |

### 开发者工具 | Developer Tools (`/dev`)
| 工具 | 说明 | Description |
|------|------|-------------|
| 🕒 时间戳 | Unix 时间戳与日期时间互转 | Unix timestamp and datetime conversion |
| 🎨 颜色转换 | HEX / RGB / HSL 实时转换 | HEX / RGB / HSL conversion |
| 🔍 正则测试 | 匹配高亮、分组捕获、替换预览 | Regex highlight, capture and replace preview |
| 🔢 进制转换 | 二/八/十/十六进制互转 | Binary/Octal/Decimal/Hex conversion |
| 🆔 UUID | 批量生成 UUID v4 / v7 | Batch generate UUID v4 / v7 |
| 📋 文本对比 | 逐行差异高亮显示 | Line-by-line diff highlight |
| 🧾 JSON ↔ YAML | JSON 与 YAML 互转、格式化和校验 | Convert, format and validate JSON/YAML |
| 🧩 JSON ↔ XML | JSON 与 XML 互转、格式化和校验 | Convert, format and validate JSON/XML |
| 📑 JSON ↔ CSV | 对象数组与 CSV 互转 | Convert JSON object arrays and CSV |
| 📘 TOML ↔ JSON | TOML 与 JSON 互转和格式化 | Convert and format TOML/JSON |
| 🗄️ SQL 格式化 | SQL 美化与压缩 | Beautify or minify SQL |
| 💻 代码格式化 | 格式化或压缩 JavaScript / CSS | Format or minify JavaScript/CSS |
| Aa 大小写转换 | camelCase / snake_case / kebab-case 等互转 | Convert camelCase, snake_case, kebab-case and more |
| ⏱ Cron 解析 | 解析 Cron 并给出下次运行时间 | Parse cron and show next run times |
| 🌍 时区转换 | 跨时区转换，显示 ISO 与 Unix | Convert across timezones with ISO and Unix |
| 📝 Markdown 预览 | 实时预览并复制消毒后的 HTML | Live preview and copy sanitized HTML |
| 🎲 假数据生成 | 姓名、邮箱、电话、地址、UUID、Lorem | Names, emails, phones, addresses, UUIDs, lorem |
| 🔐 权限计算 | 复选框 / 八进制 / rwxr-xr-x 互转 | Checkboxes ↔ octal ↔ symbolic permissions |

### 二维码工具 | QR Code Tools (`/qrcode`)
| 工具 | 说明 | Description |
|------|------|-------------|
| 📱 生成 | 输入文本/URL 生成二维码 | Generate QR from text/URL |
| 🔍 解码 | 上传图片识别二维码 | Upload image to decode QR |
| 🎨 美化 | 自定义颜色、圆角和 Logo | Customize color, shape and logo |

### SEO 工具 | SEO Tools (`/seo`)
| 工具 | 说明 | Description |
|------|------|-------------|
| 🏷️ Meta 标签 | 生成 title/description/keywords | Generate title/description/keywords |
| 📊 关键词密度 | 分析关键词频率和密度 | Analyze keyword frequency and density |
| 🗺️ Sitemap | 生成 XML 站点地图 | Generate XML sitemap |
| 🤖 Robots.txt | 生成 robots.txt | Generate robots.txt |
| 🔗 死链检测 | 检测网页中的无效链接 | Detect invalid links |
| # H 标签 | 检查 H1-H6 标题结构 | Check H1-H6 structure |
| 🔢 字符计数 | 统计标题/描述字符长度 | Count title/description length |
| 🕷️ 全站爬取 | 爬取站内链接并发现问题 | Crawl internal links |
| 🌐 批量 URL | 批量提取域名和打开 URL | Batch extract domains and open URLs |
| 🔍 404 检查 | 批量检查 URL 状态码 | Batch check URL status |

### 其他工具 | Other Tools (`/other`)
| 工具 | 说明 | Description |
|------|------|-------------|
| 🔑 随机密码生成 | 生成安全随机密码并检测强度 | Generate secure random passwords |
| {} JSON 格式化 | 格式化、压缩和校验 JSON | Format, minify and validate JSON |

### 首页工具 | Home Tools
首页重点展示图片格式转换、图片压缩、cURL 测试、域名检测、JSON 格式化和随机密码生成等高频入口。

## 技术栈 | Tech Stack

- **Frontend**: Nuxt 4 + Vue 3 Composition API
- **Deployment**: Cloudflare Pages SSR, Nitro `cloudflare_pages`
- **SEO**: SSR pages, route-level meta/canonical, `/sitemap.xml`, `/robots.txt`

## 项目结构 | Project Structure

```text
pages/
├── image/            # 图片工具页面 Image tool pages
├── other/            # 其他工具页面 Other tool pages
├── network/          # 网络工具页面 Network tool pages
├── codec/            # 编码解码页面 Codec pages
├── dev/              # 开发者工具页面 Dev tool pages
├── qrcode/           # 二维码页面 QR code pages
├── seo/              # SEO 工具页面 SEO tool pages
├── index.vue
├── password.vue
└── json.vue
src/
├── views/
│   ├── image/        # 图片工具组件 Image tool components
│   ├── OtherTools.vue # 其他工具合集 Other tools category
│   ├── network/      # 网络检测和域名检测组件 Network components
│   ├── curl/         # cURL 工具组件 cURL components
│   ├── codec/        # 编码解码组件 Codec components
│   ├── dev/          # 开发者工具组件 Dev components
│   ├── qrcode/       # 二维码组件 QR code components
│   └── seo/          # SEO 工具组件 SEO components
└── seo/              # 路由 SEO 元数据 Route SEO metadata
server/
├── api/proxy.post.js
└── routes/
```

## License

MIT
