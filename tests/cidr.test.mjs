import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculateCidr, parseCidr } from '../src/utils/cidr.js'

test('parses IPv4 CIDR strings and defaults a bare IP to /32', () => {
  assert.deepEqual(parseCidr('192.168.1.10/24'), { ip: '192.168.1.10', prefix: 24 })
  assert.deepEqual(parseCidr('10.0.0.1'), { ip: '10.0.0.1', prefix: 32 })
  assert.equal(parseCidr('192.168.1.10/33'), null)
  assert.equal(parseCidr('192.168.1'), null)
  assert.equal(parseCidr('192.168.1.256/24'), null)
})

test('calculates network, broadcast, host range, mask, wildcard and counts', () => {
  const result = calculateCidr('192.168.1.10/24')

  assert.equal(result.cidr, '192.168.1.0/24')
  assert.equal(result.network, '192.168.1.0')
  assert.equal(result.broadcast, '192.168.1.255')
  assert.equal(result.firstHost, '192.168.1.1')
  assert.equal(result.lastHost, '192.168.1.254')
  assert.equal(result.hostRange, '192.168.1.1 - 192.168.1.254')
  assert.equal(result.mask, '255.255.255.0')
  assert.equal(result.wildcard, '0.0.0.255')
  assert.equal(result.total, 256)
  assert.equal(result.usable, 254)
})

test('handles /32, /31 and class-scale prefixes', () => {
  const host = calculateCidr('10.0.0.1/32')
  assert.equal(host.network, '10.0.0.1')
  assert.equal(host.broadcast, '10.0.0.1')
  assert.equal(host.hostRange, '10.0.0.1 - 10.0.0.1')
  assert.equal(host.usable, 1)
  assert.equal(host.total, 1)

  const pointToPoint = calculateCidr('10.0.0.0/31')
  assert.equal(pointToPoint.network, '10.0.0.0')
  assert.equal(pointToPoint.broadcast, '10.0.0.1')
  assert.equal(pointToPoint.firstHost, '10.0.0.0')
  assert.equal(pointToPoint.lastHost, '10.0.0.1')
  assert.equal(pointToPoint.usable, 2)

  const rfc1918 = calculateCidr('172.16.5.9/12')
  assert.equal(rfc1918.network, '172.16.0.0')
  assert.equal(rfc1918.broadcast, '172.31.255.255')
  assert.equal(rfc1918.mask, '255.240.0.0')
  assert.equal(rfc1918.wildcard, '0.15.255.255')
})

test('rejects invalid CIDR input', () => {
  assert.throws(() => calculateCidr('not-an-ip'), /Invalid IPv4 or CIDR/)
  assert.throws(() => calculateCidr({ ip: '1.2.3.4', prefix: 99 }), /Invalid IPv4 or CIDR/)
})
