# AGENTS.md - 项目规范

## 项目概述

- **项目名称**: ToolX
- **类型**: Vue 3 单页 Web 应用 (SPA)
- **核心功能**: 开发者在线工具站，提供编码解码、二维码、cURL、SEO 等工具

## 工具分类

| 分类 | 路由 | 工具数量 |
|------|------|----------|
| 首页 | `/` | 密码生成、JSON 格式化 |
| 编码解码 | `/codec` | 7 个工具 |
| 开发工具 | `/dev` | 6 个工具 |
| 二维码 | `/qrcode` | 3 个工具 |
| cURL | `/curl` | 3 个工具 |
| SEO | `/seo` | 10 个工具 |

## 工作流程规范

### 添加新工具

1. 在 `src/views/[分类]/` 目录创建 Vue 组件
2. 在 `src/router/index.js` 添加路由
3. 在对应分类页面添加导航链接
4. **更新 README.md 工具列表**
5. **运行构建验证**: `pnpm build`

### 代码规范

- 使用 Vue 3 Composition API (`<script setup>`)
- 使用 CSS 变量 (`var(--primary-color)` 等)
- 组件文件使用 PascalCase 命名
- 路由使用 kebab-case 路径

### 需要更新的文件

| 修改类型 | 更新文件 |
|----------|----------|
| 添加工具 | `README.md`,`README-zh.md`,`README-en.md` (工具列表) |
| 修改配置 | `wrangler.toml` |
| 修改路由 | `src/router/index.js` |

## 构建命令

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 预览
pnpm preview
```