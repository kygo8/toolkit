import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { categoryCatalog, routeKeyByPath, toolCatalog } from '../src/i18n/catalog.js'
import { getToolMessage } from '../src/i18n/messages.js'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

test('image watermark tool is registered in pages, catalog and SEO metadata', () => {
  assert.equal(existsSync(file('pages/image/watermark.vue')), true)
  assert.equal(toolCatalog.imageWatermark.path, '/image/watermark')
  assert.equal(routeKeyByPath['/image/watermark'].key, 'imageWatermark')
  assert.equal(categoryCatalog.image.tools.includes('imageWatermark'), true)
  assert.equal(getToolMessage('en', 'imageWatermark').title, 'Image Watermark')
})

test('image watermark supports text, image, stamp, tiled, position and opacity controls', () => {
  const component = readFileSync(file('src/views/image/ImageWatermark.vue'), 'utf8')
  const runtimeI18n = readFileSync(file('src/i18n/useRuntimeTextI18n.js'), 'utf8')
  const watermarkI18n = readFileSync(file('src/i18n/runtime-text/watermark.js'), 'utf8')

  assert.match(component, /watermarkType/)
  assert.match(component, /Text watermark/)
  assert.match(component, /Image watermark/)
  assert.match(component, /circle-stamp/)
  assert.match(component, /square-stamp/)
  assert.match(component, /tiled/)
  assert.match(component, /positionOptions/)
  assert.match(component, /opacity/)
  assert.match(component, /rotation/)
  assert.match(component, /drawImageWatermark/)
  assert.match(component, /drawTextWatermark/)
  assert.match(component, /canvasToBlob/)
  assert.match(runtimeI18n, /'alt'/)
  assert.match(watermarkI18n, /图片水印/)
  assert.match(watermarkI18n, /画像ウォーターマーク/)
  assert.match(watermarkI18n, /Thêm watermark ảnh/)
  assert.match(watermarkI18n, /Base image preview/)
})
