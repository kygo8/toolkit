import { setHeader } from 'h3'
import { alternateLinksForPath, withLocalePath } from '~/src/i18n/paths.js'
import { supportedLocaleCodes } from '~/src/i18n/locales.js'
import { seoRoutes, siteUrl } from '~/src/seo/routes.js'

const lastmod = new Date().toISOString().slice(0, 10)

const priorityForRoute = (path) => {
  if (path === '/') return '1.0'
  if (path.split('/').filter(Boolean).length === 1) return '0.9'
  return '0.8'
}

const changefreqForRoute = (path) => {
  if (path === '/') return 'daily'
  if (path.split('/').filter(Boolean).length === 1) return 'weekly'
  return 'monthly'
}

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  const urls = seoRoutes.flatMap((route) => (
    supportedLocaleCodes.map((locale) => {
      const loc = `${siteUrl}${withLocalePath(route.path, locale)}`
      const alternates = alternateLinksForPath(route.path).map((link) => (
        `    <xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${siteUrl}${link.href}" />`
      ))

      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        ...alternates,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreqForRoute(route.path)}</changefreq>`,
        `    <priority>${priorityForRoute(route.path)}</priority>`,
        '  </url>'
      ].join('\n')
    })
  ))

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>'
  ].join('\n')
})
