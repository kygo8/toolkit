export const navItems = [
  { path: '/', key: 'home', icon: '⌂' },
  { path: '/image', key: 'image', icon: '🖼️' },
  { path: '/codec', key: 'codec', icon: '↔' },
  { path: '/dev', key: 'dev', icon: '🛠' },
  { path: '/network', key: 'network', icon: '🌐' },
  { path: '/qrcode', key: 'qrcode', icon: '📱' },
  { path: '/seo', key: 'seo', icon: '📊' },
  { path: '/other', key: 'other', icon: '✨' }
]

export const toolCatalog = {
  imageConvert: { path: '/image/convert', icon: '🖼️', color: '#38bdf8', category: 'image' },
  imageCompress: { path: '/image/compress', icon: '📉', color: '#22c55e', category: 'image' },
  imageBase64: { path: '/image/base64', icon: '🔤', color: '#f97316', category: 'image' },
  imageWatermark: { path: '/image/watermark', icon: '印', color: '#ef4444', category: 'image' },
  networkCheck: { path: '/network/check', icon: '📗', color: '#00d9ff', category: 'network' },
  domainCheck: { path: '/network/domain', icon: '🌍', color: '#10b981', category: 'network' },
  curlTest: { path: '/network/curl/test', icon: '🚀', color: '#f97316', category: 'curl' },
  curlBuilder: { path: '/network/curl/builder', icon: '🛠️', color: '#7c3aed', category: 'curl' },
  curlToCode: { path: '/network/curl/to-code', icon: '🔄', color: '#ec4899', category: 'curl' },
  base64: { path: '/codec/base64', icon: '↔', color: '#00d9ff', category: 'codec' },
  url: { path: '/codec/url', icon: '🔗', color: '#7c3aed', category: 'codec' },
  html: { path: '/codec/html', icon: '<>', color: '#10b981', category: 'codec' },
  unicode: { path: '/codec/unicode', icon: '🌐', color: '#f59e0b', category: 'codec' },
  hex: { path: '/codec/hex', icon: '🔘', color: '#ec4899', category: 'codec' },
  jwt: { path: '/codec/jwt', icon: '🔐', color: '#14b8a6', category: 'codec' },
  hash: { path: '/codec/hash', icon: '#', color: '#ef4444', category: 'codec' },
  timestamp: { path: '/dev/timestamp', icon: '🕐', color: '#00d9ff', category: 'dev' },
  color: { path: '/dev/color', icon: '🎨', color: '#7c3aed', category: 'dev' },
  regex: { path: '/dev/regex', icon: '🔍', color: '#10b981', category: 'dev' },
  numberBase: { path: '/dev/number-base', icon: '🔢', color: '#f59e0b', category: 'dev' },
  uuid: { path: '/dev/uuid', icon: '🆔', color: '#ec4899', category: 'dev' },
  textDiff: { path: '/dev/text-diff', icon: '📄', color: '#14b8a6', category: 'dev' },
  jsonYaml: { path: '/dev/json-yaml', icon: '🧾', color: '#64748b', category: 'dev' },
  jsonXml: { path: '/dev/json-xml', icon: '🧩', color: '#f97316', category: 'dev' },
  jsonCsv: { path: '/dev/json-csv', icon: '📑', color: '#22c55e', category: 'dev' },
  tomlJson: { path: '/dev/toml', icon: '📘', color: '#a78bfa', category: 'dev' },
  sqlFormat: { path: '/dev/sql', icon: '🗄️', color: '#3b82f6', category: 'dev' },
  codeFormat: { path: '/dev/code-format', icon: '💻', color: '#eab308', category: 'dev' },
  qrGenerate: { path: '/qrcode/generate', icon: '📱', color: '#00d9ff', category: 'qrcode' },
  qrDecode: { path: '/qrcode/decode', icon: '🔍', color: '#7c3aed', category: 'qrcode' },
  qrBeautify: { path: '/qrcode/beautify', icon: '🎨', color: '#ec4899', category: 'qrcode' },
  batchUrl: { path: '/seo/batch-url', icon: '🌐', color: '#8b5cf6', category: 'seo' },
  siteCrawler: { path: '/seo/site-crawler', icon: '🕷️', color: '#06b6d4', category: 'seo' },
  meta: { path: '/seo/meta', icon: '📝', color: '#00d9ff', category: 'seo' },
  keywordDensity: { path: '/seo/keyword-density', icon: '📊', color: '#7c3aed', category: 'seo' },
  sitemap: { path: '/seo/sitemap', icon: '🗺️', color: '#ec4899', category: 'seo' },
  checker404: { path: '/seo/404-checker', icon: '🔍', color: '#f43f5e', category: 'seo' },
  deadLink: { path: '/seo/dead-link', icon: '🔗', color: '#f59e0b', category: 'seo' },
  robots: { path: '/seo/robots', icon: '🤖', color: '#ef4444', category: 'seo' },
  htag: { path: '/seo/htag', icon: '#', color: '#14b8a6', category: 'seo' },
  characterCounter: { path: '/seo/character-counter', icon: '🔢', color: '#10b981', category: 'seo' },
  password: { path: '/password', icon: '🔑', color: '#7c3aed', category: 'other' },
  json: { path: '/json', icon: '{}', color: '#14b8a6', category: 'other' }
}

export const categoryCatalog = {
  image: { path: '/image', icon: '🖼️', color: '#38bdf8', tools: ['imageConvert', 'imageCompress', 'imageBase64', 'imageWatermark'] },
  network: { path: '/network', icon: '🌐', color: '#f97316', tools: ['networkCheck', 'domainCheck', 'curlTest', 'curlBuilder', 'curlToCode'] },
  codec: { path: '/codec', icon: '↔', color: '#10b981', tools: ['base64', 'url', 'html', 'unicode', 'hex', 'jwt', 'hash'] },
  dev: { path: '/dev', icon: '🛠️', color: '#00d9ff', tools: ['timestamp', 'color', 'regex', 'numberBase', 'uuid', 'textDiff', 'jsonYaml', 'jsonXml', 'jsonCsv', 'tomlJson', 'sqlFormat', 'codeFormat'] },
  qrcode: { path: '/qrcode', icon: '📱', color: '#ec4899', tools: ['qrGenerate', 'qrDecode', 'qrBeautify'] },
  seo: { path: '/seo', icon: '📊', color: '#f59e0b', tools: ['batchUrl', 'siteCrawler', 'meta', 'keywordDensity', 'sitemap', 'checker404', 'deadLink', 'robots', 'htag', 'characterCounter'] },
  other: { path: '/other', icon: '✨', color: '#a78bfa', tools: ['password', 'json'] },
  curl: { path: '/network/curl', icon: '🌐', color: '#f97316', tools: ['curlTest', 'curlToCode', 'curlBuilder'] }
}

export const featuredToolKeys = [
  'imageConvert',
  'curlTest',
  'json',
  'password',
  'imageCompress',
  'domainCheck'
]

export const routeKeyByPath = {
  '/': { type: 'home', key: 'home' },
  '/image': { type: 'category', key: 'image' },
  '/network': { type: 'category', key: 'network' },
  '/codec': { type: 'category', key: 'codec' },
  '/dev': { type: 'category', key: 'dev' },
  '/qrcode': { type: 'category', key: 'qrcode' },
  '/seo': { type: 'category', key: 'seo' },
  '/other': { type: 'category', key: 'other' },
  '/network/curl': { type: 'category', key: 'curl' },
  '/curl': { type: 'category', key: 'curl' },
  '/curl/parser': { type: 'tool', key: 'curlTest' },
  ...Object.fromEntries(
    Object.entries(toolCatalog).flatMap(([key, tool]) => {
      const entries = [[tool.path, { type: 'tool', key }]]
      if (tool.path.startsWith('/network/curl/')) {
        entries.push([tool.path.replace('/network', ''), { type: 'tool', key }])
      }
      return entries
    })
  )
}
