import { defaultLocale, isSupportedLocale, normalizeLocale, supportedLocaleCodes } from './locales.js'

export const normalizePath = (path) => {
  if (!path || path === '/') return '/'
  const normalized = String(path).split('?')[0].split('#')[0]
  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized
}

export const getLocaleFromPath = (path) => {
  const segment = normalizePath(path).split('/').filter(Boolean)[0]
  return isSupportedLocale(segment) ? segment : null
}

export const stripLocaleFromPath = (path) => {
  const normalizedPath = normalizePath(path)
  const locale = getLocaleFromPath(normalizedPath)
  if (!locale) return normalizedPath

  const withoutLocale = normalizedPath.slice(locale.length + 1)
  return withoutLocale || '/'
}

export const withLocalePath = (path, locale = defaultLocale) => {
  const normalizedLocale = normalizeLocale(locale)
  const cleanPath = stripLocaleFromPath(path)
  return cleanPath === '/' ? `/${normalizedLocale}` : `/${normalizedLocale}${cleanPath}`
}

export const switchLocalePath = (path, locale) => withLocalePath(stripLocaleFromPath(path), locale)

export const alternateLinksForPath = (path) => {
  const cleanPath = stripLocaleFromPath(path)
  return [
    ...supportedLocaleCodes.map((locale) => ({
      rel: 'alternate',
      hreflang: locale,
      href: withLocalePath(cleanPath, locale)
    })),
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: withLocalePath(cleanPath, defaultLocale)
    }
  ]
}
