const NAME_RE = /^[A-Za-z_][\w.\-]*$/

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

const unescapeXml = (value) => String(value)
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&apos;', "'")
  .replaceAll('&amp;', '&')

export const toXmlName = (name) => {
  let next = String(name)
  if (NAME_RE.test(next) && !next.toLowerCase().startsWith('xml')) return next
  next = next.replace(/[^A-Za-z0-9_.\-]/g, '_')
  if (!/^[A-Za-z_]/.test(next)) next = `_${next}`
  if (next.toLowerCase().startsWith('xml')) next = `_${next}`
  return next || 'item'
}

const coerceScalar = (text) => {
  const value = text.trim()
  if (value === '') return ''
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null') return null
  if (/^-?\d+$/.test(value)) {
    const parsed = Number(value)
    if (Number.isSafeInteger(parsed)) return parsed
  }
  if (/^-?\d+\.\d+$/.test(value)) {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) return parsed
  }
  return text
}

const skipWhitespace = (source, index) => {
  while (index < source.length && /\s/.test(source[index])) index++
  return index
}

const readName = (source, index) => {
  const start = index
  while (index < source.length && /[:A-Za-z0-9_.\-]/.test(source[index])) index++
  if (start === index) throw new Error(`Invalid XML name at position ${start}`)
  return [source.slice(start, index), index]
}

const readQuoted = (source, index) => {
  const quote = source[index]
  if (quote !== '"' && quote !== "'") {
    throw new Error(`Expected quoted attribute value at position ${index}`)
  }
  index++
  let value = ''
  while (index < source.length && source[index] !== quote) {
    value += source[index]
    index++
  }
  if (source[index] !== quote) throw new Error('Unclosed attribute value')
  return [unescapeXml(value), index + 1]
}

const parseAttributes = (source, index) => {
  const attrs = {}
  while (index < source.length) {
    index = skipWhitespace(source, index)
    if (source[index] === '/' || source[index] === '>') break
    const [name, nextIndex] = readName(source, index)
    index = skipWhitespace(source, nextIndex)
    if (source[index] !== '=') throw new Error(`Missing = for attribute ${name}`)
    const [value, afterValue] = readQuoted(source, skipWhitespace(source, index + 1))
    attrs[name] = value
    index = afterValue
  }
  return [attrs, index]
}

const parseNode = (source, index) => {
  index = skipWhitespace(source, index)
  if (source[index] !== '<') throw new Error(`Expected < at position ${index}`)
  index++

  if (source.startsWith('!--', index)) {
    const end = source.indexOf('-->', index + 3)
    if (end === -1) throw new Error('Unclosed XML comment')
    return parseNode(source, end + 3)
  }

  if (source[index] === '/') throw new Error(`Unexpected closing tag at position ${index}`)

  const [name, afterName] = readName(source, index)
  const [attrs, afterAttrs] = parseAttributes(source, afterName)
  index = afterAttrs

  if (source.startsWith('/>', index)) {
    return [{ name, attrs, children: [] }, index + 2]
  }

  if (source[index] !== '>') throw new Error(`Expected > after <${name}>`)
  index++

  const children = []
  while (index < source.length) {
    if (source.startsWith('</', index)) {
      const [closeName, afterCloseName] = readName(source, index + 2)
      index = skipWhitespace(source, afterCloseName)
      if (source[index] !== '>') throw new Error(`Expected > after </${closeName}>`)
      if (closeName !== name) throw new Error(`Mismatched XML tag: <${name}> closed by </${closeName}>`)
      return [{ name, attrs, children }, index + 1]
    }

    if (source.startsWith('<![CDATA[', index)) {
      const end = source.indexOf(']]>', index + 9)
      if (end === -1) throw new Error('Unclosed CDATA section')
      children.push({ type: 'text', value: source.slice(index + 9, end) })
      index = end + 3
      continue
    }

    if (source.startsWith('<!--', index)) {
      const end = source.indexOf('-->', index + 4)
      if (end === -1) throw new Error('Unclosed XML comment')
      index = end + 3
      continue
    }

    if (source[index] === '<') {
      const [child, nextIndex] = parseNode(source, index)
      children.push(child)
      index = nextIndex
      continue
    }

    const nextTag = source.indexOf('<', index)
    const end = nextTag === -1 ? source.length : nextTag
    const text = unescapeXml(source.slice(index, end))
    if (text.trim()) children.push({ type: 'text', value: text })
    index = end
  }

  throw new Error(`Unclosed XML tag <${name}>`)
}

const skipProlog = (source) => {
  let index = skipWhitespace(source, 0)
  while (index < source.length) {
    if (source.startsWith('<?', index)) {
      const end = source.indexOf('?>', index + 2)
      if (end === -1) throw new Error('Unclosed XML declaration')
      index = skipWhitespace(source, end + 2)
      continue
    }
    if (source.startsWith('<!DOCTYPE', index) || source.startsWith('<!doctype', index)) {
      const end = source.indexOf('>', index)
      if (end === -1) throw new Error('Unclosed DOCTYPE')
      index = skipWhitespace(source, end + 1)
      continue
    }
    if (source.startsWith('<!--', index)) {
      const end = source.indexOf('-->', index + 4)
      if (end === -1) throw new Error('Unclosed XML comment')
      index = skipWhitespace(source, end + 3)
      continue
    }
    break
  }
  return index
}

export const parseXml = (text) => {
  const source = String(text || '').replace(/^\uFEFF/, '')
  if (!source.trim()) throw new Error('XML is empty')
  const [node, index] = parseNode(source, skipProlog(source))
  if (skipWhitespace(source, index) !== source.length) {
    throw new Error('XML must have a single root element')
  }
  return node
}

const nodeToValue = (node) => {
  const texts = node.children.filter((child) => child.type === 'text').map((child) => child.value)
  const elements = node.children.filter((child) => child.type !== 'text')
  const attrEntries = Object.entries(node.attrs).map(([key, value]) => [`@${key}`, value])

  if (!elements.length) {
    const text = texts.join('')
    if (!attrEntries.length) return coerceScalar(text)
    const result = Object.fromEntries(attrEntries)
    if (text.trim()) result['#text'] = coerceScalar(text)
    return result
  }

  const result = Object.fromEntries(attrEntries)
  for (const child of elements) {
    const value = nodeToValue(child)
    if (Object.prototype.hasOwnProperty.call(result, child.name)) {
      const current = result[child.name]
      result[child.name] = Array.isArray(current) ? [...current, value] : [current, value]
    } else {
      result[child.name] = value
    }
  }

  const leftover = texts.join('').trim()
  if (leftover) result['#text'] = coerceScalar(leftover)
  return result
}

export const xmlToJsonValue = (text) => {
  const root = parseXml(text)
  const value = nodeToValue(root)

  if (root.name === 'root') {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const keys = Object.keys(value).filter((key) => !key.startsWith('@'))
      if (keys.length === 1 && keys[0] === 'item') {
        return Array.isArray(value.item) ? value.item : [value.item]
      }
    }
    return value
  }

  return { [root.name]: value }
}

const valueToNodes = (value, name) => {
  const tag = toXmlName(name)

  if (value === null || value === undefined) {
    return [{ name: tag, attrs: {}, children: [] }]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => valueToNodes(item, name))
  }

  if (typeof value !== 'object') {
    return [{ name: tag, attrs: {}, children: [{ type: 'text', value: String(value) }] }]
  }

  const attrs = {}
  const children = []

  for (const [key, child] of Object.entries(value)) {
    if (key === '#text') {
      if (child != null && String(child) !== '') {
        children.push({ type: 'text', value: String(child) })
      }
      continue
    }
    if (key.startsWith('@')) {
      attrs[toXmlName(key.slice(1))] = String(child ?? '')
      continue
    }
    children.push(...valueToNodes(child, key))
  }

  return [{ name: tag, attrs, children }]
}

const serializeNode = (node, indent, depth) => {
  const pad = indent > 0 ? ' '.repeat(indent * depth) : ''
  const newline = indent > 0 ? '\n' : ''
  const attrText = Object.entries(node.attrs)
    .map(([key, value]) => ` ${key}="${escapeXml(value)}"`)
    .join('')

  if (!node.children.length) {
    return `${pad}<${node.name}${attrText}/>`
  }

  const onlyText = node.children.length === 1 && node.children[0].type === 'text'
  if (onlyText) {
    return `${pad}<${node.name}${attrText}>${escapeXml(node.children[0].value)}</${node.name}>`
  }

  const inner = node.children.map((child) => (
    child.type === 'text'
      ? `${indent > 0 ? ' '.repeat(indent * (depth + 1)) : ''}${escapeXml(child.value)}`
      : serializeNode(child, indent, depth + 1)
  )).join(newline)

  return `${pad}<${node.name}${attrText}>${newline}${inner}${newline}${pad}</${node.name}>`
}

export const serializeXml = (node, indent = 2) => serializeNode(node, indent, 0)

export const jsonToXml = (jsonText, indent = 2) => {
  const data = JSON.parse(jsonText)
  const [root] = Array.isArray(data)
    ? [{ name: 'root', attrs: {}, children: valueToNodes(data, 'item') }]
    : valueToNodes(data, 'root')
  return serializeXml(root, indent)
}

export const xmlToJson = (xmlText, pretty = true) => {
  const value = xmlToJsonValue(xmlText)
  return pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value)
}

export const formatXml = (xmlText, indent = 2) => serializeXml(parseXml(xmlText), indent)

export const minifyXml = (xmlText) => serializeXml(parseXml(xmlText), 0)
