import { setHeader } from 'h3'
import { siteUrl } from '~/src/seo/routes.js'

const publicCrawlers = [
  '*',
  'Googlebot',
  'Bingbot',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'Google-Extended',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot'
]

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  return [
    '# ToolX robots.txt',
    '# Public pages are crawlable for search engines and AI answer engines.',
    ...publicCrawlers.flatMap((crawler) => [
      `User-agent: ${crawler}`,
      'Allow: /',
      'Disallow: /api/',
      'Disallow: /_nuxt/',
      ''
    ]),
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `Host: ${new URL(siteUrl).host}`,
    `# GEO: ${siteUrl}/llms.txt`
  ].join('\n')
})
