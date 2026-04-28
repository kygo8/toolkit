import { readBody, setHeaders, setResponseStatus } from 'h3'

const blockedRequestHeaders = new Set([
  'host',
  'connection',
  'keep-alive',
  'transfer-encoding',
  'te',
  'trailer',
  'upgrade',
  'content-length',
  'accept-encoding',
  'cf-connecting-ip',
  'cf-ipcountry',
  'cf-ray',
  'cf-visitor',
  'x-forwarded-for',
  'x-forwarded-proto',
  'x-real-ip'
])

const blockedResponseHeaders = new Set([
  ...blockedRequestHeaders,
  'set-cookie',
  'set-cookie2'
])

const isBlockedHeader = (name, blockedSet) => {
  const lower = name.toLowerCase()
  return (
    blockedSet.has(lower) ||
    lower.startsWith(':') ||
    lower.startsWith('cf-') ||
    lower.startsWith('sec-') ||
    lower.startsWith('proxy-')
  )
}

const encodeBinary = (buffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

export default defineEventHandler(async (event) => {
  setHeaders(event, {
    'Access-Control-Allow-Origin': '*'
  })

  try {
    const body = await readBody(event)
    const { url, method, headers, body: reqBody } = body || {}

    if (!url) {
      setResponseStatus(event, 400)
      return { error: 'Missing url' }
    }

    let parsedUrl
    try {
      parsedUrl = new URL(url)
    } catch {
      setResponseStatus(event, 400)
      return { error: 'Invalid url' }
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      setResponseStatus(event, 400)
      return { error: 'Only http and https URLs are supported' }
    }

    const requestMethod = (method || 'GET').toUpperCase()
    const fetchOptions = {
      method: requestMethod,
      headers: {},
      redirect: 'follow'
    }

    if (headers && typeof headers === 'object') {
      for (const [key, value] of Object.entries(headers)) {
        if (!isBlockedHeader(key, blockedRequestHeaders) && value !== undefined && value !== null) {
          fetchOptions.headers[key] = String(value)
        }
      }
    }

    if (reqBody && requestMethod !== 'GET' && requestMethod !== 'HEAD') {
      fetchOptions.body = reqBody
    }

    const response = await fetch(parsedUrl.toString(), fetchOptions)
    const responseHeaders = {}
    response.headers.forEach((value, key) => {
      if (!isBlockedHeader(key, blockedResponseHeaders)) {
        responseHeaders[key] = value
      }
    })

    const contentType = (response.headers.get('content-type') || '').toLowerCase()
    const isBinary = ['image', 'octet-stream', 'pdf', 'zip'].some((type) => contentType.includes(type))
    const responseBody = isBinary ? encodeBinary(await response.arrayBuffer()) : await response.text()

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody
    }
  } catch (error) {
    setResponseStatus(event, 502)
    return { error: error.message }
  }
})
