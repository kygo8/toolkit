export const commonHeaderExplanations = {
  accept: '客户端可接受的内容类型。',
  'accept-encoding': '客户端支持的压缩编码，如 gzip 或 br。',
  'accept-language': '客户端期望的响应语言。',
  authorization: 'HTTP 认证凭据，常见为 Bearer Token。',
  'cache-control': '浏览器和中间缓存的缓存策略。',
  connection: '响应后是否保持连接。',
  'content-length': '消息体的字节长度。',
  'content-type': '请求或响应体的媒体类型。',
  cookie: '客户端随请求发送的 Cookie。',
  date: '报文生成时间。',
  etag: '用于缓存协商的资源标识。',
  host: '请求的目标主机和可选端口。',
  'if-none-match': '基于 ETag 的条件请求，避免重复下载未变化内容。',
  'last-modified': '资源上次修改时间。',
  location: '重定向目标或新创建资源的 URL。',
  origin: '跨站请求的来源站点。',
  referer: '跳转到当前请求的来源页面。',
  server: '处理响应的服务端软件。',
  'set-cookie': '服务端希望客户端保存的 Cookie。',
  'strict-transport-security': '要求浏览器后续使用 HTTPS 访问。',
  'transfer-encoding': '消息体的传输编码方式，常见为 chunked。',
  'user-agent': '发起请求的浏览器、应用或客户端库。',
  vary: '影响缓存变体的请求头列表。',
  'www-authenticate': '服务端发出的认证质询。',
  'x-forwarded-for': '经过代理时的原始客户端 IP。',
  'access-control-allow-origin': '允许读取该响应的来源站点。',
  'content-security-policy': '限制页面可加载的脚本、图片等资源来源。',
  'x-content-type-options': '设为 nosniff 时可禁止 MIME 嗅探。',
  'x-frame-options': '控制页面是否允许被嵌入到 iframe。'
}

const REQUEST_LINE = /^[A-Z]+\s+\S+\s+HTTP\/\d(?:\.\d)?$/
const RESPONSE_LINE = /^HTTP\/\d(?:\.\d)?\s+\d{3}\b/

export const explainHeader = (name) => (
  commonHeaderExplanations[String(name || '').trim().toLowerCase()] || ''
)

export const parseHttpHeaders = (raw) => {
  const text = String(raw ?? '').replace(/\r\n/g, '\n')
  if (!text.trim()) {
    return { kind: '', startLine: '', status: '', headers: [] }
  }

  const lines = text.split('\n')
  let index = 0
  let startLine = ''
  let kind = ''
  let status = ''

  if (RESPONSE_LINE.test(lines[0].trim())) {
    startLine = lines[0].trim()
    kind = 'response'
    status = startLine.split(/\s+/)[1] || ''
    index = 1
  } else if (REQUEST_LINE.test(lines[0].trim())) {
    startLine = lines[0].trim()
    kind = 'request'
    index = 1
  }

  const headers = []
  for (; index < lines.length; index += 1) {
    const line = lines[index]
    if (line.trim() === '') break

    if (/^[ \t]/.test(line) && headers.length) {
      headers[headers.length - 1].value = `${headers[headers.length - 1].value} ${line.trim()}`
      continue
    }

    const separator = line.indexOf(':')
    if (separator === -1) continue

    const name = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim()
    if (!name) continue

    headers.push({
      name,
      value,
      explanation: explainHeader(name)
    })
  }

  return { kind, startLine, status, headers }
}
