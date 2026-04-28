const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}

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

const jsonResponse = (body, init = {}) => {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {})
    }
  })
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json()
    const { url, method, headers, body: reqBody } = body

    if (!url) {
      return jsonResponse({ error: 'Missing url' }, { status: 400 })
    }

    let parsedUrl
    try {
      parsedUrl = new URL(url)
    } catch {
      return jsonResponse({ error: 'Invalid url' }, { status: 400 })
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return jsonResponse({ error: 'Only http and https URLs are supported' }, { status: 400 })
    }

    const requestMethod = (method || 'GET').toUpperCase()
    const fetchOptions = {
      method: requestMethod,
      headers: {},
      redirect: 'follow',
    }

    if (headers && typeof headers === 'object') {
      for (const [k, v] of Object.entries(headers)) {
        if (!isBlockedHeader(k, blockedRequestHeaders) && v !== undefined && v !== null) {
          fetchOptions.headers[k] = String(v)
        }
      }
    }

    if (reqBody && requestMethod !== 'GET' && requestMethod !== 'HEAD') {
      fetchOptions.body = reqBody
    }

    const resp = await fetch(parsedUrl.toString(), fetchOptions)

    const respHeaders = {}
    resp.headers.forEach((v, k) => {
      if (!isBlockedHeader(k, blockedResponseHeaders)) {
        respHeaders[k] = v
      }
    })

    let respBody
    const contentType = (resp.headers.get('content-type') || '').toLowerCase()
    if (contentType.includes('image') || contentType.includes('octet-stream') || contentType.includes('pdf') || contentType.includes('zip')) {
      const buf = await resp.arrayBuffer()
      respBody = btoa(String.fromCharCode(...new Uint8Array(buf)))
    } else {
      respBody = await resp.text()
    }

    return jsonResponse({
      status: resp.status,
      statusText: resp.statusText,
      headers: respHeaders,
      body: respBody
    })
  } catch (e) {
    return jsonResponse({ error: e.message }, { status: 502 })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  })
}
