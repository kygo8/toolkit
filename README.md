# DevTools Hub - 开发者工具站

一个基于 Vue 3 + Vite 的在线工具站，纯前端实现，可部署到任意静态托管服务。

## 功能列表

### 编码/解码工具 (`/codec`)
- ↔ Base64 编解码
- 🔗 URL 编解码
- <> HTML 实体编解码
- 🌐 Unicode 编解码 (`\uXXXX`)
- 🔢 HEX 十六进制编解码
- 🔑 JWT Token 解码
- # MD5 / SHA-1 / SHA-256 / SHA-512 哈希计算

### 开发者工具 (`/dev`)
- 🕐 时间戳转换（Unix 时间戳 ↔ 日期时间，秒/毫秒）
- 🎨 颜色转换（HEX / RGB / HSL 实时联动，带颜色选择器）
- 🔍 正则表达式测试（匹配高亮、分组捕获、替换预览）
- 🔢 进制转换（二进制 / 八进制 / 十进制 / 十六进制）
- 🆔 UUID 批量生成（v4，支持大写）
- 📄 文本对比（逐行差异高亮）

### SEO 工具 (`/seo`)
- 🌐 批量域名工具
- 🕷️ 全站链接爬取（CORS代理，自动发现站内链接）
- 📝 Meta 标签生成器
- 📊 关键词密度分析
- 🗺️ Sitemap.xml 生成器
- 🔍 404 页面检查
- 🔗 死链检测
- 🤖 Robots.txt 生成器
- # H 标签结构检查
- 🔢 字符计数器

### 其他工具
- 🔑 随机密码生成（密码强度检测）
- {} JSON 格式化 / 压缩

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 构建部署

```bash
# 构建生产版本
pnpm build
```

构建完成后，`dist` 目录中的静态文件可部署到任意静态托管服务。

### 部署到 Cloudflare Pages

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers 和 Pages** → **toolkit**
3. 点击 **部署新版本**
4. 直接上传 `dist` 目录中的所有文件（拖拽或选择文件夹）
5. 部署完成后即可通过分配的域名访问

## 项目结构

```
src/
├── views/
│   ├── codec/        # 编码/解码工具 (7个)
│   ├── dev/          # 开发者工具 (6个)
│   ├── seo/          # SEO工具 (10个)
│   ├── CodecTools.vue
│   ├── DevTools.vue
│   ├── SeoTools.vue
│   ├── Home.vue
│   ├── PasswordGenerator.vue
│   └── JsonFormatter.vue
├── router/
├── App.vue
└── main.js
```

## 技术栈

- Vue 3 (Composition API)
- Vue Router
- Vite
- 纯前端，无后台依赖
