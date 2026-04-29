import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

test('robots.txt advertises search and GEO discovery endpoints', () => {
  const robots = readFileSync(file('server/routes/robots.txt.js'), 'utf8')

  assert.match(robots, /Sitemap:/)
  assert.match(robots, /llms\.txt/)
  assert.match(robots, /GPTBot/)
  assert.match(robots, /Google-Extended/)
  assert.match(robots, /ClaudeBot/)
  assert.match(robots, /PerplexityBot/)
  assert.match(robots, /Disallow:\s*\/api\//)
})

test('sitemap.xml emits multilingual indexable URLs with alternates and freshness', () => {
  const sitemap = readFileSync(file('server/routes/sitemap.xml.js'), 'utf8')

  assert.match(sitemap, /supportedLocaleCodes/)
  assert.match(sitemap, /alternateLinksForPath/)
  assert.match(sitemap, /<xhtml:link rel="alternate"/)
  assert.match(sitemap, /<lastmod>\$\{lastmod\}<\/lastmod>/)
  assert.match(sitemap, /priorityForRoute/)
  assert.match(sitemap, /changefreqForRoute/)
})

test('llms.txt gives AI answer engines a concise crawl guide', () => {
  const llms = readFileSync(file('server/routes/llms.txt.js'), 'utf8')

  assert.match(llms, /ToolX/)
  assert.match(llms, /Sitemap/)
  assert.match(llms, /Robots/)
  assert.match(llms, /canonical/i)
  assert.match(llms, /multilingual/i)
  assert.match(llms, /\/network\/curl\/test/)
  assert.match(llms, /withLocalePath\(path,\s*'en'\)/)
})
