import assert from 'node:assert/strict'
import { test } from 'node:test'
import { computeHmac } from '../src/utils/hmac.js'
import { decodeJwt, signJwtHs256, verifyJwtHs256 } from '../src/utils/jwt.js'

test('HMAC-SHA256 matches a known test vector', async () => {
  const result = await computeHmac({
    message: 'The quick brown fox jumps over the lazy dog',
    secret: 'key',
    algorithm: 'SHA-256'
  })

  assert.equal(result.hex, 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8')
  assert.equal(result.base64, '97yD9DBThCSxMpjmqm+xQ+9NWaFJRhdZl0edvC0aPNg=')
})

test('HMAC supports SHA-1 and SHA-512 hex output', async () => {
  const sha1 = await computeHmac({ message: 'hi', secret: 'secret', algorithm: 'SHA-1' })
  const sha512 = await computeHmac({ message: 'hi', secret: 'secret', algorithm: 'SHA-512' })

  assert.equal(sha1.hex.length, 40)
  assert.equal(sha512.hex.length, 128)
})

test('JWT HS256 sign and decode round-trip a known token', async () => {
  const payload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 }
  const token = await signJwtHs256({ payload, secret: 'your-256-bit-secret' })

  assert.equal(
    token,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  )
  assert.equal(await verifyJwtHs256(token, 'your-256-bit-secret'), true)
  assert.equal(await verifyJwtHs256(token, 'wrong'), false)

  const decoded = decodeJwt(token)
  assert.equal(decoded.error, undefined)
  assert.equal(decoded.header.alg, 'HS256')
  assert.equal(decoded.payload.sub, '1234567890')
})

test('decodeJwt rejects malformed tokens', () => {
  assert.equal(decodeJwt('only.two').error, 'invalid_format')
  assert.equal(decodeJwt('aaa.bbb.ccc').error !== undefined, true)
})
