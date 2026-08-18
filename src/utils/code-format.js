import beautify from 'js-beautify'

const indentOptions = (indent) => (
  indent === 'tab'
    ? { indent_size: 1, indent_char: '\t' }
    : { indent_size: Number(indent) || 2, indent_char: ' ' }
)

const beautifyApi = beautify?.js ? beautify : (beautify?.default || beautify)

export const formatJavaScript = (code, indent = 2) => beautifyApi.js(code, {
  ...indentOptions(indent),
  space_in_empty_paren: true,
  end_with_newline: false
})

export const formatCss = (code, indent = 2) => beautifyApi.css(code, {
  ...indentOptions(indent),
  end_with_newline: false
})

export const minifyCss = (cssText) => {
  const source = String(cssText || '')
  let output = ''
  let i = 0

  while (i < source.length) {
    const char = source[i]
    const next = source[i + 1]

    if (char === '/' && next === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++
      i += 2
      continue
    }

    if (char === '"' || char === "'") {
      const quote = char
      output += char
      i++
      while (i < source.length) {
        output += source[i]
        if (source[i] === '\\' && i + 1 < source.length) {
          output += source[i + 1]
          i += 2
          continue
        }
        if (source[i] === quote) {
          i++
          break
        }
        i++
      }
      continue
    }

    if (/\s/.test(char)) {
      while (i < source.length && /\s/.test(source[i])) i++
      const prev = output.at(-1)
      const upcoming = source[i]
      if (prev && upcoming && !/[{}:;,>~+]/.test(prev) && !/[{}:;,>~+]/.test(upcoming)) {
        output += ' '
      }
      continue
    }

    output += char
    i++
  }

  return output.replaceAll(';}', '}').trim()
}

export const minifyJavaScript = (jsText) => {
  const source = String(jsText || '')
  let output = ''
  let i = 0
  let prevToken = ''

  const isIdent = (char) => /[A-Za-z0-9_$]/.test(char)

  while (i < source.length) {
    const char = source[i]
    const next = source[i + 1]

    if (char === '/' && next === '/') {
      i += 2
      while (i < source.length && source[i] !== '\n') i++
      continue
    }

    if (char === '/' && next === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++
      i += 2
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      const quote = char
      output += char
      i++
      while (i < source.length) {
        const current = source[i]
        output += current
        if (current === '\\' && i + 1 < source.length) {
          output += source[i + 1]
          i += 2
          continue
        }
        if (quote === '`' && current === '$' && source[i + 1] === '{') {
          output += '{'
          i += 2
          let depth = 1
          while (i < source.length && depth > 0) {
            if (source[i] === '{') depth++
            else if (source[i] === '}') depth--
            output += source[i]
            i++
          }
          continue
        }
        if (current === quote) {
          i++
          break
        }
        i++
      }
      prevToken = quote
      continue
    }

    if (char === '/' && /[([{,;=!&|?:]/.test(prevToken || '(')) {
      output += char
      i++
      while (i < source.length) {
        output += source[i]
        if (source[i] === '\\' && i + 1 < source.length) {
          output += source[i + 1]
          i += 2
          continue
        }
        if (source[i] === '/') {
          i++
          while (i < source.length && /[gimsuy]/.test(source[i])) {
            output += source[i]
            i++
          }
          break
        }
        i++
      }
      prevToken = '/'
      continue
    }

    if (/\s/.test(char)) {
      while (i < source.length && /\s/.test(source[i])) i++
      if (isIdent(prevToken) && isIdent(source[i])) output += ' '
      continue
    }

    output += char
    prevToken = char
    i++
  }

  return output.trim()
}
