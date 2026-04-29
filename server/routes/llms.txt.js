import { setHeader } from 'h3'
import { withLocalePath } from '~/src/i18n/paths.js'
import { seoRoutes, siteUrl } from '~/src/seo/routes.js'

const featuredPaths = [
  '/',
  '/json',
  '/password',
  '/network',
  '/network/check',
  '/network/domain',
  '/network/curl/test',
  '/image',
  '/image/convert',
  '/seo',
  '/seo/sitemap',
  '/seo/robots'
]

const routeByPath = Object.fromEntries(seoRoutes.map((route) => [route.path, route]))

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  const featuredLinks = featuredPaths
    .filter((path) => routeByPath[path])
    .map((path) => `- ${routeByPath[path].title}: ${siteUrl}${withLocalePath(path, 'en')}`)

  return [
    '# ToolX',
    '',
    'ToolX is a multilingual online toolkit for developers, SEO workflows, network diagnostics, cURL testing, QR codes, image conversion, text utilities, and browser-local data transforms.',
    '',
    '## Crawl Guidance',
    '',
    '- Canonical pages use language-prefixed URLs such as /en/json and /zh-CN/json.',
    '- Multilingual alternates are declared with hreflang in page metadata and sitemap entries.',
    '- Public tool pages are safe to crawl and summarize.',
    '- API proxy endpoints are not content pages and should not be indexed.',
    '',
    '## Important URLs',
    '',
    `- Home: ${siteUrl}/en`,
    `- Sitemap: ${siteUrl}/sitemap.xml`,
    `- Robots: ${siteUrl}/robots.txt`,
    '',
    '## Featured Pages',
    '',
    ...featuredLinks
  ].join('\n')
})
