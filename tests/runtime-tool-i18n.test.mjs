import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

test('app applies runtime i18n to hard-coded tool page text', () => {
  const app = readFileSync(file('app.vue'), 'utf8')

  assert.match(app, /useRuntimeTextI18n/)
  assert.match(app, /applyRuntimeTextI18n/)
  assert.match(app, /watch\(\[locale,\s*\(\) => route\.path\]/)
})

test('runtime tool text dictionary covers common tool page labels and attributes', () => {
  const runtimeI18n = readFileSync(file('src/i18n/useRuntimeTextI18n.js'), 'utf8')
  const runtimeIndex = readFileSync(file('src/i18n/runtime-text/index.js'), 'utf8')
  const en = readFileSync(file('src/i18n/runtime-text/en.js'), 'utf8')
  const es = readFileSync(file('src/i18n/runtime-text/es.js'), 'utf8')
  const fr = readFileSync(file('src/i18n/runtime-text/fr.js'), 'utf8')
  const de = readFileSync(file('src/i18n/runtime-text/de.js'), 'utf8')
  const fa = readFileSync(file('src/i18n/runtime-text/fa.js'), 'utf8')

  assert.match(runtimeI18n, /runtimeTextTranslations/)
  assert.match(runtimeI18n, /runtimeAttributeTranslations/)
  assert.match(runtimeIndex, /runtimeLocales/)
  assert.match(en, /Base64 Encode\/Decode/)
  assert.match(es, /Copiar/)
  assert.match(fr, /Effacer/)
  assert.match(de, /Generieren/)
  assert.match(es, /Entrada/)
  assert.match(fa, /خروجی/)
  assert.match(runtimeI18n, /placeholder/)
  assert.match(runtimeI18n, /MutationObserver/)
})

test('runtime tool text has separate files for every supported locale', () => {
  const locales = [
    'en',
    'zh-CN',
    'ja',
    'ko',
    'es',
    'fr',
    'de',
    'pt',
    'ru',
    'ar',
    'hi',
    'id',
    'vi',
    'tr',
    'it',
    'th',
    'fa',
    'bn',
    'ur',
    'ta',
    'te',
    'mr',
    'tl',
    'sw'
  ]

  for (const locale of locales) {
    assert.equal(existsSync(file('src/i18n/runtime-text', `${locale}.js`)), true, `${locale}.js exists`)
  }

  const runtimeIndex = readFileSync(file('src/i18n/runtime-text/index.js'), 'utf8')
  for (const locale of locales) {
    const exportName = locale.replace(/-/g, '')
    assert.match(runtimeIndex, new RegExp(`as ${exportName}`))
  }
})
