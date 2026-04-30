import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

test('google analytics tag is installed globally and tracks route changes', () => {
  const config = readFileSync(file('nuxt.config.js'), 'utf8')
  const pluginPath = file('plugins/gtag.client.js')
  const plugin = readFileSync(pluginPath, 'utf8')

  assert.equal(existsSync(pluginPath), true)
  assert.match(config, /G-XMMD0ZJ1PR/)
  assert.match(config, /googletagmanager\.com\/gtag\/js\?id=\$\{googleAnalyticsId\}/)
  assert.match(config, /window\.dataLayer = window\.dataLayer \|\| \[\]/)
  assert.match(config, /gtag\('config', '\$\{googleAnalyticsId\}'\)/)
  assert.match(config, /tagPosition:\s*'head'/)
  assert.match(plugin, /router\.afterEach/)
  assert.match(plugin, /window\.gtag\('config', googleAnalyticsId/)
  assert.match(plugin, /page_path:\s*to\.fullPath/)
  assert.match(plugin, /page_location:/)
  assert.match(plugin, /page_title:\s*document\.title/)
})
