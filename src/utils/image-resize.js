export const SIZE_PRESETS = [
  { key: 'original', label: 'Original', width: 0, height: 0 },
  { key: '1080p', label: '1920 × 1080', width: 1920, height: 1080 },
  { key: '720p', label: '1280 × 720', width: 1280, height: 720 },
  { key: 'square', label: '1080 × 1080', width: 1080, height: 1080 },
  { key: 'og', label: '1200 × 630', width: 1200, height: 630 },
  { key: '800', label: '800 × 800', width: 800, height: 800 },
  { key: 'vga', label: '640 × 480', width: 640, height: 480 }
]

export const CROP_ASPECTS = [
  { key: 'free', label: 'Free', value: 0 },
  { key: '1-1', label: '1:1', value: 1 },
  { key: '4-3', label: '4:3', value: 4 / 3 },
  { key: '3-2', label: '3:2', value: 3 / 2 },
  { key: '16-9', label: '16:9', value: 16 / 9 },
  { key: '9-16', label: '9:16', value: 9 / 16 }
]

export function computeOutputSize({ sourceWidth, sourceHeight, width, height, keepAspect }) {
  const sw = Math.round(Number(sourceWidth) || 0)
  const sh = Math.round(Number(sourceHeight) || 0)
  const requestedWidth = Math.round(Number(width) || 0)
  const requestedHeight = Math.round(Number(height) || 0)

  if (sw <= 0 || sh <= 0) return { width: 0, height: 0 }
  if (requestedWidth <= 0 && requestedHeight <= 0) return { width: sw, height: sh }

  if (!keepAspect) {
    return {
      width: requestedWidth > 0 ? requestedWidth : sw,
      height: requestedHeight > 0 ? requestedHeight : sh
    }
  }

  const ratio = sw / sh
  if (requestedWidth > 0 && requestedHeight > 0) {
    const scale = Math.min(requestedWidth / sw, requestedHeight / sh)
    return {
      width: Math.max(1, Math.round(sw * scale)),
      height: Math.max(1, Math.round(sh * scale))
    }
  }

  if (requestedWidth > 0) {
    return { width: requestedWidth, height: Math.max(1, Math.round(requestedWidth / ratio)) }
  }

  return { width: Math.max(1, Math.round(requestedHeight * ratio)), height: requestedHeight }
}

export function clampCropRect({ x, y, width, height, sourceWidth, sourceHeight, aspect = 0 }) {
  const sw = Math.max(1, Math.round(Number(sourceWidth) || 1))
  const sh = Math.max(1, Math.round(Number(sourceHeight) || 1))
  let nextWidth = Math.min(Math.max(1, Number(width) || 1), sw)
  let nextHeight = Math.min(Math.max(1, Number(height) || 1), sh)

  if (aspect > 0) {
    if (nextWidth / nextHeight > aspect) nextWidth = nextHeight * aspect
    else nextHeight = nextWidth / aspect

    if (nextWidth > sw) {
      nextWidth = sw
      nextHeight = nextWidth / aspect
    }
    if (nextHeight > sh) {
      nextHeight = sh
      nextWidth = nextHeight * aspect
    }
  }

  const nextX = Math.min(Math.max(0, Number(x) || 0), sw - nextWidth)
  const nextY = Math.min(Math.max(0, Number(y) || 0), sh - nextHeight)

  return {
    x: Math.round(nextX),
    y: Math.round(nextY),
    width: Math.max(1, Math.round(nextWidth)),
    height: Math.max(1, Math.round(nextHeight))
  }
}

export function computeCenteredCrop({ sourceWidth, sourceHeight, aspect = 0 }) {
  const sw = Math.max(1, Math.round(Number(sourceWidth) || 1))
  const sh = Math.max(1, Math.round(Number(sourceHeight) || 1))

  if (!aspect) {
    return { x: 0, y: 0, width: sw, height: sh }
  }

  const sourceAspect = sw / sh
  const width = sourceAspect > aspect ? sh * aspect : sw
  const height = sourceAspect > aspect ? sh : sw / aspect

  return clampCropRect({
    x: (sw - width) / 2,
    y: (sh - height) / 2,
    width,
    height,
    sourceWidth: sw,
    sourceHeight: sh,
    aspect
  })
}

export function moveCropRect(rect, deltaX, deltaY, sourceWidth, sourceHeight, aspect = 0) {
  return clampCropRect({
    ...rect,
    x: rect.x + deltaX,
    y: rect.y + deltaY,
    sourceWidth,
    sourceHeight,
    aspect
  })
}

export function resizeCropRect(rect, handle, deltaX, deltaY, sourceWidth, sourceHeight, aspect = 0) {
  let { x, y, width, height } = rect

  if (handle.includes('w')) {
    const nextX = Math.min(x + deltaX, x + width - 1)
    width += x - nextX
    x = nextX
  }
  if (handle.includes('e')) width += deltaX
  if (handle.includes('n')) {
    const nextY = Math.min(y + deltaY, y + height - 1)
    height += y - nextY
    y = nextY
  }
  if (handle.includes('s')) height += deltaY

  if (aspect > 0) {
    if (handle === 'e' || handle === 'w') height = width / aspect
    else if (handle === 'n' || handle === 's') width = height * aspect
    else height = width / aspect

    if (handle.includes('n')) y = rect.y + rect.height - height
    if (handle.includes('w')) x = rect.x + rect.width - width
  }

  return clampCropRect({ x, y, width, height, sourceWidth, sourceHeight, aspect })
}
