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
  assert.match(app, /header-actions/)
  assert.doesNotMatch(app, /footer-actions/)
  assert.match(app, /toggleTheme/)
  assert.match(app, /localStorage/)
  assert.match(app, /data-theme/)
  assert.match(app, /common\.themeLight/)
  assert.match(app, /common\.themeDark/)
  assert.match(app, /language-picker/)
  assert.match(app, /recent-tools/)
  assert.match(app, /recentToolKeys/)
  assert.match(app, /toolx-recent-tools/)
  assert.match(app, /routeKeyByPath/)
  assert.match(app, /common\.recentTools/)
  assert.match(app, /header-center/)
  assert.match(app, /logo-tagline/)
  assert.match(app, /common\.toolCount/)
  assert.match(app, /changeLocale/)
  assert.match(app, /switchLocalePath/)
})

test('navigation uses a scrollable tab strip for long translated labels', () => {
  const app = readFileSync(file('app.vue'), 'utf8')

  assert.match(app, /class="nav-strip"/)
  assert.match(app, /class="nav-scroll"/)
  assert.match(app, /overflow-x:\s*auto/)
  assert.match(app, /flex:\s*0 0 auto/)
  assert.match(app, /white-space:\s*nowrap/)
  assert.doesNotMatch(app, /isMenuOpen/)
  assert.doesNotMatch(app, /toggleMenu/)
})

test('recent tool dropdown stores up to ten tools and constrains translated labels', () => {
  const app = readFileSync(file('app.vue'), 'utf8')

  assert.match(app, /class="recent-tools"/)
  assert.match(app, /\.slice\(0,\s*10\)/)
  assert.match(app, /openRecentTool/)
  assert.match(app, /router\.push\(withLocalePath\(path,\s*locale\.value\)\)/)
  assert.match(app, /:title="t\(`tools\.\$\{item\.key\}\.title`\)"/)
  assert.match(app, /\.recent-tools select\s*\{[\s\S]*max-width:\s*8\.2rem/)
  assert.doesNotMatch(app, /class="quick-link"/)
})
