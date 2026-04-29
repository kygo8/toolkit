const supportedLocaleCodes = [
  'en',
  'zh-CN',
  'ja',
  'ko',
  'es',
  'fr',
  'de',
  'pt',
  'ru',
  'ar',
  'hi',
  'id',
  'vi',
  'tr',
  'it',
  'th',
  'fa',
  'bn',
  'ur',
  'ta',
  'te',
  'mr',
  'tl',
  'sw'
]

const cloneLocalizedRoute = (route, locale) => ({
  ...route,
  name: route.name ? `${locale}-${route.name}` : undefined,
  path: route.path === '/' ? `/${locale}` : `/${locale}${route.path}`,
  children: route.children?.map((child) => cloneLocalizedRoute(child, locale))
})

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2026-04-28',
  css: ['~/src/style.css'],
  nitro: {
    preset: 'cloudflare_pages'
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'theme-color', content: '#0f0f23' }
      ],
      link: [
        {
          rel: 'icon',
          href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>"
        }
      ]
    }
  },
  hooks: {
    'pages:extend'(pages) {
      const baseRoutes = [...pages]
      const localizedRoutes = supportedLocaleCodes.flatMap((locale) => (
        baseRoutes.map((route) => cloneLocalizedRoute(route, locale))
      ))

      pages.push(...localizedRoutes)
    }
  }
})
