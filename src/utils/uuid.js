const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-8])[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function getRandomBytes(length) {
  const bytes = new Uint8Array(length)
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('crypto.getRandomValues is not available')
  }
  globalThis.crypto.getRandomValues(bytes)
  return bytes
}

export function bytesToUuid(bytes) {
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-')
}

export function uuidv4() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()

  const bytes = getRandomBytes(16)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  return bytesToUuid(bytes)
}

export function uuidv7(now = Date.now(), randomBytes = getRandomBytes(10)) {
  const bytes = new Uint8Array(16)
  let timestamp = BigInt(now)

  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = Number(timestamp & 0xffn)
    timestamp >>= 8n
  }

  bytes.set(randomBytes.subarray(0, 10), 6)
  bytes[6] = (bytes[6] & 0x0f) | 0x70
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  return bytesToUuid(bytes)
}

export function parseUuidVersion(uuid) {
  const match = String(uuid).match(UUID_RE)
  return match ? Number(match[1]) : null
}
