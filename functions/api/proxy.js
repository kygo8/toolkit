export async function onRequestPost(context) {
  try {
    const body = await context.request.json()
    const { url, method, headers, body: reqBody } = body

    if (!url) {
      return new Response(JSON.stringify({ error: 'Missing url' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let targetUrl = url
    let parsedUrl
    try {
      parsedUrl = new URL(url)
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid url' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const fetchOptions = {
      method: method || 'GET',
      headers: {},
      redirect: 'follow',
    }

    const hopByHop = [
      'host', 'connection', 'keep-alive', 'transfer-encoding',
      'te', 'trailer', 'upgrade', 'content-length'
    ]

    if (headers && typeof headers === 'object') {
      for (const [k, v] of Object.entries(headers)) {
        const lower = k.toLowerCase()
        if (!hopByHop.includes(lower)) {
          fetchOptions.headers[k] = v
        }
      }
    }

    if (reqBody && method !== 'GET' && method !== 'HEAD') {
      fetchOptions.body = reqBody
    }

    const resp = await fetch(targetUrl, fetchOptions)

    const respHeaders = {}
    resp.headers.forEach((v, k) => {
      if (!hopByHop.includes(k.toLowerCase())) {
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

    return new Response(JSON.stringify({
      status: resp.status,
      statusText: resp.statusText,
      headers: respHeaders,
      body: respBody
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    })
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
