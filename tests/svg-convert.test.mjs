import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { categoryCatalog, routeKeyByPath, toolCatalog } from '../src/i18n/catalog.js'
import { getToolMessage } from '../src/i18n/messages.js'
import { seoByPath } from '../src/seo/routes.js'
import { computeSvgExportSize, ensureSvgNamespace, isLikelySvg, parseSvgDimensions, wrapRasterInSvg } from '../src/utils/svg-convert.js'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

test('svg convert tool is registered in pages, catalog and SEO metadata', () => {
  assert.equal(existsSync(file('pages/image/svg.vue')), true)
  assert.equal(existsSync(file('src/views/image/SvgConvert.vue')), true)
  assert.equal(toolCatalog.svgConvert.path, '/image/svg')
  assert.equal(routeKeyByPath['/image/svg'].key, 'svgConvert')
  assert.equal(categoryCatalog.image.tools.includes('svgConvert'), true)
  assert.equal(getToolMessage('en', 'svgConvert').title, 'SVG Converter')
  assert.equal(getToolMessage('zh-CN', 'svgConvert').title, 'SVG 转换')
  assert.equal(seoByPath['/image/svg'].path, '/image/svg')
})

test('svg convert view uses canvas and Blob only', () => {
  const page = readFileSync(file('pages/image/svg.vue'), 'utf8')
  const component = readFileSync(file('src/views/image/SvgConvert.vue'), 'utf8')

  assert.match(page, /useToolSeo\('\/image\/svg'\)/)
  assert.match(component, /handleDrop/)
  assert.match(component, /wrapRasterInSvg/)
  assert.match(component, /canvasToBlob/)
  assert.match(component, /image\/png/)
  assert.doesNotMatch(component, /sharp|fabric|svg2png|canvg/)
})

test('svg helpers detect markup, read size and wrap rasters', () => {
  assert.equal(isLikelySvg('<svg viewBox="0 0 10 10"></svg>'), true)
  assert.equal(isLikelySvg('<?xml version="1.0"?><svg width="8" height="8"></svg>'), true)
  assert.equal(isLikelySvg('<div>not svg</div>'), false)

  assert.deepEqual(
    parseSvgDimensions('<svg width="320px" height="180px"></svg>'),
    { width: 320, height: 180, viewBox: null }
  )
  assert.deepEqual(
    parseSvgDimensions('<svg viewBox="0 0 24 12"></svg>'),
    { width: 24, height: 12, viewBox: { minX: 0, minY: 0, width: 24, height: 12 } }
  )

  const namespaced = ensureSvgNamespace('<svg width="2" height="2"></svg>')
  assert.match(namespaced, /xmlns="http:\/\/www.w3.org\/2000\/svg"/)
  assert.equal(ensureSvgNamespace(namespaced), namespaced)

  const wrapped = wrapRasterInSvg({ dataUrl: 'data:image/png;base64,AAA', width: 12, height: 8 })
  assert.match(wrapped, /width="12"/)
  assert.match(wrapped, /height="8"/)
  assert.match(wrapped, /<image href="data:image\/png;base64,AAA"/)

  assert.deepEqual(
    computeSvgExportSize({ width: 100, height: 50, scale: 2 }),
    { width: 200, height: 100 }
  )
  assert.deepEqual(
    computeSvgExportSize({ width: 100, height: 50, targetWidth: 80 }),
    { width: 80, height: 40 }
  )
})
