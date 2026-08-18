import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { categoryCatalog, routeKeyByPath, toolCatalog } from '../src/i18n/catalog.js'
import { getToolMessage } from '../src/i18n/messages.js'
import { seoByPath } from '../src/seo/routes.js'
import { clampCropRect, computeCenteredCrop, computeOutputSize, moveCropRect, resizeCropRect } from '../src/utils/image-resize.js'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

test('image resize tool is registered in pages, catalog and SEO metadata', () => {
  assert.equal(existsSync(file('pages/image/resize.vue')), true)
  assert.equal(existsSync(file('src/views/image/ImageResize.vue')), true)
  assert.equal(toolCatalog.imageResize.path, '/image/resize')
  assert.equal(routeKeyByPath['/image/resize'].key, 'imageResize')
  assert.equal(categoryCatalog.image.tools.includes('imageResize'), true)
  assert.equal(getToolMessage('en', 'imageResize').title, 'Image Crop & Resize')
  assert.equal(getToolMessage('zh-CN', 'imageResize').title, '图片裁剪缩放')
  assert.equal(seoByPath['/image/resize'].path, '/image/resize')
})

test('image resize view stays local and supports crop, presets and PNG/JPG/WebP download', () => {
  const page = readFileSync(file('pages/image/resize.vue'), 'utf8')
  const component = readFileSync(file('src/views/image/ImageResize.vue'), 'utf8')

  assert.match(page, /useToolSeo\('\/image\/resize'\)/)
  assert.match(component, /keepAspect/)
  assert.match(component, /SIZE_PRESETS/)
  assert.match(component, /CROP_ASPECTS/)
  assert.match(component, /handleDrop/)
  assert.match(component, /image\/png/)
  assert.match(component, /image\/jpeg/)
  assert.match(component, /image\/webp/)
  assert.match(component, /canvasToBlob/)
  assert.doesNotMatch(component, /fetch\(|FormData|sharp|cropperjs|fabric/)
})

test('computeOutputSize keeps aspect or stretches to the requested box', () => {
  assert.deepEqual(
    computeOutputSize({ sourceWidth: 2000, sourceHeight: 1000, width: 800, height: 0, keepAspect: true }),
    { width: 800, height: 400 }
  )
  assert.deepEqual(
    computeOutputSize({ sourceWidth: 2000, sourceHeight: 1000, width: 800, height: 800, keepAspect: true }),
    { width: 800, height: 400 }
  )
  assert.deepEqual(
    computeOutputSize({ sourceWidth: 2000, sourceHeight: 1000, width: 800, height: 600, keepAspect: false }),
    { width: 800, height: 600 }
  )
  assert.deepEqual(
    computeOutputSize({ sourceWidth: 640, sourceHeight: 480, width: 0, height: 0, keepAspect: true }),
    { width: 640, height: 480 }
  )
})

test('crop helpers stay inside the image and honor locked aspect ratios', () => {
  assert.deepEqual(
    computeCenteredCrop({ sourceWidth: 1000, sourceHeight: 500, aspect: 1 }),
    { x: 250, y: 0, width: 500, height: 500 }
  )
  assert.deepEqual(
    computeCenteredCrop({ sourceWidth: 800, sourceHeight: 600, aspect: 0 }),
    { x: 0, y: 0, width: 800, height: 600 }
  )

  const clamped = clampCropRect({
    x: -20,
    y: 400,
    width: 300,
    height: 300,
    sourceWidth: 200,
    sourceHeight: 200,
    aspect: 1
  })
  assert.deepEqual(clamped, { x: 0, y: 0, width: 200, height: 200 })

  const moved = moveCropRect({ x: 10, y: 10, width: 40, height: 40 }, 1000, 1000, 100, 80, 0)
  assert.equal(moved.x + moved.width <= 100, true)
  assert.equal(moved.y + moved.height <= 80, true)

  const resized = resizeCropRect({ x: 10, y: 10, width: 40, height: 40 }, 'se', 20, 0, 200, 200, 1)
  assert.equal(resized.width, resized.height)
})
