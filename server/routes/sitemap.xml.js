import { setHeader } from 'h3'
import { alternateLinksForPath, withLocalePath } from '~/src/i18n/paths.js'
import { supportedLocaleCodes } from '~/src/i18n/locales.js'
import { seoRoutes, siteUrl } from '~/src/seo/routes.js'

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
        '    <changefreq>weekly</changefreq>',
        '    <priority>0.8</priority>',
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
