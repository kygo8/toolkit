export const PERM_KEYS = ['ur', 'uw', 'ux', 'gr', 'gw', 'gx', 'or', 'ow', 'ox']

export const emptyBits = () => Object.fromEntries(PERM_KEYS.map((key) => [key, false]))

export function bitsToMode(bits) {
  return PERM_KEYS.reduce((mode, key) => (mode << 1) | (bits[key] ? 1 : 0), 0)
}

export function modeToBits(mode) {
  const bits = emptyBits()
  for (let index = 0; index < PERM_KEYS.length; index += 1) {
    bits[PERM_KEYS[index]] = Boolean(mode & (1 << (8 - index)))
  }
  return bits
}

export function bitsToOctal(bits) {
  return bitsToMode(bits).toString(8).padStart(3, '0')
}

export function parseOctal(input) {
  const raw = String(input ?? '').trim()
  if (!/^[0-7]{1,4}$/.test(raw)) return null

  const mode = Number.parseInt(raw.slice(-3), 8)
  if (Number.isNaN(mode) || mode < 0 || mode > 0o777) return null
  return mode
}

export function octalToBits(input) {
  const mode = parseOctal(input)
  return mode == null ? null : modeToBits(mode)
}

export function bitsToSymbolic(bits) {
  const glyphs = 'rwxrwxrwx'
  return PERM_KEYS.map((key, index) => (bits[key] ? glyphs[index] : '-')).join('')
}

export function parseSymbolic(input) {
  const raw = String(input ?? '').trim()
  if (!/^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/.test(raw)) return null

  const bits = emptyBits()
  const glyphs = 'rwxrwxrwx'
  for (let index = 0; index < 9; index += 1) {
    const char = raw[index]
    if (char === '-') {
      bits[PERM_KEYS[index]] = false
    } else if (char === glyphs[index]) {
      bits[PERM_KEYS[index]] = true
    } else {
      return null
    }
  }
  return bits
}
