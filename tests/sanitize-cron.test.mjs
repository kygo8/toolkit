import assert from 'node:assert/strict'
import { test } from 'node:test'
import { describeCron, nextCronRuns } from '../src/utils/cron.js'
import { generateFakeData, createRng } from '../src/utils/fakeData.js'
import { sanitizeHtml } from '../src/utils/sanitizeHtml.js'

test('sanitizeHtml strips scripts and javascript URLs', () => {
  const dirty = '<p>ok</p><script>alert(1)</script><a href="javascript:alert(1)">x</a><img src="data:text/html,hi">'
  const clean = sanitizeHtml(dirty)
  assert.match(clean, /<p>ok<\/p>/)
  assert.doesNotMatch(clean, /script/i)
  assert.doesNotMatch(clean, /javascript:/i)
  assert.doesNotMatch(clean, /data:/i)
})

test('cron parser describes expressions and returns future dates', () => {
  const described = describeCron('*/5 * * * *')
  assert.equal(Boolean(described.error), false)
  assert.match(described.text, /5/)

  const now = new Date('2024-01-01T00:00:00.000Z')
  const { runs, error } = nextCronRuns('0 * * * *', 3, now)
  assert.equal(error, undefined)
  assert.equal(runs.length, 3)
  assert.equal(runs[0] > now, true)
  assert.equal(runs[1] > runs[0], true)
})

test('fake data generator is locale-aware and deterministic with a seed', () => {
  const zh = generateFakeData({ locale: 'zh-CN', count: 2, random: createRng(42) })
  const en = generateFakeData({ locale: 'en', count: 2, random: createRng(42) })

  assert.equal(zh.length, 2)
  assert.match(zh[0].phone, /^1\d{10}$/)
  assert.match(en[0].email, /@example\.com$/)
  assert.notEqual(zh[0].name, en[0].name)
})
