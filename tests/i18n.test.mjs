import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { routeKeyByPath } from '../src/i18n/catalog.js'
import { defaultLocale, normalizeLocale, supportedLocales } from '../src/i18n/locales.js'
import { getCategoryMessage, getMessage, getToolMessage } from '../src/i18n/messages.js'
import { alternateLinksForPath, getLocaleFromPath, stripLocaleFromPath, switchLocalePath, withLocalePath } from '../src/i18n/paths.js'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

test('i18n supports the confirmed primary language set', () => {
  const codes = supportedLocales.map((locale) => locale.code)

  assert.equal(codes.length, 24)
  assert.deepEqual(codes, [
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
  ])
})

test('default locale follows browser language and falls back to English', () => {
  assert.equal(defaultLocale, 'en')
  assert.equal(normalizeLocale('en-US'), 'en')
  assert.equal(normalizeLocale('zh-HK'), 'zh-CN')
  assert.equal(normalizeLocale('pt-BR'), 'pt')
  assert.equal(normalizeLocale('xx-YY'), 'en')
  assert.equal(normalizeLocale(), 'en')
})

test('rtl languages declare right-to-left direction', () => {
  const rtlCodes = supportedLocales
    .filter((locale) => locale.dir === 'rtl')
    .map((locale) => locale.code)

  assert.deepEqual(rtlCodes, ['ar', 'fa', 'ur'])
})

test('tool and category messages resolve with English fallback', () => {
  assert.equal(getMessage('zh-CN', 'nav.network'), '网络工具')
  assert.equal(getMessage('es', 'common.language'), 'Idioma')
  assert.equal(getMessage('ja', 'nav.home'), 'ホーム')
  assert.equal(getMessage('ar', 'nav.network'), 'الشبكة')
  assert.equal(getToolMessage('zh-CN', 'curlTest').title, 'cURL 测试')
  assert.equal(getCategoryMessage('en', 'image').title, 'Image Tools')
  assert.equal(getToolMessage('sw', 'json').title, 'JSON Formatter')
})

test('seo and app shell are connected to i18n route metadata', () => {
  const app = readFileSync(file('app.vue'), 'utf8')
  const seo = readFileSync(file('src/seo/useToolSeo.js'), 'utf8')

  assert.equal(routeKeyByPath['/network/curl/test'].key, 'curlTest')
  assert.equal(routeKeyByPath['/curl/parser'].key, 'curlTest')
  assert.match(app, /setLocale/)
  assert.match(seo, /routeKeyByPath/)
  assert.match(seo, /seo\.homeTitle/)
})

test('localized paths support indexable language-prefixed URLs', () => {
  assert.equal(getLocaleFromPath('/zh-CN/network/curl/test'), 'zh-CN')
  assert.equal(getLocaleFromPath('/network/curl/test'), null)
  assert.equal(stripLocaleFromPath('/ar/seo/sitemap'), '/seo/sitemap')
  assert.equal(stripLocaleFromPath('/en'), '/')
  assert.equal(withLocalePath('/json', 'es'), '/es/json')
  assert.equal(withLocalePath('/', 'fr'), '/fr')
  assert.equal(switchLocalePath('/zh-CN/network/domain', 'en'), '/en/network/domain')

  const alternates = alternateLinksForPath('/json')
  assert.equal(alternates.length, supportedLocales.length + 1)
  assert.deepEqual(alternates.at(-1), {
    rel: 'alternate',
    hreflang: 'x-default',
    href: '/en/json'
  })
})
