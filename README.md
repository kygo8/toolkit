# DevTools Hub - 开发者工具站

一个基于 Vue 3 + Vite 的在线工具站，提供开发者和SEO从业者常用的工具。

## 功能列表

### 开发者工具
- 🔑 随机密码生成（支持密码强度检测）
- {} JSON 格式化/压缩
- ↔ Base64 编解码
- 🔗 URL 编解码

### SEO 工具
- 📝 Meta 标签生成器
- 📊 关键词密度分析
- 🔢 字符计数器
- 🔗 死链检测
- 🤖 Robots.txt 生成器
- 🗺️ Sitemap.xml 生成器
- # H 标签结构检查

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
2. 进入 **Workers 和 Pages** → **Pages**
3. 点击 **部署新版本**
4. 直接上传 `dist` 目录中的所有文件（拖拽或选择文件夹）
5. 部署完成后即可通过分配的域名访问

## 技术栈

- Vue 3 (Composition API)
- Vue Router
- Vite
- Cloudflare Pages (静态部署)
