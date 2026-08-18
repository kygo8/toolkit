import { bytesToBase64, bytesToHex, utf8ToBytes } from './bytes.js'

export const HMAC_ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-512']

export async function computeHmac({ message, secret, algorithm = 'SHA-256' }) {
  if (!HMAC_ALGORITHMS.includes(algorithm)) {
    throw new Error(`Unsupported algorithm: ${algorithm}`)
  }

  const key = await crypto.subtle.importKey(
    'raw',
    utf8ToBytes(secret),
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, utf8ToBytes(message))
  const bytes = new Uint8Array(signature)

  return {
    hex: bytesToHex(bytes),
    base64: bytesToBase64(bytes),
    bytes
  }
}
