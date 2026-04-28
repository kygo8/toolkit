import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'

import { onRequestPost } from '../functions/api/proxy.js'

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

test('proxy strips forbidden transport headers before forwarding request', async () => {
  let forwarded
  globalThis.fetch = async (url, options) => {
    forwarded = { url, options }
    return new Response('ok', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  }

  const response = await onRequestPost({
    request: new Request('https://toolkit.example.com/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://api.example.com/data',
        method: 'GET',
        headers: {
          Host: 'evil.example.com',
          Connection: 'keep-alive',
          'Accept-Encoding': 'gzip, deflate, br',
          'Sec-Fetch-Site': 'same-origin',
          'Cf-Connecting-Ip': '127.0.0.1',
          Authorization: 'Bearer token',
          Accept: 'application/json'
        }
      })
    })
  })

  assert.equal(response.status, 200)
  assert.equal(forwarded.url, 'https://api.example.com/data')
  assert.deepEqual(forwarded.options.headers, {
    Authorization: 'Bearer token',
    Accept: 'application/json'
  })
})
