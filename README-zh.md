# ToolX - 开发者在线工具站

> 官网: https://toolx.app

ToolX 是一个基于 Nuxt 4 + Vue 3 的 SSR 在线工具站，面向 Cloudflare Pages 部署优化，提供开发者工具、图片转换、网络检测、二维码和 SEO 工具。

## 功能列表

### 图片工具 (`/image`)
| 工具 | 说明 |
|------|------|
| 🖼️ 图片格式转换 | PNG、JPG、WebP 本地转换 |
| 📉 图片压缩 | 调整质量和尺寸，压缩图片体积 |
| 🔤 图片转 Base64 | 生成 Base64 和 Data URL |
| 印 图片水印 | 本地添加文字、Logo、印章和平铺水印 |
| 📐 图片裁剪缩放 | 裁剪、缩放并下载 PNG/JPG/WebP |
| ✴️ SVG 转换 | SVG 转 PNG，或位图包装为 SVG |
| 📷 EXIF 查看 | 查看并清除 EXIF 元数据 |

### 网络工具 (`/network`)
| 工具 | 说明 |
|------|------|
| 📡 网络检测 | 检测联网状态、网络信息、本站连通性和延迟 |
| 🌍 域名检测 | 解析域名并查询常见 DNS 记录 |
| 🚀 cURL 测试 | 解析 cURL，发送请求并查看响应 |
| 🔄 cURL 转代码 | cURL 命令转为 Python/JavaScript/Go/PHP/Java 代码 |
| 🛠️ cURL 构建器 | 可视化表单构建 cURL 命令 |
| 🧮 CIDR 计算 | 计算 IPv4 网段、广播、主机范围、掩码和地址数量 |
| 🧭 User-Agent | 解析浏览器、系统、设备和引擎 |
| 📑 HTTP Header | 解析请求/响应头为表格 |

### 编码/解码工具 (`/codec`)
| 工具 | 说明 |
|------|------|
| ↔ Base64 | Base64 编码与解码 |
| 🔗 URL | URL 编码与解码 |
| <> HTML | HTML 实体编码与解码 |
| 🌐 Unicode | Unicode 编码转换 |
| 🔢 HEX | 十六进制编码与解码 |
| 🔑 JWT | JWT Token 编解码（含 HS256 签名） |
| # Hash | MD5 / SHA-1 / SHA-256 / SHA-512 |
| 🔏 HMAC | HMAC-SHA1/256/512，输出 HEX 和 Base64 |

### 开发者工具 (`/dev`)
| 工具 | 说明 |
|------|------|
| 🕒 时间戳 | Unix 时间戳与日期时间互转 |
| 🎨 颜色转换 | HEX / RGB / HSL 实时转换 |
| 🔍 正则测试 | 匹配高亮、分组捕获、替换预览 |
| 🔢 进制转换 | 二/八/十/十六进制互转 |
| 🆔 UUID | 批量生成 UUID v4 / v7 |
| 📋 文本对比 | 逐行差异高亮显示 |
| 🧾 JSON ↔ YAML | JSON 与 YAML 互转、格式化和校验 |
| 🧩 JSON ↔ XML | JSON 与 XML 互转、格式化和校验 |
| 📑 JSON ↔ CSV | 对象数组与 CSV 互转 |
| 📘 TOML ↔ JSON | TOML 与 JSON 互转和格式化 |
| 🗄️ SQL 格式化 | SQL 美化与压缩 |
| 💻 代码格式化 | 格式化或压缩 JavaScript / CSS |
| Aa 大小写转换 | camelCase / snake_case / kebab-case 等互转 |
| ⏱ Cron 解析 | 解析 Cron 并给出下次运行时间 |
| 🌍 时区转换 | 跨时区转换，显示 ISO 与 Unix |
| 📝 Markdown 预览 | 实时预览并复制消毒后的 HTML |
| 🎲 假数据生成 | 姓名、邮箱、电话、地址、UUID、Lorem |
| 🔐 权限计算 | 复选框 / 八进制 / rwxr-xr-x 互转 |

### 二维码工具 (`/qrcode`)
| 工具 | 说明 |
|------|------|
| 📱 生成 | 输入文本/URL 生成二维码 |
| 🔍 解码 | 上传图片识别二维码 |
| 🎨 美化 | 自定义颜色、圆角和 Logo |
| 📶 WiFi 二维码 | 生成 WIFI: 配网二维码 |
| 👤 名片二维码 | 表单生成 vCard 3.0 二维码 |

### SEO 工具 (`/seo`)
| 工具 | 说明 |
|------|------|
| 🏷️ Meta 标签 | 生成 title/description/keywords |
| 📊 关键词密度 | 分析关键词频率和密度 |
| 🗺️ Sitemap | 生成 XML 站点地图 |
| 🤖 Robots.txt | 生成 robots.txt |
| 🔗 死链检测 | 检测网页中的无效链接 |
| # H 标签 | 检查 H1-H6 标题结构 |
| 🔢 字符计数 | 统计标题/描述字符长度 |
| 🕷️ 全站爬取 | 爬取站内链接并发现问题 |
| 🌐 批量 URL | 批量提取域名和打开 URL |
| 🔍 404 检查 | 批量检查 URL 状态码 |
| 📰 OG 预览 | 生成 Open Graph / Twitter Card 并预览 |
| 🧩 JSON-LD | 引导生成 WebSite / Article / Organization / BreadcrumbList |

### 其他工具 (`/other`)
| 工具 | 说明 |
|------|------|
| 🔑 随机密码生成 | 生成安全随机密码并检测强度 |
| {} JSON 格式化 | 格式化、压缩和校验 JSON |

### 首页工具
首页重点展示图片格式转换、图片压缩、cURL 测试、域名检测、JSON 格式化和随机密码生成等高频入口。

## 技术栈

- **前端**: Nuxt 4 + Vue 3 Composition API
- **部署**: Cloudflare Pages SSR, Nitro `cloudflare_pages`
- **SEO**: SSR 页面、独立 meta/canonical、`/sitemap.xml`、`/robots.txt`

## 项目结构

```text
pages/
├── image/        # 图片工具页面
├── other/        # 其他工具页面
├── network/      # 网络工具页面
├── codec/        # 编码解码页面
├── dev/          # 开发者工具页面
├── qrcode/       # 二维码页面
├── seo/          # SEO 工具页面
├── index.vue
├── password.vue
└── json.vue
src/
├── views/
│   ├── image/    # 图片工具组件
│   ├── OtherTools.vue # 其他工具合集
│   ├── network/  # 网络检测和域名检测组件
│   ├── curl/     # cURL 工具组件
│   ├── codec/    # 编码解码组件
│   ├── dev/      # 开发者工具组件
│   ├── qrcode/   # 二维码组件
│   └── seo/      # SEO 工具组件
└── seo/          # 路由 SEO 元数据
server/
├── api/proxy.post.js
└── routes/
```

## License

MIT
