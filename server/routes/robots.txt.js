import { setHeader } from 'h3'
import { siteUrl } from '~/src/seo/routes.js'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  return [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${siteUrl}/sitemap.xml`
  ].join('\n')
})
