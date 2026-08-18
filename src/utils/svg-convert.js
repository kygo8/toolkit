const SVG_TAG = /<svg[\s>]/i

export function isLikelySvg(value) {
  const text = String(value || '').trim()
  return SVG_TAG.test(text.startsWith('<?xml') ? text.slice(text.indexOf('<')) : text)
}

export function parseSvgDimensions(svgText) {
  const text = String(svgText || '')
  const openingTag = text.match(/<svg\b[^>]*>/i)?.[0] || ''
  const widthAttr = openingTag.match(/\bwidth=["']([\d.]+)(?:px)?["']/i)
  const heightAttr = openingTag.match(/\bheight=["']([\d.]+)(?:px)?["']/i)
  const viewBox = openingTag.match(/\bviewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([\d.]+)\s+([\d.]+)\s*["']/i)

  let width = widthAttr ? Number(widthAttr[1]) : 0
  let height = heightAttr ? Number(heightAttr[1]) : 0

  if ((!width || !height) && viewBox) {
    width = width || Number(viewBox[3])
    height = height || Number(viewBox[4])
  }

  return {
    width: width > 0 ? width : 0,
    height: height > 0 ? height : 0,
    viewBox: viewBox
      ? {
        minX: Number(viewBox[1]),
        minY: Number(viewBox[2]),
        width: Number(viewBox[3]),
        height: Number(viewBox[4])
      }
      : null
  }
}

export function ensureSvgNamespace(svgText) {
  const text = String(svgText || '').trim()
  if (!isLikelySvg(text)) return text
  if (/\sxmlns\s*=/.test(text)) return text
  return text.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"')
}

export function wrapRasterInSvg({ dataUrl, width, height }) {
  const safeWidth = Math.max(1, Math.round(Number(width) || 1))
  const safeHeight = Math.max(1, Math.round(Number(height) || 1))
  const href = String(dataUrl || '')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${safeWidth}" height="${safeHeight}" viewBox="0 0 ${safeWidth} ${safeHeight}"><image href="${href}" width="${safeWidth}" height="${safeHeight}" preserveAspectRatio="xMidYMid meet"/></svg>`
}

export function computeSvgExportSize({ width, height, scale = 1, targetWidth = 0 }) {
  const sourceWidth = Math.max(1, Number(width) || 1)
  const sourceHeight = Math.max(1, Number(height) || 1)
  const ratio = sourceWidth / sourceHeight

  if (targetWidth > 0) {
    return {
      width: Math.max(1, Math.round(targetWidth)),
      height: Math.max(1, Math.round(targetWidth / ratio))
    }
  }

  const nextScale = Math.max(0.1, Number(scale) || 1)
  return {
    width: Math.max(1, Math.round(sourceWidth * nextScale)),
    height: Math.max(1, Math.round(sourceHeight * nextScale))
  }
}
