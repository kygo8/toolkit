import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  bitsToOctal,
  bitsToSymbolic,
  emptyBits,
  octalToBits,
  parseOctal,
  parseSymbolic
} from '../src/utils/chmod.js'

test('755 maps between bits, octal and symbolic form', () => {
  const bits = octalToBits('755')
  assert.deepEqual(bits, {
    ...emptyBits(),
    ur: true, uw: true, ux: true,
    gr: true, gx: true,
    or: true, ox: true
  })
  assert.equal(bitsToOctal(bits), '755')
  assert.equal(bitsToSymbolic(bits), 'rwxr-xr-x')
  assert.deepEqual(parseSymbolic('rwxr-xr-x'), bits)
})

test('0644 and 777 convert in both directions', () => {
  assert.equal(bitsToSymbolic(octalToBits('644')), 'rw-r--r--')
  assert.equal(bitsToOctal(parseSymbolic('rwxrwxrwx')), '777')
  assert.equal(parseOctal('0644'), 0o644)
})

test('invalid octal and symbolic values are rejected', () => {
  assert.equal(parseOctal('888'), null)
  assert.equal(parseOctal('75a'), null)
  assert.equal(parseSymbolic('rwxrwxrw'), null)
  assert.equal(parseSymbolic('rwxrwxrww'), null)
  assert.equal(octalToBits('999'), null)
})
