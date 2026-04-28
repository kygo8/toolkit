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
  }
})
