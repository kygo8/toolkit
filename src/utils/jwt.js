import { bytesToBase64Url, decodeUtf8, utf8ToBytes, base64UrlToBytes } from './bytes.js'
import { computeHmac } from './hmac.js'

export function encodeBase64UrlJson(value) {
  return bytesToBase64Url(utf8ToBytes(JSON.stringify(value)))
}

export function decodeBase64UrlJson(segment) {
  return JSON.parse(decodeUtf8(base64UrlToBytes(segment)))
}

export function decodeJwt(token) {
  const parts = String(token ?? '').trim().split('.')
  if (parts.length !== 3 || parts.some((part) => !part)) {
    return { error: 'invalid_format' }
  }

  try {
    const header = decodeBase64UrlJson(parts[0])
    const payload = decodeBase64UrlJson(parts[1])
    const expired = typeof payload.exp === 'number' ? payload.exp * 1000 < Date.now() : null

    return {
      header,
      payload,
      signature: parts[2],
      isExpired: expired,
      issuedAt: typeof payload.iat === 'number' ? new Date(payload.iat * 1000) : null,
      expiresAt: typeof payload.exp === 'number' ? new Date(payload.exp * 1000) : null
    }
  } catch (error) {
    return { error: error.message }
  }
}

export async function signJwtHs256({ payload, secret, header = {} }) {
  const jwtHeader = { alg: 'HS256', typ: 'JWT', ...header }
  const encodedHeader = encodeBase64UrlJson(jwtHeader)
  const encodedPayload = encodeBase64UrlJson(payload)
  const signingInput = `${encodedHeader}.${encodedPayload}`
  const { bytes } = await computeHmac({
    message: signingInput,
    secret,
    algorithm: 'SHA-256'
  })
  return `${signingInput}.${bytesToBase64Url(bytes)}`
}

export async function verifyJwtHs256(token, secret) {
  const parts = String(token ?? '').trim().split('.')
  if (parts.length !== 3) return false

  const { bytes } = await computeHmac({
    message: `${parts[0]}.${parts[1]}`,
    secret,
    algorithm: 'SHA-256'
  })
  return bytesToBase64Url(bytes) === parts[2]
}
