const IPV4_OCTET = /^(?:0|[1-9]\d{0,2})$/

export const parseIPv4 = (value) => {
  if (typeof value !== 'string') return null
  const parts = value.trim().split('.')
  if (parts.length !== 4) return null

  const octets = []
  for (const part of parts) {
    if (!IPV4_OCTET.test(part)) return null
    const octet = Number(part)
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null
    octets.push(octet)
  }

  return octets
}

export const ipv4ToInt = (value) => {
  const octets = Array.isArray(value) ? value : parseIPv4(value)
  if (!octets) return null
  return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
}

export const intToIPv4 = (value) => [
  (value >>> 24) & 255,
  (value >>> 16) & 255,
  (value >>> 8) & 255,
  value & 255
].join('.')

export const prefixToMask = (prefix) => {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return null
  return prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0
}

export const parseCidr = (input) => {
  const text = String(input ?? '').trim()
  const match = text.match(/^(.+?)(?:\/(\d+))?$/)
  if (!match) return null

  const octets = parseIPv4(match[1])
  if (!octets) return null

  const prefix = match[2] === undefined ? 32 : Number(match[2])
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return null

  return {
    ip: octets.join('.'),
    prefix
  }
}

export const calculateCidr = (input, prefixOverride) => {
  const parsed = typeof input === 'object' && input
    ? { ip: input.ip, prefix: input.prefix }
    : parseCidr(input)

  if (!parsed) {
    throw new Error('Invalid IPv4 or CIDR')
  }

  const prefix = prefixOverride === undefined ? parsed.prefix : Number(prefixOverride)
  const mask = prefixToMask(prefix)
  const ipInt = ipv4ToInt(parsed.ip)

  if (mask === null || ipInt === null) {
    throw new Error('Invalid IPv4 or CIDR')
  }

  const wildcard = (~mask) >>> 0
  const network = (ipInt & mask) >>> 0
  const broadcast = (network | wildcard) >>> 0
  const total = 2 ** (32 - prefix)

  let firstHost = network
  let lastHost = broadcast
  let usable = total

  if (prefix === 32) {
    usable = 1
  } else if (prefix === 31) {
    usable = 2
  } else {
    firstHost = network + 1
    lastHost = broadcast - 1
    usable = total - 2
  }

  return {
    ip: parsed.ip,
    prefix,
    cidr: `${intToIPv4(network)}/${prefix}`,
    network: intToIPv4(network),
    broadcast: intToIPv4(broadcast),
    firstHost: intToIPv4(firstHost),
    lastHost: intToIPv4(lastHost),
    hostRange: `${intToIPv4(firstHost)} - ${intToIPv4(lastHost)}`,
    mask: intToIPv4(mask),
    wildcard: intToIPv4(wildcard),
    total,
    usable
  }
}
