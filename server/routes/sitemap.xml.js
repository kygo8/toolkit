import { setHeader } from 'h3'
import { seoRoutes, siteUrl } from '~/src/seo/routes.js'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  const urls = seoRoutes.map((route) => {
    const loc = `${siteUrl}${route.path === '/' ? '' : route.path}`
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      '    <changefreq>weekly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>'
    ].join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>'
  ].join('\n')
})
