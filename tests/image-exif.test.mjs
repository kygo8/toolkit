import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { categoryCatalog, routeKeyByPath, toolCatalog } from '../src/i18n/catalog.js'
import { getToolMessage } from '../src/i18n/messages.js'
import { seoByPath } from '../src/seo/routes.js'
import { formatExifValue, groupExifFields, isJpeg, jpegHasExif, pickGps, stripJpegMetadata } from '../src/utils/image-exif.js'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

function jpegWithExif() {
  return Uint8Array.from([
    0xFF, 0xD8,
    0xFF, 0xE1, 0x00, 0x08, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00,
    0xFF, 0xDB, 0x00, 0x04, 0x00, 0x01,
    0xFF, 0xDA, 0x00, 0x08, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
    0xAA, 0xBB,
    0xFF, 0xD9
  ])
}

test('image exif tool is registered in pages, catalog and SEO metadata', () => {
  assert.equal(existsSync(file('pages/image/exif.vue')), true)
  assert.equal(existsSync(file('src/views/image/ImageExif.vue')), true)
  assert.equal(toolCatalog.imageExif.path, '/image/exif')
  assert.equal(routeKeyByPath['/image/exif'].key, 'imageExif')
  assert.equal(categoryCatalog.image.tools.includes('imageExif'), true)
  assert.equal(getToolMessage('en', 'imageExif').title, 'EXIF Viewer')
  assert.equal(getToolMessage('zh-CN', 'imageExif').title, 'EXIF 查看')
  assert.equal(seoByPath['/image/exif'].path, '/image/exif')
})

test('image exif view parses metadata locally and can export a stripped copy', () => {
  const page = readFileSync(file('pages/image/exif.vue'), 'utf8')
  const component = readFileSync(file('src/views/image/ImageExif.vue'), 'utf8')
  const pkg = JSON.parse(readFileSync(file('package.json'), 'utf8'))

  assert.match(page, /useToolSeo\('\/image\/exif'\)/)
  assert.match(component, /handleDrop/)
  assert.match(component, /exifr/)
  assert.match(component, /stripJpegMetadata/)
  assert.match(component, /Export stripped copy/)
  assert.doesNotMatch(component, /sharp|exiftool/)
  assert.equal(Boolean(pkg.dependencies.exifr), true)
})

test('jpeg metadata helpers detect and strip APP1 EXIF without touching SOS data', () => {
  const original = jpegWithExif()
  assert.equal(isJpeg(original), true)
  assert.equal(jpegHasExif(original), true)

  const stripped = stripJpegMetadata(original)
  assert.equal(isJpeg(stripped), true)
  assert.equal(jpegHasExif(stripped), false)
  assert.equal(Buffer.from(stripped).includes(Buffer.from('Exif\0\0')), false)
  assert.equal(stripped[stripped.length - 2], 0xFF)
  assert.equal(stripped[stripped.length - 1], 0xD9)
  assert.equal(stripped.includes(0xAA), true)
  assert.equal(stripped.includes(0xDB), true)
})

test('exif field grouping surfaces camera, GPS and leftover keys', () => {
  const grouped = groupExifFields({
    Make: 'Fuji',
    Model: 'X100',
    DateTimeOriginal: '2024:01:02 03:04:05',
    latitude: 31.23,
    longitude: 121.47,
    CustomNote: 'studio'
  })

  assert.deepEqual(grouped.groups.map((group) => group.key), ['camera', 'dates', 'gps'])
  assert.equal(grouped.groups[0].fields[0].value, 'Fuji')
  assert.deepEqual(grouped.extra, [{ key: 'CustomNote', value: 'studio' }])
  assert.deepEqual(pickGps({ latitude: 31.23, longitude: 121.47 }), { latitude: 31.23, longitude: 121.47 })
  assert.equal(pickGps({ Make: 'Fuji' }), null)
  assert.equal(formatExifValue(1.23456), '1.235')
})
