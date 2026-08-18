import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { categoryCatalog, routeKeyByPath, toolCatalog } from '../src/i18n/catalog.js'
import { getToolMessage } from '../src/i18n/messages.js'
import { seoByPath } from '../src/seo/routes.js'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

const tools = [
  { key: 'caseConvert', path: '/dev/case', page: 'pages/dev/case.vue', view: 'src/views/dev/CaseConvert.vue' },
  { key: 'cron', path: '/dev/cron', page: 'pages/dev/cron.vue', view: 'src/views/dev/CronParser.vue' },
  { key: 'timezone', path: '/dev/timezone', page: 'pages/dev/timezone.vue', view: 'src/views/dev/Timezone.vue' },
  { key: 'markdown', path: '/dev/markdown', page: 'pages/dev/markdown.vue', view: 'src/views/dev/MarkdownPreview.vue' },
  { key: 'fakeData', path: '/dev/fake-data', page: 'pages/dev/fake-data.vue', view: 'src/views/dev/FakeData.vue' },
  { key: 'hmac', path: '/codec/hmac', page: 'pages/codec/hmac.vue', view: 'src/views/codec/HmacTool.vue' },
  { key: 'chmod', path: '/dev/chmod', page: 'pages/dev/chmod.vue', view: 'src/views/dev/ChmodCalc.vue' }
]

test('phase 2 tools are wired in pages, catalog, i18n and SEO', () => {
  for (const tool of tools) {
    assert.equal(existsSync(file(tool.page)), true, `${tool.page} exists`)
    assert.equal(existsSync(file(tool.view)), true, `${tool.view} exists`)
    assert.equal(toolCatalog[tool.key].path, tool.path)
    assert.equal(routeKeyByPath[tool.path].key, tool.key)
    assert.equal(Boolean(seoByPath[tool.path]), true, `${tool.path} has SEO`)
    assert.equal(getToolMessage('en', tool.key).title.length > 0, true)
    assert.equal(getToolMessage('zh-CN', tool.key).title.length > 0, true)
    assert.match(readFileSync(file(tool.page), 'utf8'), /useToolSeo\('/)
  }

  assert.equal(categoryCatalog.codec.tools.includes('hmac'), true)
  assert.equal(categoryCatalog.dev.tools.includes('caseConvert'), true)
  assert.equal(categoryCatalog.dev.tools.includes('chmod'), true)
})

test('JWT encode and UUID v7 stay on existing routes', () => {
  const jwt = readFileSync(file('src/views/codec/JwtDecoder.vue'), 'utf8')
  const uuid = readFileSync(file('src/views/dev/UuidGenerator.vue'), 'utf8')

  assert.equal(toolCatalog.jwt.path, '/codec/jwt')
  assert.equal(toolCatalog.uuid.path, '/dev/uuid')
  assert.match(jwt, /signJwtHs256/)
  assert.match(jwt, /JWT 编解码/)
  assert.match(uuid, /uuidv7/)
  assert.match(uuid, /UUID v7/)
  assert.match(getToolMessage('en', 'jwt').title, /Encode/)
  assert.match(getToolMessage('en', 'uuid').desc, /v7/)
})
