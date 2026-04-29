import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

test('global styles define light and dark theme tokens', () => {
  const css = readFileSync(file('src/style.css'), 'utf8')

  assert.match(css, /:root/)
  assert.match(css, /\[data-theme="dark"\]/)
  assert.match(css, /\[data-theme="light"\]/)
  assert.match(css, /color-scheme:\s*dark/)
  assert.match(css, /color-scheme:\s*light/)
  assert.match(css, /--header-bg/)
})

test('app shell exposes a persistent theme toggle', () => {
  const app = readFileSync(file('app.vue'), 'utf8')

  assert.match(app, /theme-toggle/)
  assert.match(app, /toggleTheme/)
  assert.match(app, /localStorage/)
  assert.match(app, /data-theme/)
  assert.match(app, /亮色模式/)
  assert.match(app, /暗色模式/)
})
