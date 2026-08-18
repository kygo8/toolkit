import { categoryCatalog, toolCatalog } from './catalog.js'

const common = {
  language: 'Language',
  themeLight: 'Light mode',
  themeDark: 'Dark mode',
  menuToggle: 'Toggle menu',
  recentTools: 'Recent',
  toolCount: '{count} tools',
  footerText: 'ToolX | Developer Tools'
}

const en = {
  common,
  nav: {
    home: 'Home',
    image: 'Image Tools',
    codec: 'Codec Tools',
    dev: 'Developer Tools',
    network: 'Network Tools',
    qrcode: 'QR Code',
    seo: 'SEO Tools',
    other: 'Other Tools'
  },
  home: {
    eyebrow: 'Developer & SEO Toolkit',
    title: 'ToolX Online Toolkit',
    subtitle: 'ToolX provides online developer tools, image conversion tools, network diagnostics and SEO tools for JSON formatting, image compression, image to Base64, cURL testing, domain checks, encoding and QR code generation.',
    panelLabel: 'Quick access',
    panelBody: 'No installation required. Use everything directly in the browser. Image processing stays local, and text tools use an SSR-friendly page structure for search engines.',
    featuredTitle: 'Popular Tools',
    featuredDesc: 'High-frequency tools are placed on the first screen to reduce clicks.',
    categoriesTitle: 'All Tool Categories',
    categoriesDesc: 'Organized by image, network, codec, developer, QR code, SEO and miscellaneous scenarios, with readable titles and descriptions for search engines.',
    seoTitle: 'Why choose ToolX online tools?',
    seoBody: 'ToolX is built for developers, site owners and content operators. Convert PNG, JPG and WebP images, compress web assets, check networks and domains, generate strong passwords, format JSON and handle common SEO tasks without installing desktop software.'
  },
  categories: {
    image: { title: 'Image Tools', eyebrow: 'Image Toolkit', desc: 'Image format conversion, compression, watermarking, crop/resize, SVG conversion, EXIF inspection and image to Base64 tools that run locally in your browser.' },
    network: { title: 'Network Tools', eyebrow: 'Network Toolkit', desc: 'Network diagnostics for developers, operations and SEO troubleshooting, covering connectivity, DNS, domains and HTTP request testing.' },
    codec: { title: 'Codec Tools', eyebrow: 'Codec Toolkit', desc: 'Base64, URL, HTML, Unicode, HEX, JWT, hash and HMAC encoding or decoding tools.' },
    dev: { title: 'Developer Tools', eyebrow: 'Developer Toolkit', desc: 'Timestamp, color, regex, number base, UUID, text diff, JSON/YAML/XML/CSV/TOML/SQL/code formatting, case convert, cron, timezone, Markdown, fake data and chmod utilities.' },
    qrcode: { title: 'QR Code Tools', eyebrow: 'QR Toolkit', desc: 'Generate, decode and beautify QR codes online.' },
    seo: { title: 'SEO Tools', eyebrow: 'SEO Toolkit', desc: 'Meta tags, keyword density, sitemap, robots.txt, dead link and heading structure tools.' },
    other: { title: 'Other Tools', eyebrow: 'Misc Toolkit', desc: 'Common utilities that do not fit into image, network, codec, developer, QR code or SEO categories.' },
    curl: { title: 'cURL Tools', eyebrow: 'cURL Toolkit', desc: 'Test cURL commands, convert them to code and build cURL requests visually.' }
  },
  tools: {
    imageConvert: { title: 'Image Format Converter', desc: 'Convert PNG, JPG and WebP images locally in the browser.' },
    imageCompress: { title: 'Image Compressor', desc: 'Adjust quality and width to reduce image size quickly.' },
    imageBase64: { title: 'Image to Base64', desc: 'Convert images to Base64 or Data URL for CSS, HTML and API debugging.' },
    imageWatermark: { title: 'Image Watermark', desc: 'Add text watermarks, image logos, circle stamps, square stamps and tiled marks to images locally.' },
    imageResize: { title: 'Image Crop & Resize', desc: 'Crop and resize images locally, then download PNG, JPG or WebP.' },
    svgConvert: { title: 'SVG Converter', desc: 'Convert SVG to PNG, or wrap raster images in a simple SVG locally.' },
    imageExif: { title: 'EXIF Viewer', desc: 'Inspect camera, GPS and date metadata, then export a stripped copy.' },
    networkCheck: { title: 'Network Check', desc: 'Check browser online status, current network information, site reachability and latency.' },
    domainCheck: { title: 'Domain Check', desc: 'Parse domain structure and query A, AAAA, CNAME, MX, NS and TXT DNS records.' },
    curlTest: { title: 'cURL Test', desc: 'Parse cURL commands and send requests through a proxy to inspect status, headers and body.' },
    curlBuilder: { title: 'cURL Builder', desc: 'Build cURL commands with a visual form for headers, authentication and body.' },
    curlToCode: { title: 'cURL to Code', desc: 'Convert cURL commands to Python, JavaScript, Go, PHP and Java code.' },
    base64: { title: 'Base64 Encode/Decode', desc: 'Encode and decode Base64 text online.' },
    url: { title: 'URL Encode/Decode', desc: 'Encode and decode URLs, parameters and special characters.' },
    html: { title: 'HTML Entity Codec', desc: 'Encode and decode HTML entities for web content.' },
    unicode: { title: 'Unicode Codec', desc: 'Convert Unicode escape sequences and plain text.' },
    hex: { title: 'HEX Codec', desc: 'Convert text and hexadecimal values back and forth.' },
    jwt: { title: 'JWT Encode/Decode', desc: 'Decode JWT tokens or sign new HS256 tokens in the browser.' },
    hash: { title: 'MD5/Hash Calculator', desc: 'Calculate MD5, SHA-1, SHA-256 and SHA-512 hashes.' },
    hmac: { title: 'HMAC Generator', desc: 'Compute HMAC-SHA1, HMAC-SHA256 and HMAC-SHA512 with hex and Base64 output.' },
    timestamp: { title: 'Timestamp Converter', desc: 'Convert Unix timestamps and date time values.' },
    color: { title: 'Color Converter', desc: 'Convert HEX, RGB and HSL color formats.' },
    regex: { title: 'Regex Tester', desc: 'Test regular expressions and inspect matches.' },
    numberBase: { title: 'Number Base Converter', desc: 'Convert binary, octal, decimal and hexadecimal numbers.' },
    uuid: { title: 'UUID Generator', desc: 'Generate UUID v4 and UUID v7 values in batches.' },
    textDiff: { title: 'Text Diff', desc: 'Compare two text blocks and view differences.' },
    jsonYaml: { title: 'JSON YAML Converter', desc: 'Convert, format and validate JSON and YAML in the browser.' },
    jsonXml: { title: 'JSON XML Converter', desc: 'Convert, format and validate JSON and XML in the browser.' },
    jsonCsv: { title: 'JSON CSV Converter', desc: 'Convert an array of objects between JSON and CSV.' },
    tomlJson: { title: 'TOML JSON Converter', desc: 'Convert and format TOML and JSON configuration files.' },
    sqlFormat: { title: 'SQL Formatter', desc: 'Beautify or minify SQL for MySQL, PostgreSQL, SQLite and more.' },
    codeFormat: { title: 'Code Formatter', desc: 'Format or minify JavaScript and CSS with space or tab indentation.' },
    caseConvert: { title: 'Case Converter', desc: 'Convert text among camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE and Title Case.' },
    cron: { title: 'Cron Parser', desc: 'Parse 5- or 6-field cron expressions, describe them, and show the next run times.' },
    timezone: { title: 'Timezone Converter', desc: 'Convert a moment across common timezones and show ISO plus Unix timestamps.' },
    markdown: { title: 'Markdown Preview', desc: 'Preview Markdown live and copy sanitized HTML.' },
    fakeData: { title: 'Fake Data Generator', desc: 'Generate names, emails, phones, addresses, UUIDs and lorem text for zh-CN and English.' },
    chmod: { title: 'chmod Calculator', desc: 'Convert Unix permissions among checkboxes, octal and symbolic rwxr-xr-x form.' },
    qrGenerate: { title: 'QR Code Generator', desc: 'Generate QR codes from text or URLs with custom size.' },
    qrDecode: { title: 'QR Code Decoder', desc: 'Upload a QR image and extract its content.' },
    qrBeautify: { title: 'QR Code Beautifier', desc: 'Customize colors, gradients, corners, dots and logo.' },
    batchUrl: { title: 'Batch URL Tools', desc: 'Extract root domains and open URLs in batches.' },
    siteCrawler: { title: 'Site Crawler', desc: 'Crawl internal links and check status codes to find dead links and 404 pages.' },
    meta: { title: 'Meta Tag Generator', desc: 'Generate title, description, keywords and Open Graph meta tags.' },
    keywordDensity: { title: 'Keyword Density Analyzer', desc: 'Analyze keyword frequency and density in web pages or text.' },
    sitemap: { title: 'Sitemap XML Generator', desc: 'Generate XML sitemaps for search engines.' },
    checker404: { title: '404 Status Checker', desc: 'Check whether URLs return 404 or other abnormal status codes.' },
    deadLink: { title: 'Dead Link Checker', desc: 'Find broken and invalid links in web pages.' },
    robots: { title: 'Robots.txt Generator', desc: 'Generate standards-compliant robots.txt files.' },
    htag: { title: 'H Tag Checker', desc: 'Check H1-H6 heading structure for SEO.' },
    characterCounter: { title: 'Character Counter', desc: 'Count title and description length for SEO display limits.' },
    password: { title: 'Random Password Generator', desc: 'Generate strong random passwords and check password strength.' },
    json: { title: 'JSON Formatter', desc: 'Format, compress and validate JSON for API debugging and config cleanup.' }
  },
  seo: {
    homeTitle: 'ToolX Online Toolkit - Developer, Image, Network and SEO Tools',
    homeDescription: 'ToolX provides online developer tools, image conversion, image compression, image to Base64, crop and resize, SVG conversion, EXIF viewing, network checks, domain checks, cURL testing, JSON formatting, codec tools, QR code tools and SEO utilities.',
    categoryTitle: '{title} - ToolX',
    categoryDescription: '{description}',
    toolTitle: '{title} - ToolX',
    toolDescription: '{description}'
  }
}

const zhCN = {
  common: {
    language: '语言',
    themeLight: '亮色模式',
    themeDark: '暗色模式',
    menuToggle: '切换菜单',
    recentTools: '最近',
    toolCount: '{count} 个工具',
    footerText: 'ToolX | 开发者工具'
  },
  nav: {
    home: '首页',
    image: '图片工具',
    codec: '编码解码',
    dev: '开发工具',
    network: '网络工具',
    qrcode: '二维码',
    seo: 'SEO工具',
    other: '其他工具'
  },
  home: {
    eyebrow: 'Developer & SEO Toolkit',
    title: 'ToolX 在线工具箱',
    subtitle: 'ToolX 提供在线开发者工具、图片转换工具、网络检测工具和 SEO 工具，覆盖 JSON 格式化、图片压缩、图片转 Base64、cURL 测试、域名检测、编码解码、二维码生成等高频场景。',
    panelLabel: '快速入口',
    panelBody: '无需安装，浏览器直接使用。图片处理在本地完成，文本工具支持 SSR 页面结构，便于搜索引擎收录。',
    featuredTitle: '常用工具',
    featuredDesc: '把最高频的工具放在首页第一屏，减少点击路径。',
    categoriesTitle: '全部工具分类',
    categoriesDesc: '按图片、网络、编码、开发、二维码、SEO 和其他工具场景整理，页面标题和描述均可被搜索引擎读取。',
    seoTitle: '为什么选择 ToolX 在线工具？',
    seoBody: 'ToolX 面向开发者、站长和内容运营人员，提供常用在线工具集合。你可以使用图片格式转换工具把 PNG、JPG、WebP 互转，用图片压缩工具降低网页图片体积，用网络检测和域名检测工具排查连接问题，用随机密码生成器创建安全密码，也可以在其他工具中找到 JSON 格式化等通用小工具。'
  },
  categories: {
    image: { title: '图片工具', eyebrow: 'Image Toolkit', desc: '图片格式转换、压缩、水印、裁剪缩放、SVG 转换、EXIF 查看和图片转 Base64，所有处理都在浏览器本地完成。' },
    network: { title: '网络工具', eyebrow: 'Network Toolkit', desc: '面向开发、运维和 SEO 排查的网络诊断工具集合，覆盖连通性、DNS、域名和 HTTP 请求测试。' },
    codec: { title: '编码/解码工具', eyebrow: 'Codec Toolkit', desc: 'Base64、URL、HTML、Unicode、HEX、JWT、Hash 和 HMAC 等常用编码解码工具。' },
    dev: { title: '开发者工具', eyebrow: 'Developer Toolkit', desc: '时间戳、颜色、正则、进制、UUID、文本对比，JSON/YAML/XML/CSV/TOML/SQL 和代码格式化，以及大小写、Cron、时区、Markdown、假数据和权限计算等开发辅助工具。' },
    qrcode: { title: '二维码工具', eyebrow: 'QR Toolkit', desc: '二维码生成、解码识别和自定义美化工具。' },
    seo: { title: 'SEO工具集', eyebrow: 'SEO Toolkit', desc: 'Meta、关键词密度、Sitemap、Robots、死链检测和 H 标签结构检查等 SEO 工具。' },
    other: { title: '其他工具', eyebrow: 'Misc Toolkit', desc: '收纳不适合归入图片、网络、编码、开发、二维码或 SEO 分类的常用小工具。' },
    curl: { title: 'cURL 工具', eyebrow: 'cURL Toolkit', desc: '提供 cURL 测试、cURL 转代码和可视化 cURL 构建工具。' }
  },
  tools: {
    imageConvert: { title: '图片格式转换', desc: 'PNG、JPG、WebP 在线本地转换。' },
    imageCompress: { title: '图片压缩', desc: '调整质量和最大宽度，快速压缩图片体积。' },
    imageBase64: { title: '图片转 Base64', desc: '将图片转换为 Base64 或 Data URL，适合 CSS、HTML 和接口调试。' },
    imageWatermark: { title: '图片水印', desc: '在本地为图片添加文字水印、图片 Logo、圆形印章、方形印章和平铺水印。' },
    imageResize: { title: '图片裁剪缩放', desc: '在浏览器本地裁剪和缩放图片，并下载 PNG、JPG 或 WebP。' },
    svgConvert: { title: 'SVG 转换', desc: '将 SVG 转为 PNG，或把位图包装成简易 SVG，全部在本地完成。' },
    imageExif: { title: 'EXIF 查看', desc: '查看相机、GPS 和拍摄时间等元数据，并导出去除 EXIF 的副本。' },
    networkCheck: { title: '网络检测', desc: '检测浏览器联网状态、当前网络信息、本站连通性和响应延迟。' },
    domainCheck: { title: '域名检测', desc: '解析域名结构，查询 A、AAAA、CNAME、MX、NS、TXT 等 DNS 记录。' },
    curlTest: { title: 'cURL 测试', desc: '解析 cURL 命令并通过代理发送请求，查看响应状态、Header 和 Body。' },
    curlBuilder: { title: 'cURL 构建器', desc: '通过可视化表单构建 cURL 命令，支持 Header、认证和 Body。' },
    curlToCode: { title: 'cURL 转代码', desc: '将 cURL 命令转为 Python、JavaScript、Go、PHP、Java 代码。' },
    base64: { title: 'Base64 编解码', desc: 'Base64 编码与解码转换。' },
    url: { title: 'URL 编解码', desc: 'URL 编码与解码转换。' },
    html: { title: 'HTML 编解码', desc: 'HTML 实体编码与解码转换。' },
    unicode: { title: 'Unicode 编解码', desc: 'Unicode 编码与解码，支持 \\uXXXX 格式。' },
    hex: { title: 'HEX 编解码', desc: '十六进制编码与解码转换。' },
    jwt: { title: 'JWT 编解码', desc: '解析 JWT Token，或使用 HS256 在浏览器中签名生成。' },
    hash: { title: 'MD5/Hash', desc: '计算文本的 MD5、SHA-1、SHA-256 哈希值。' },
    hmac: { title: 'HMAC 计算', desc: '计算 HMAC-SHA1、HMAC-SHA256、HMAC-SHA512，输出 HEX 和 Base64。' },
    timestamp: { title: '时间戳转换', desc: 'Unix 时间戳与日期时间互转。' },
    color: { title: '颜色转换', desc: 'HEX、RGB、HSL 颜色格式互转。' },
    regex: { title: '正则测试', desc: '正则表达式在线测试与匹配。' },
    numberBase: { title: '进制转换', desc: '二进制、八进制、十进制、十六进制互转。' },
    uuid: { title: 'UUID 生成', desc: '批量生成 UUID v4 和 UUID v7。' },
    textDiff: { title: '文本对比', desc: '对比两段文本的差异。' },
    jsonYaml: { title: 'JSON YAML 转换', desc: '在浏览器中互转、格式化和校验 JSON 与 YAML。' },
    jsonXml: { title: 'JSON XML 转换', desc: '在浏览器中互转、格式化和校验 JSON 与 XML。' },
    jsonCsv: { title: 'JSON CSV 转换', desc: '将对象数组在 JSON 和 CSV 之间互相转换。' },
    tomlJson: { title: 'TOML JSON 转换', desc: '互转并格式化 TOML 与 JSON 配置文件。' },
    sqlFormat: { title: 'SQL 格式化', desc: '美化或压缩 SQL，支持 MySQL、PostgreSQL、SQLite 等方言。' },
    codeFormat: { title: '代码格式化', desc: '格式化或压缩 JavaScript 和 CSS，支持空格或 Tab 缩进。' },
    caseConvert: { title: '大小写转换', desc: '在 camelCase、snake_case、kebab-case、PascalCase、CONSTANT_CASE 和 Title Case 之间转换。' },
    cron: { title: 'Cron 解析', desc: '解析 5/6 段 Cron 表达式，生成可读描述和接下来的运行时间。' },
    timezone: { title: '时区转换', desc: '在常见时区之间转换时间，并显示 ISO 与 Unix 时间戳。' },
    markdown: { title: 'Markdown 预览', desc: '实时预览 Markdown，并复制经过消毒的 HTML。' },
    fakeData: { title: '假数据生成', desc: '生成中英姓名、邮箱、电话、地址、UUID 和 Lorem 测试数据。' },
    chmod: { title: '权限计算', desc: '在复选框、八进制和 rwxr-xr-x 符号权限之间互转。' },
    qrGenerate: { title: '二维码生成', desc: '输入文本或 URL 生成二维码，支持自定义尺寸。' },
    qrDecode: { title: '二维码解码', desc: '上传二维码图片，识别并提取内容。' },
    qrBeautify: { title: '二维码美化', desc: '自定义颜色、渐变、圆角、Logo 等样式。' },
    batchUrl: { title: '批量域名工具', desc: '批量提取主域名和打开 URL。' },
    siteCrawler: { title: '全站链接爬取', desc: '爬取全站链接并检查状态码，发现死链和 404 页面。' },
    meta: { title: 'Meta标签生成器', desc: '生成网页 title、description、keywords 等 Meta 标签。' },
    keywordDensity: { title: '关键词密度分析', desc: '分析网页内容中关键词的出现频率和密度。' },
    sitemap: { title: 'Sitemap生成', desc: '生成 XML 网站地图。' },
    checker404: { title: '404页面检查', desc: '批量检查 URL 是否返回 404 状态码。' },
    deadLink: { title: '死链检测', desc: '检测网页中的死链和无效链接。' },
    robots: { title: 'Robots.txt生成', desc: '生成符合标准的 robots.txt 文件。' },
    htag: { title: 'H标签检查', desc: '检查网页 H1-H6 标签结构是否合理。' },
    characterCounter: { title: '字符计数器', desc: '统计标题、描述等字符长度是否符合 SEO 标准。' },
    password: { title: '随机密码生成', desc: '生成安全随机密码，支持长度、字符类型和密码强度检测。' },
    json: { title: 'JSON 格式化', desc: '格式化、压缩和校验 JSON，适合接口调试和配置文件整理。' }
  },
  seo: {
    homeTitle: 'ToolX 在线工具箱 - 开发者工具、图片转换、网络检测与 SEO 工具',
    homeDescription: 'ToolX 提供在线开发者工具、图片转换、图片压缩、图片转 Base64、裁剪缩放、SVG 转换、EXIF 查看、网络检测、域名检测、cURL 测试、JSON 格式化、编码解码、二维码和 SEO 工具。',
    categoryTitle: '{title} - ToolX',
    categoryDescription: '{description}',
    toolTitle: '{title} - ToolX',
    toolDescription: '{description}'
  }
}

const localizedCommon = {
  ja: { language: '言語', themeLight: 'ライトモード', themeDark: 'ダークモード' },
  ko: { language: '언어', themeLight: '라이트 모드', themeDark: '다크 모드' },
  es: { language: 'Idioma', themeLight: 'Modo claro', themeDark: 'Modo oscuro' },
  fr: { language: 'Langue', themeLight: 'Mode clair', themeDark: 'Mode sombre' },
  de: { language: 'Sprache', themeLight: 'Heller Modus', themeDark: 'Dunkler Modus' },
  pt: { language: 'Idioma', themeLight: 'Modo claro', themeDark: 'Modo escuro' },
  ru: { language: 'Язык', themeLight: 'Светлая тема', themeDark: 'Темная тема' },
  ar: { language: 'اللغة', themeLight: 'الوضع الفاتح', themeDark: 'الوضع الداكن' },
  hi: { language: 'भाषा', themeLight: 'लाइट मोड', themeDark: 'डार्क मोड' },
  id: { language: 'Bahasa', themeLight: 'Mode terang', themeDark: 'Mode gelap' },
  vi: { language: 'Ngôn ngữ', themeLight: 'Chế độ sáng', themeDark: 'Chế độ tối' },
  tr: { language: 'Dil', themeLight: 'Açık mod', themeDark: 'Koyu mod' },
  it: { language: 'Lingua', themeLight: 'Modalità chiara', themeDark: 'Modalità scura' },
  th: { language: 'ภาษา', themeLight: 'โหมดสว่าง', themeDark: 'โหมดมืด' },
  fa: { language: 'زبان', themeLight: 'حالت روشن', themeDark: 'حالت تاریک' },
  bn: { language: 'ভাষা', themeLight: 'লাইট মোড', themeDark: 'ডার্ক মোড' },
  ur: { language: 'زبان', themeLight: 'لائٹ موڈ', themeDark: 'ڈارک موڈ' },
  ta: { language: 'மொழி', themeLight: 'ஒளி முறை', themeDark: 'இருள் முறை' },
  te: { language: 'భాష', themeLight: 'లైట్ మోడ్', themeDark: 'డార్క్ మోడ్' },
  mr: { language: 'भाषा', themeLight: 'लाईट मोड', themeDark: 'डार्क मोड' },
  tl: { language: 'Wika', themeLight: 'Light mode', themeDark: 'Dark mode' },
  sw: { language: 'Lugha', themeLight: 'Hali ya mwanga', themeDark: 'Hali ya giza' }
}

const localizedNav = {
  ja: { home: 'ホーム', image: '画像ツール', codec: '変換ツール', dev: '開発ツール', network: 'ネットワーク', qrcode: 'QRコード', seo: 'SEOツール', other: 'その他' },
  ko: { home: '홈', image: '이미지 도구', codec: '인코딩 도구', dev: '개발 도구', network: '네트워크 도구', qrcode: 'QR 코드', seo: 'SEO 도구', other: '기타 도구' },
  es: { home: 'Inicio', image: 'Imágenes', codec: 'Codificación', dev: 'Desarrollo', network: 'Red', qrcode: 'Código QR', seo: 'SEO', other: 'Otros' },
  fr: { home: 'Accueil', image: 'Images', codec: 'Encodage', dev: 'Développeur', network: 'Réseau', qrcode: 'QR code', seo: 'SEO', other: 'Autres' },
  de: { home: 'Start', image: 'Bilder', codec: 'Kodierung', dev: 'Entwickler', network: 'Netzwerk', qrcode: 'QR-Code', seo: 'SEO', other: 'Weitere' },
  pt: { home: 'Início', image: 'Imagens', codec: 'Codificação', dev: 'Dev', network: 'Rede', qrcode: 'QR Code', seo: 'SEO', other: 'Outros' },
  ru: { home: 'Главная', image: 'Изображения', codec: 'Кодирование', dev: 'Разработка', network: 'Сеть', qrcode: 'QR-код', seo: 'SEO', other: 'Прочее' },
  ar: { home: 'الرئيسية', image: 'الصور', codec: 'الترميز', dev: 'المطورون', network: 'الشبكة', qrcode: 'رمز QR', seo: 'SEO', other: 'أخرى' },
  hi: { home: 'होम', image: 'छवि टूल', codec: 'कोडिंग', dev: 'डेवलपर', network: 'नेटवर्क', qrcode: 'QR कोड', seo: 'SEO', other: 'अन्य' },
  id: { home: 'Beranda', image: 'Gambar', codec: 'Codec', dev: 'Developer', network: 'Jaringan', qrcode: 'Kode QR', seo: 'SEO', other: 'Lainnya' },
  vi: { home: 'Trang chủ', image: 'Hình ảnh', codec: 'Mã hóa', dev: 'Lập trình', network: 'Mạng', qrcode: 'Mã QR', seo: 'SEO', other: 'Khác' },
  tr: { home: 'Ana sayfa', image: 'Görseller', codec: 'Kodlama', dev: 'Geliştirici', network: 'Ağ', qrcode: 'QR Kod', seo: 'SEO', other: 'Diğer' },
  it: { home: 'Home', image: 'Immagini', codec: 'Codifica', dev: 'Sviluppo', network: 'Rete', qrcode: 'QR Code', seo: 'SEO', other: 'Altro' },
  th: { home: 'หน้าแรก', image: 'รูปภาพ', codec: 'เข้ารหัส', dev: 'นักพัฒนา', network: 'เครือข่าย', qrcode: 'QR Code', seo: 'SEO', other: 'อื่นๆ' },
  fa: { home: 'خانه', image: 'تصاویر', codec: 'کدگذاری', dev: 'توسعه', network: 'شبکه', qrcode: 'کد QR', seo: 'SEO', other: 'سایر' },
  bn: { home: 'হোম', image: 'ছবি', codec: 'কোডিং', dev: 'ডেভেলপার', network: 'নেটওয়ার্ক', qrcode: 'QR কোড', seo: 'SEO', other: 'অন্যান্য' },
  ur: { home: 'ہوم', image: 'تصاویر', codec: 'کوڈنگ', dev: 'ڈویلپر', network: 'نیٹ ورک', qrcode: 'QR کوڈ', seo: 'SEO', other: 'دیگر' },
  ta: { home: 'முகப்பு', image: 'படங்கள்', codec: 'குறியாக்கம்', dev: 'டெவலப்பர்', network: 'நெட்வொர்க்', qrcode: 'QR குறியீடு', seo: 'SEO', other: 'மற்றவை' },
  te: { home: 'హోమ్', image: 'చిత్రాలు', codec: 'కోడింగ్', dev: 'డెవలపర్', network: 'నెట్‌వర్క్', qrcode: 'QR కోడ్', seo: 'SEO', other: 'ఇతర' },
  mr: { home: 'मुख्य', image: 'प्रतिमा', codec: 'कोडिंग', dev: 'डेव्हलपर', network: 'नेटवर्क', qrcode: 'QR कोड', seo: 'SEO', other: 'इतर' },
  tl: { home: 'Home', image: 'Larawan', codec: 'Codec', dev: 'Developer', network: 'Network', qrcode: 'QR Code', seo: 'SEO', other: 'Iba pa' },
  sw: { home: 'Nyumbani', image: 'Picha', codec: 'Usimbaji', dev: 'Msanidi', network: 'Mtandao', qrcode: 'Msimbo QR', seo: 'SEO', other: 'Nyingine' }
}

const withLocalizedCommon = (code) => ({
  ...en,
  common: {
    ...en.common,
    ...(localizedCommon[code] || {})
  },
  nav: {
    ...en.nav,
    ...(localizedNav[code] || {})
  }
})

export const messages = {
  en,
  'zh-CN': zhCN,
  ja: withLocalizedCommon('ja'),
  ko: withLocalizedCommon('ko'),
  es: withLocalizedCommon('es'),
  fr: withLocalizedCommon('fr'),
  de: withLocalizedCommon('de'),
  pt: withLocalizedCommon('pt'),
  ru: withLocalizedCommon('ru'),
  ar: withLocalizedCommon('ar'),
  hi: withLocalizedCommon('hi'),
  id: withLocalizedCommon('id'),
  vi: withLocalizedCommon('vi'),
  tr: withLocalizedCommon('tr'),
  it: withLocalizedCommon('it'),
  th: withLocalizedCommon('th'),
  fa: withLocalizedCommon('fa'),
  bn: withLocalizedCommon('bn'),
  ur: withLocalizedCommon('ur'),
  ta: withLocalizedCommon('ta'),
  te: withLocalizedCommon('te'),
  mr: withLocalizedCommon('mr'),
  tl: withLocalizedCommon('tl'),
  sw: withLocalizedCommon('sw')
}

export const getMessage = (locale, path) => {
  const keys = path.split('.')
  const value = keys.reduce((current, key) => current?.[key], messages[locale])
  if (value !== undefined) return value
  return keys.reduce((current, key) => current?.[key], en)
}

export const formatMessage = (template, values = {}) => (
  String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '')
)

export const getToolMessage = (locale, key) => {
  const tool = toolCatalog[key]
  return {
    ...tool,
    key,
    title: getMessage(locale, `tools.${key}.title`),
    desc: getMessage(locale, `tools.${key}.desc`)
  }
}

export const getCategoryMessage = (locale, key) => {
  const category = categoryCatalog[key]
  return {
    ...category,
    key,
    title: getMessage(locale, `categories.${key}.title`),
    desc: getMessage(locale, `categories.${key}.desc`),
    eyebrow: getMessage(locale, `categories.${key}.eyebrow`)
  }
}
