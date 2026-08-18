import { marked } from 'marked'
import { sanitizeHtml } from './sanitizeHtml.js'

marked.setOptions({
  gfm: true,
  breaks: true
})

export function renderMarkdown(source) {
  const html = marked.parse(String(source ?? ''), { async: false })
  return sanitizeHtml(typeof html === 'string' ? html : '')
}
