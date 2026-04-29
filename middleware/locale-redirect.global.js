import { navigateTo, useRequestHeaders } from '#imports'
import { getLocaleFromPath, switchLocalePath } from '~/src/i18n/paths.js'
import { defaultLocale, normalizeLocale } from '~/src/i18n/locales.js'

export default defineNuxtRouteMiddleware((to) => {
  if (getLocaleFromPath(to.path)) return

  const browserLocale = process.client
    ? navigator.languages?.[0] || navigator.language
    : useRequestHeaders(['accept-language'])['accept-language']?.split(',')[0]

  const locale = normalizeLocale(browserLocale || defaultLocale)
  return navigateTo(switchLocalePath(to.path, locale), { redirectCode: 302 })
})
