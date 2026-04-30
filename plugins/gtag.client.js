const googleAnalyticsId = 'G-XMMD0ZJ1PR'

export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach((to) => {
    if (typeof window.gtag !== 'function') return

    window.gtag('config', googleAnalyticsId, {
      page_path: to.fullPath,
      page_location: `${window.location.origin}${to.fullPath}`,
      page_title: document.title
    })
  })
})
