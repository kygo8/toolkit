export const defaultLocale = 'en'

export const supportedLocales = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', dir: 'ltr' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', dir: 'rtl' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', dir: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', dir: 'ltr' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Filipino', dir: 'ltr' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', dir: 'ltr' }
]

export const supportedLocaleCodes = supportedLocales.map((locale) => locale.code)

export const localeByCode = Object.fromEntries(
  supportedLocales.map((locale) => [locale.code, locale])
)

export const isSupportedLocale = (locale) => supportedLocaleCodes.includes(locale)

const localeAliases = {
  zh: 'zh-CN',
  'zh-Hans': 'zh-CN',
  'zh-Hans-CN': 'zh-CN',
  'zh-Hant': 'zh-CN',
  'zh-HK': 'zh-CN',
  'zh-MO': 'zh-CN',
  'zh-SG': 'zh-CN',
  'zh-TW': 'zh-CN'
}

export const normalizeLocale = (value) => {
  if (!value) return defaultLocale
  const locale = String(value)
  if (isSupportedLocale(locale)) return locale
  if (localeAliases[locale]) return localeAliases[locale]
  const language = locale.split('-')[0]
  if (localeAliases[language]) return localeAliases[language]
  return isSupportedLocale(language) ? language : defaultLocale
}
