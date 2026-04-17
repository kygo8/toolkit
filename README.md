# ToolX - 开发者工具站 | Developer Tools

> 官网 Website: https://toolx.app

[**中文版**](README-zh.md) | [**English**](README-en.md)

一个基于 Vue 3 + Vite 的在线工具站。
A Vue 3 + Vite based online developer tools website.

## 功能列表 | Features

### 编码/解码工具 | Codec Tools (`/codec`)
| 工具 | 说明 | Description |
|------|------|-------------|
| ↔ Base64 | Base64 编码与解码 | Base64 encode/decode |
| 🔗 URL | URL 编码与解码 | URL encode/decode |
| <> HTML | HTML 实体编码与解码 | HTML entity encode/decode |
| 🌐 Unicode | Unicode 编码 (`\uXXXX` 格式) | Unicode encode (`\uXXXX` format) |
| 🔢 HEX | 十六进制编码与解码 | Hex encode/decode |
| 🔑 JWT | JWT Token 解码 (Header/Payload) | JWT Token decode (Header/Payload) |
| # Hash | MD5 / SHA-1 / SHA-256 / SHA-512 | MD5 / SHA-1 / SHA-256 / SHA-512 |

### 开发者工具 | Developer Tools (`/dev`)
| 工具 | 说明 | Description |
|------|------|-------------|
| 🕐 时间戳 | Unix 时间戳 ↔ 日期时间，秒/毫秒互转 | Unix timestamp ↔ datetime, sec/ms conversion |
| 🎨 颜色转换 | HEX / RGB / HSL 实时联动，颜色选择器 | HEX / RGB / HSL real-time sync, color picker |
| 🔍 正则测试 | 正则表达式匹配高亮、分组捕获、替换预览 | Regex match highlight, group capture, replace preview |
| 🔢 进制转换 | 二/八/十/十六进制互转 | Binary/Octal/Decimal/Hex conversion |
| 🆔 UUID | 批量生成 UUID v4，支持大写 | Batch generate UUID v4, uppercase support |
| 📄 文本对比 | 逐行差异高亮显示 | Line-by-line diff highlight |

### 二维码工具 | QR Code Tools (`/qrcode`)
| 工具 | 说明 | Description |
|------|------|-------------|
| 📱 生成 | 输入文本/URL 生成二维码，支持尺寸/容错/颜色 | Generate QR from text/URL, size/error correction/color |
| 🔍 解码 | 上传/拖拽/粘贴图片识别二维码 | Upload/drag/paste image to decode QR |
| 🎨 美化 | 渐变色/圆角/圆点样式/定位点配色/嵌入Logo | Gradient color/rounded/dot style/logo embed |

### cURL 工具 | cURL Tools (`/curl`)
| 工具 | 说明 | Description |
|------|------|-------------|
| 🔄 转代码 | cURL 命令转为 Python/JavaScript/Go/PHP/Java 代码 | Convert cURL to Python/JavaScript/Go/PHP/Java code |
| 🛠️ 构建器 | 可视化表单构建 cURL 命令 | Visual form to build cURL command |
| 🔍 解析器 | 解析 cURL 命令，提取 Headers(k:v)，直接发送请求获取响应 | Parse cURL, extract Headers(k:v), send request and get response |

### SEO 工具 | SEO Tools (`/seo`)
| 工具 | 说明 | Description |
|------|------|-------------|
| 🌐 批量域名 | 批量提取主域名和打开URL | Batch extract domain and open URLs |
| 🕷️ 全站爬取 | 递归爬取站内链接，CORS代理，发现死链和404 | Recursive crawl internal links, CORS proxy, find dead links and 404 |
| 📝 Meta标签 | 生成 title/description/keywords 等 | Generate title/description/keywords etc |
| 📊 关键词密度 | 分析关键词出现频率和密度 | Analyze keyword frequency and density |
| 🗺️ Sitemap | 生成 XML 网站地图 | Generate XML sitemap |
| 🔍 404检查 | 批量检查URL是否返回404 | Batch check if URLs return 404 |
| 🔗 死链检测 | 检测网页中的无效链接 | Detect invalid links in webpage |
| 🤖 Robots.txt | 生成符合标准的 robots.txt | Generate standards-compliant robots.txt |
| # H标签 | 检查网页H1-H6标签结构 | Check webpage H1-H6 tag structure |
| 🔢 字符计数 | 统计标题/描述字符长度 | Count title/description character length |

### 首页工具 | Home Tools
| 工具 | 说明 | Description |
|------|------|-------------|
| 🔑 密码生成 | 随机密码，支持长度/字符类型，密码强度检测 | Random password, length/char type support, strength detection |
| {} JSON | JSON 格式化/压缩，语法高亮 | JSON format/minify, syntax highlight |

## 技术栈 | Tech Stack

- **前端 | Frontend**: Vue 3 (Composition API) + Vue Router + Vite

## 项目结构 | Project Structure

```
src/
├── views/
│   ├── codec/        # 7个编码解码工具 7 codec tools
│   ├── dev/          # 6个开发者工具 6 dev tools
│   ├── seo/          # 10个SEO工具 10 SEO tools
│   ├── qrcode/       # 3个二维码工具 3 QR code tools
│   ├── curl/         # 3个cURL工具 3 cURL tools
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
├── api/proxy.js      # API代理 API proxy
└── _routes.json     # 路由配置 Route config
```

## License

MIT