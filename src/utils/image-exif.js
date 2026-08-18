const STANDALONE_MARKERS = new Set([0x01, 0xD0, 0xD1, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9])

export const EXIF_GROUPS = [
  { key: 'camera', label: 'Camera', keys: ['Make', 'Model', 'LensModel', 'LensMake', 'Software', 'BodySerialNumber'] },
  {
    key: 'capture',
    label: 'Capture',
    keys: ['FNumber', 'ExposureTime', 'ISO', 'ISOSpeedRatings', 'FocalLength', 'FocalLengthIn35mmFormat', 'ExposureProgram', 'MeteringMode', 'Flash', 'WhiteBalance', 'ExposureCompensation']
  },
  {
    key: 'image',
    label: 'Image',
    keys: ['ImageWidth', 'ImageHeight', 'ExifImageWidth', 'ExifImageHeight', 'Orientation', 'XResolution', 'YResolution', 'ResolutionUnit', 'ColorSpace']
  },
  { key: 'dates', label: 'Dates', keys: ['DateTimeOriginal', 'CreateDate', 'ModifyDate', 'DateTime', 'DateTimeDigitized'] },
  { key: 'gps', label: 'GPS', keys: ['latitude', 'longitude', 'Latitude', 'Longitude', 'GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSLatitudeRef', 'GPSLongitudeRef'] }
]

export function isJpeg(bytes) {
  const data = toBytes(bytes)
  return Boolean(data && data.length >= 2 && data[0] === 0xFF && data[1] === 0xD8)
}

export function jpegHasExif(bytes) {
  const data = toBytes(bytes)
  if (!isJpeg(data)) return false

  let index = 2
  while (index < data.length - 4) {
    if (data[index] !== 0xFF) {
      index += 1
      continue
    }

    const marker = data[index + 1]
    if (marker === 0xDA || marker === 0xD9) break
    if (STANDALONE_MARKERS.has(marker)) {
      index += 2
      continue
    }

    const length = readUint16(data, index + 2)
    if (length < 2) break

    if (marker === 0xE1 && hasExifSignature(data, index + 4)) return true
    index += 2 + length
  }

  return false
}

export function stripJpegMetadata(input) {
  const bytes = toBytes(input)
  if (!isJpeg(bytes)) return bytes

  const chunks = [bytes.subarray(0, 2)]
  let index = 2

  while (index < bytes.length - 1) {
    if (bytes[index] !== 0xFF) {
      chunks.push(bytes.subarray(index))
      break
    }

    let cursor = index
    while (cursor < bytes.length && bytes[cursor] === 0xFF) cursor += 1
    if (cursor >= bytes.length) break

    const marker = bytes[cursor]
    const markerStart = cursor - 1

    if (marker === 0xDA) {
      chunks.push(bytes.subarray(markerStart))
      break
    }

    if (marker === 0xD9) {
      chunks.push(bytes.subarray(markerStart, markerStart + 2))
      break
    }

    if (STANDALONE_MARKERS.has(marker)) {
      chunks.push(bytes.subarray(markerStart, markerStart + 2))
      index = markerStart + 2
      continue
    }

    if (markerStart + 3 >= bytes.length) break
    const length = readUint16(bytes, markerStart + 2)
    if (length < 2) break

    const next = markerStart + 2 + length
    const skip = (marker >= 0xE0 && marker <= 0xEF) || marker === 0xFE
    if (!skip) chunks.push(bytes.subarray(markerStart, Math.min(next, bytes.length)))
    index = next
  }

  return concatChunks(chunks)
}

export function formatExifValue(value) {
  if (value == null || value === '') return ''
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return ''
    return Number.isInteger(value) ? String(value) : String(Math.round(value * 1000) / 1000)
  }
  if (Array.isArray(value)) return value.map((item) => formatExifValue(item)).filter(Boolean).join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function groupExifFields(parsed) {
  if (!parsed || typeof parsed !== 'object') return { groups: [], extra: [] }

  const used = new Set()
  const groups = EXIF_GROUPS.map((group) => {
    const fields = group.keys
      .filter((key) => parsed[key] != null && parsed[key] !== '')
      .map((key) => {
        used.add(key)
        return { key, value: formatExifValue(parsed[key]) }
      })
    return { ...group, fields }
  }).filter((group) => group.fields.length)

  const extra = Object.entries(parsed)
    .filter(([key, value]) => !used.has(key) && value != null && value !== '' && typeof value !== 'object')
    .map(([key, value]) => ({ key, value: formatExifValue(value) }))

  return { groups, extra }
}

export function pickGps(parsed) {
  if (!parsed || typeof parsed !== 'object') return null
  const latitude = Number(parsed.latitude ?? parsed.Latitude ?? parsed.GPSLatitude)
  const longitude = Number(parsed.longitude ?? parsed.Longitude ?? parsed.GPSLongitude)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  return { latitude, longitude }
}

function toBytes(input) {
  if (input instanceof Uint8Array) return input
  if (input instanceof ArrayBuffer) return new Uint8Array(input)
  return new Uint8Array()
}

function readUint16(bytes, offset) {
  return (bytes[offset] << 8) | bytes[offset + 1]
}

function hasExifSignature(bytes, offset) {
  return bytes[offset] === 0x45
    && bytes[offset + 1] === 0x78
    && bytes[offset + 2] === 0x69
    && bytes[offset + 3] === 0x66
    && bytes[offset + 4] === 0x00
    && bytes[offset + 5] === 0x00
}

function concatChunks(chunks) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const output = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    output.set(chunk, offset)
    offset += chunk.length
  }
  return output
}
