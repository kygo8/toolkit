import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { categoryCatalog, routeKeyByPath, toolCatalog } from '../src/i18n/catalog.js'
import { getToolMessage } from '../src/i18n/messages.js'
import { seoByPath } from '../src/seo/routes.js'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

const phase4Tools = [
  { key: 'cidr', path: '/network/cidr', page: 'pages/network/cidr.vue', view: 'src/views/network/CidrCalc.vue', category: 'network' },
  { key: 'userAgent', path: '/network/ua', page: 'pages/network/ua.vue', view: 'src/views/network/UserAgent.vue', category: 'network' },
  { key: 'httpHeader', path: '/network/header', page: 'pages/network/header.vue', view: 'src/views/network/HttpHeader.vue', category: 'network' },
  { key: 'qrWifi', path: '/qrcode/wifi', page: 'pages/qrcode/wifi.vue', view: 'src/views/qrcode/QrWifi.vue', category: 'qrcode' },
  { key: 'qrVcard', path: '/qrcode/vcard', page: 'pages/qrcode/vcard.vue', view: 'src/views/qrcode/QrVcard.vue', category: 'qrcode' },
  { key: 'ogPreview', path: '/seo/og', page: 'pages/seo/og.vue', view: 'src/views/seo/OgPreview.vue', category: 'seo' },
  { key: 'jsonLd', path: '/seo/json-ld', page: 'pages/seo/json-ld.vue', view: 'src/views/seo/JsonLd.vue', category: 'seo' }
]

test('phase 4 tools are wired in pages, catalog, i18n and SEO metadata', () => {
  for (const tool of phase4Tools) {
    assert.equal(existsSync(file(tool.page)), true, `${tool.page} exists`)
    assert.equal(existsSync(file(tool.view)), true, `${tool.view} exists`)
    assert.equal(toolCatalog[tool.key].path, tool.path)
    assert.equal(routeKeyByPath[tool.path].key, tool.key)
    assert.equal(categoryCatalog[tool.category].tools.includes(tool.key), true)
    assert.ok(getToolMessage('en', tool.key).title)
    assert.ok(getToolMessage('zh-CN', tool.key).title)
    assert.notEqual(getToolMessage('en', tool.key).title, getToolMessage('zh-CN', tool.key).title)
    assert.ok(seoByPath[tool.path]?.title)
  }
})
