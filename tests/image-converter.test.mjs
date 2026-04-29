import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

test('image converter supports common web image output formats', () => {
  const component = readFileSync(file('src/views/image/ImageConverter.vue'), 'utf8')

  assert.match(component, /image\/jpeg/)
  assert.match(component, /image\/png/)
  assert.match(component, /image\/webp/)
  assert.match(component, /image\/x-icon/)
  assert.match(component, /image\/svg\+xml/)
  assert.match(component, /createIcoBlob/)
  assert.match(component, /createSvgBlob/)
  assert.match(component, /\.jpg,\s*\.jpeg,\s*\.png,\s*\.webp,\s*\.ico,\s*\.svg/)
})
