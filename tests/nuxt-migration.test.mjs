import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { test } from 'node:test'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

const expectedPages = [
  'pages/index.vue',
  'pages/password.vue',
  'pages/json.vue',
  'pages/codec/index.vue',
  'pages/codec/base64.vue',
  'pages/codec/url.vue',
  'pages/codec/html.vue',
  'pages/codec/unicode.vue',
  'pages/codec/hex.vue',
  'pages/codec/jwt.vue',
  'pages/codec/hash.vue',
  'pages/dev/index.vue',
  'pages/dev/timestamp.vue',
  'pages/dev/color.vue',
  'pages/dev/regex.vue',
  'pages/dev/number-base.vue',
  'pages/dev/uuid.vue',
  'pages/dev/text-diff.vue',
  'pages/qrcode/index.vue',
  'pages/qrcode/generate.vue',
  'pages/qrcode/decode.vue',
  'pages/qrcode/beautify.vue',
  'pages/curl/index.vue',
  'pages/curl/to-code.vue',
  'pages/curl/builder.vue',
  'pages/curl/parser.vue',
  'pages/seo/index.vue',
  'pages/seo/meta.vue',
  'pages/seo/keyword-density.vue',
  'pages/seo/character-counter.vue',
  'pages/seo/dead-link.vue',
  'pages/seo/robots.vue',
  'pages/seo/sitemap.vue',
  'pages/seo/htag.vue',
  'pages/seo/batch-url.vue',
  'pages/seo/404-checker.vue',
  'pages/seo/site-crawler.vue'
]

test('Nuxt migration provides Cloudflare-ready app files', () => {
  assert.equal(existsSync(file('nuxt.config.js')), true)
  assert.equal(existsSync(file('app.vue')), true)
  assert.equal(existsSync(file('server', 'api', 'proxy.post.js')), true)

  const config = readFileSync(file('nuxt.config.js'), 'utf8')
  assert.match(config, /preset:\s*['"]cloudflare_pages['"]/)
  assert.match(config, /src\/style\.css/)
})

test('all legacy Vue Router routes have Nuxt page files', () => {
  const missing = expectedPages.filter((page) => !existsSync(file(page)))
  assert.deepEqual(missing, [])
})

test('SEO route metadata covers every Nuxt page', async () => {
  assert.equal(existsSync(file('src', 'seo', 'routes.js')), true)
  const { seoRoutes } = await import(pathToFileURL(file('src', 'seo', 'routes.js')))
  const paths = new Set(seoRoutes.map((route) => route.path))

  for (const route of seoRoutes) {
    assert.ok(route.title, `${route.path} is missing a title`)
    assert.ok(route.description, `${route.path} is missing a description`)
  }

  const expectedPaths = expectedPages.map((page) => {
    const route = page
      .replace(/^pages/, '')
      .replace(/\/index\.vue$/, '/')
      .replace(/\.vue$/, '')
    if (route === '/index' || route === '/') return '/'
    return route.endsWith('/') ? route.slice(0, -1) : route
  })

  assert.deepEqual([...paths].sort(), expectedPaths.sort())
})
