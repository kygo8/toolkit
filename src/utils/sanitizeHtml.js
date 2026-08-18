const BLOCKED_TAGS = 'script|style|iframe|object|embed|form|link|meta|svg|math|base|textarea|input|button'

export function sanitizeHtml(html) {
  if (!html) return ''

  return String(html)
    .replace(new RegExp(`<(${BLOCKED_TAGS})(\\s[^>]*)?>[\\s\\S]*?</\\1>`, 'gi'), '')
    .replace(new RegExp(`<(${BLOCKED_TAGS})(\\s[^>]*)?/?>`, 'gi'), '')
    .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(href|src|xlink:href)\s*=\s*(['"]?)(\s*)javascript:[^'"\s>]*/gi, ' $1=$2')
    .replace(/\s+(href|src|xlink:href)\s*=\s*(['"]?)(\s*)data:[^'"\s>]*/gi, ' $1=$2')
    .replace(/\s+(href|src)\s*=\s*(['"]?)(\s*)vbscript:[^'"\s>]*/gi, ' $1=$2')
}

export function isSafeUrl(value) {
  if (!value) return false
  const trimmed = String(value).trim()
  return /^(https?:|mailto:|tel:|#|\/)/i.test(trimmed) && !ALLOWED_URL_ATTRS.test(trimmed)
}
