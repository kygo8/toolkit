# ToolX - 开发者工具站

> 官网: https://toolx.app

一个基于 Vue 3 + Vite 的在线工具站。

## 功能列表

### 编码/解码工具 (`/codec`)
| 工具 | 说明 |
|------|------|
| ↔ Base64 | Base64 编码与解码 |
| 🔗 URL | URL 编码与解码 |
| <> HTML | HTML 实体编码与解码 |
| 🌐 Unicode | Unicode 编码 (`\uXXXX` 格式) |
| 🔢 HEX | 十六进制编码与解码 |
| 🔑 JWT | JWT Token 解码 (Header/Payload) |
| # Hash | MD5 / SHA-1 / SHA-256 / SHA-512 |

### 开发者工具 (`/dev`)
| 工具 | 说明 |
|------|------|
| 🕐 时间戳 | Unix 时间戳 ↔ 日期时间，秒/毫秒互转 |
| 🎨 颜色转换 | HEX / RGB / HSL 实时联动，颜色选择器 |
| 🔍 正则测试 | 正则表达式匹配高亮、分组捕获、替换预览 |
| 🔢 进制转换 | 二/八/十/十六进制互转 |
| 🆔 UUID | 批量生成 UUID v4，支持大写 |
| 📄 文本对比 | 逐行差异高亮显示 |

### 二维码工具 (`/qrcode`)
| 工具 | 说明 |
|------|------|
| 📱 生成 | 输入文本/URL 生成二维码，支持尺寸/容错/颜色 |
| 🔍 解码 | 上传/拖拽/粘贴图片识别二维码 |
| 🎨 美化 | 渐变色/圆角/圆点样式/定位点配色/嵌入Logo |

### cURL 工具 (`/curl`)
| 工具 | 说明 |
|------|------|
| 🔄 转代码 | cURL 命令转为 Python/JavaScript/Go/PHP/Java 代码 |
| 🛠️ 构建器 | 可视化表单构建 cURL 命令 |
| 🔍 解析器 | 解析 cURL 命令，提取 Headers(k:v)，直接发送请求获取响应 |

### SEO 工具 (`/seo`)
| 工具 | 说明 |
|------|------|
| 🌐 批量域名 | 批量提取主域名和打开URL |
| 🕷️ 全站爬取 | 递归爬取站内链接，CORS代理，发现死链和404 |
| 📝 Meta标签 | 生成 title/description/keywords 等 |
| 📊 关键词密度 | 分析关键词出现频率和密度 |
| 🗺️ Sitemap | 生成 XML 网站地图 |
| 🔍 404检查 | 批量检查URL是否返回404 |
| 🔗 死链检测 | 检测网页中的无效链接 |
| 🤖 Robots.txt | 生成符合标准的 robots.txt |
| # H标签 | 检查网页H1-H6标签结构 |
| 🔢 字符计数 | 统计标题/描述字符长度 |

### 首页工具
| 工具 | 说明 |
|------|------|
| 🔑 密码生成 | 随机密码，支持长度/字符类型，密码强度检测 |
| {} JSON | JSON 格式化/压缩，语法高亮 |

## 技术栈

- **前端**: Vue 3 (Composition API) + Vue Router + Vite

## 项目结构

```
src/
├── views/
│   ├── codec/        # 7个编码解码工具
│   ├── dev/          # 6个开发者工具
│   ├── seo/          # 10个SEO工具
│   ├── qrcode/       # 3个二维码工具
│   ├── curl/         # 3个cURL工具
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
├── api/proxy.js      # API代理
└── _routes.json     # 路由配置
```

## License

MIT