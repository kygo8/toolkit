export const siteUrl = 'https://toolx.app'

export const seoRoutes = [
  {
    path: '/',
    title: 'ToolX - 在线开发者工具站',
    description: 'ToolX 提供编码解码、JSON 格式化、密码生成、二维码、cURL、SEO 检测等在线开发者工具。'
  },
  {
    path: '/password',
    title: '随机密码生成器 - ToolX',
    description: '在线生成安全随机密码，支持长度、大小写字母、数字、符号和密码强度检测。'
  },
  {
    path: '/json',
    title: 'JSON 格式化工具 - ToolX',
    description: '在线格式化、压缩和校验 JSON 内容，适合接口调试和配置文件整理。'
  },
  {
    path: '/codec',
    title: '编码解码工具合集 - ToolX',
    description: '提供 Base64、URL、HTML、Unicode、HEX、JWT 和 Hash 等常用编码解码工具。'
  },
  {
    path: '/codec/base64',
    title: 'Base64 编码解码 - ToolX',
    description: '在线进行 Base64 编码和解码，支持文本快速转换。'
  },
  {
    path: '/codec/url',
    title: 'URL 编码解码 - ToolX',
    description: '在线进行 URL encode 和 URL decode，处理中文、参数和特殊字符。'
  },
  {
    path: '/codec/html',
    title: 'HTML 实体编码解码 - ToolX',
    description: '在线转换 HTML 实体字符，适合网页内容转义与还原。'
  },
  {
    path: '/codec/unicode',
    title: 'Unicode 编码解码 - ToolX',
    description: '在线转换 Unicode 转义序列和普通文本，支持 \\uXXXX 格式。'
  },
  {
    path: '/codec/hex',
    title: 'HEX 十六进制编码解码 - ToolX',
    description: '在线进行文本与十六进制 HEX 的互相转换。'
  },
  {
    path: '/codec/jwt',
    title: 'JWT Token 解码 - ToolX',
    description: '在线解析 JWT Header 和 Payload，快速查看 Token 内容。'
  },
  {
    path: '/codec/hash',
    title: 'Hash 计算工具 - ToolX',
    description: '在线计算 MD5、SHA-1、SHA-256、SHA-512 等哈希摘要。'
  },
  {
    path: '/dev',
    title: '开发者工具合集 - ToolX',
    description: '提供时间戳转换、颜色转换、正则测试、进制转换、UUID 生成和文本对比工具。'
  },
  {
    path: '/dev/timestamp',
    title: '时间戳转换工具 - ToolX',
    description: '在线转换 Unix 时间戳和日期时间，支持秒与毫秒格式。'
  },
  {
    path: '/dev/color',
    title: '颜色格式转换 - ToolX',
    description: '在线转换 HEX、RGB、HSL 等颜色格式，并支持实时颜色预览。'
  },
  {
    path: '/dev/regex',
    title: '正则表达式测试 - ToolX',
    description: '在线测试正则表达式，查看匹配结果、分组捕获和替换预览。'
  },
  {
    path: '/dev/number-base',
    title: '进制转换工具 - ToolX',
    description: '在线进行二进制、八进制、十进制和十六进制互相转换。'
  },
  {
    path: '/dev/uuid',
    title: 'UUID 生成器 - ToolX',
    description: '在线批量生成 UUID v4，支持大写格式复制。'
  },
  {
    path: '/dev/text-diff',
    title: '文本对比工具 - ToolX',
    description: '在线对比两段文本内容，逐行查看差异。'
  },
  {
    path: '/qrcode',
    title: '二维码工具合集 - ToolX',
    description: '提供二维码生成、二维码解码和二维码美化等在线工具。'
  },
  {
    path: '/qrcode/generate',
    title: '二维码生成器 - ToolX',
    description: '在线根据文本或 URL 生成二维码，支持尺寸、容错和颜色设置。'
  },
  {
    path: '/qrcode/decode',
    title: '二维码解码识别 - ToolX',
    description: '上传、拖拽或粘贴二维码图片，在线识别二维码内容。'
  },
  {
    path: '/qrcode/beautify',
    title: '二维码美化工具 - ToolX',
    description: '在线定制二维码渐变色、圆角、圆点样式、定位点配色和 Logo。'
  },
  {
    path: '/curl',
    title: 'cURL 工具合集 - ToolX',
    description: '提供 cURL 转代码、可视化 cURL 构建和 cURL 命令解析发送工具。'
  },
  {
    path: '/curl/to-code',
    title: 'cURL 转代码 - ToolX',
    description: '将 cURL 命令转换为 Python、JavaScript、Go、PHP、Java 等代码。'
  },
  {
    path: '/curl/builder',
    title: 'cURL 可视化构建器 - ToolX',
    description: '通过表单配置请求方法、URL、Headers、认证和 Body，生成 cURL 命令。'
  },
  {
    path: '/curl/parser',
    title: 'cURL 解析器与请求测试 - ToolX',
    description: '在线解析 cURL 命令，提取 URL、Headers、Body，并通过 Cloudflare 代理发送请求。'
  },
  {
    path: '/seo',
    title: 'SEO 工具合集 - ToolX',
    description: '提供 Meta 生成、关键词密度、Sitemap、Robots、死链检测、H 标签检查等 SEO 工具。'
  },
  {
    path: '/seo/meta',
    title: 'Meta 标签生成器 - ToolX',
    description: '在线生成 title、description、keywords、Open Graph 等 SEO Meta 标签。'
  },
  {
    path: '/seo/keyword-density',
    title: '关键词密度分析 - ToolX',
    description: '分析网页或文本中的关键词出现频率和密度，辅助 SEO 内容优化。'
  },
  {
    path: '/seo/character-counter',
    title: '标题描述字符计数 - ToolX',
    description: '统计标题、描述和文本字符长度，辅助控制 SEO 展示长度。'
  },
  {
    path: '/seo/dead-link',
    title: '死链检测工具 - ToolX',
    description: '检测网页中的无效链接，发现打不开或异常的外链和内链。'
  },
  {
    path: '/seo/robots',
    title: 'Robots.txt 生成器 - ToolX',
    description: '在线生成符合搜索引擎规范的 robots.txt 文件。'
  },
  {
    path: '/seo/sitemap',
    title: 'Sitemap XML 生成器 - ToolX',
    description: '在线生成 XML 网站地图，帮助搜索引擎发现和收录页面。'
  },
  {
    path: '/seo/htag',
    title: 'H 标签结构检查 - ToolX',
    description: '检查网页 H1-H6 标题层级结构，发现 SEO 标题结构问题。'
  },
  {
    path: '/seo/batch-url',
    title: '批量 URL 工具 - ToolX',
    description: '批量提取主域名和打开 URL，提升站点分析和链接处理效率。'
  },
  {
    path: '/seo/404-checker',
    title: '404 状态检查 - ToolX',
    description: '批量检查 URL 是否返回 404 或其他异常状态码。'
  },
  {
    path: '/seo/site-crawler',
    title: '网站爬虫工具 - ToolX',
    description: '递归爬取站内链接，发现页面、死链和 404 问题。'
  }
]

export const seoByPath = Object.fromEntries(seoRoutes.map((route) => [route.path, route]))
