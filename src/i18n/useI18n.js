import { computed } from 'vue'
import { useHead, useState } from '#imports'
import { defaultLocale, localeByCode, normalizeLocale, supportedLocales } from './locales.js'
import { formatMessage, getCategoryMessage, getMessage, getToolMessage } from './messages.js'

const storageKey = 'toolx-locale'

export const useI18n = () => {
  const locale = useState('toolx-locale', () => defaultLocale)

  const currentLocale = computed(() => localeByCode[locale.value] || localeByCode[defaultLocale])
  const dir = computed(() => currentLocale.value.dir)

  const setLocale = (value) => {
    const nextLocale = normalizeLocale(value)
    locale.value = nextLocale

    if (process.client) {
      localStorage.setItem(storageKey, nextLocale)
      document.documentElement.setAttribute('lang', nextLocale)
      document.documentElement.setAttribute('dir', localeByCode[nextLocale]?.dir || 'ltr')
    }
  }

  const initLocale = () => {
    if (!process.client) return

    const savedLocale = localStorage.getItem(storageKey)
    const browserLocale = navigator.languages?.[0] || navigator.language
    setLocale(savedLocale || normalizeLocale(browserLocale))
  }

  const t = (path, values = {}) => {
    const message = getMessage(locale.value, path)
    return formatMessage(message ?? path, values)
  }

  const tool = (key) => getToolMessage(locale.value, key)
  const category = (key) => getCategoryMessage(locale.value, key)

  useHead({
    htmlAttrs: {
      lang: locale,
      dir
    }
  })

  return {
    locale,
    locales: supportedLocales,
    currentLocale,
    dir,
    setLocale,
    initLocale,
    t,
    tool,
    category
  }
}
