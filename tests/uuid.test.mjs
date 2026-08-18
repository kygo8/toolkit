import assert from 'node:assert/strict'
import { test } from 'node:test'
import { bytesToUuid, parseUuidVersion, uuidv4, uuidv7 } from '../src/utils/uuid.js'

test('uuidv4 produces RFC variant version 4 identifiers', () => {
  const value = uuidv4()
  assert.equal(parseUuidVersion(value), 4)
  assert.match(value, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
})

test('uuidv7 embeds the millisecond timestamp and version 7', () => {
  const now = Date.UTC(2024, 0, 2, 3, 4, 5, 678)
  const random = Uint8Array.from({ length: 10 }, (_, index) => index + 1)
  const value = uuidv7(now, random)

  assert.equal(parseUuidVersion(value), 7)
  assert.match(value, /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)

  const hex = value.replace(/-/g, '')
  const timestamp = Number(BigInt(`0x${hex.slice(0, 12)}`))
  assert.equal(timestamp, now)
})

test('bytesToUuid formats 16 bytes as a hyphenated UUID', () => {
  const bytes = Uint8Array.from({ length: 16 }, (_, index) => index)
  assert.equal(bytesToUuid(bytes), '00010203-0405-0607-0809-0a0b0c0d0e0f')
})
