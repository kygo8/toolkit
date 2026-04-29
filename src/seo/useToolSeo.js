import { computed } from 'vue'
import { useRoute } from '#imports'
import { routeKeyByPath } from '../i18n/catalog.js'
import { alternateLinksForPath, getLocaleFromPath, stripLocaleFromPath, withLocalePath } from '../i18n/paths.js'
import { useI18n } from '../i18n/useI18n.js'
import { siteUrl } from './routes.js'

export const useToolSeo = (path) => {
  const route = useRoute()
  const { category, locale, tool, t } = useI18n()
  const cleanPath = computed(() => stripLocaleFromPath(path || route.path))
  const currentLocale = computed(() => getLocaleFromPath(route.path) || locale.value)
  const routeInfo = computed(() => routeKeyByPath[cleanPath.value] || routeKeyByPath['/'])
  const canonicalPath = computed(() => withLocalePath(cleanPath.value, currentLocale.value))
  const canonical = computed(() => `${siteUrl}${canonicalPath.value}`)
  const alternateLinks = computed(() => alternateLinksForPath(cleanPath.value).map((link) => ({
    ...link,
    href: `${siteUrl}${link.href}`
  })))
  const routeSeo = computed(() => {
    if (routeInfo.value.type === 'tool') {
      const toolInfo = tool(routeInfo.value.key)
      return {
        title: t('seo.toolTitle', { title: toolInfo.title }),
        description: t('seo.toolDescription', { description: toolInfo.desc })
      }
    }

    if (routeInfo.value.type === 'category') {
      const categoryInfo = category(routeInfo.value.key)
      return {
        title: t('seo.categoryTitle', { title: categoryInfo.title }),
        description: t('seo.categoryDescription', { description: categoryInfo.desc })
      }
    }

    return {
      title: t('seo.homeTitle'),
      description: t('seo.homeDescription')
    }
  })

  useSeoMeta({
    title: () => routeSeo.value.title,
    description: () => routeSeo.value.description,
    ogTitle: () => routeSeo.value.title,
    ogDescription: () => routeSeo.value.description,
    ogUrl: () => canonical.value,
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: () => routeSeo.value.title,
    twitterDescription: () => routeSeo.value.description
  })

  useHead({
    link: () => [
      { rel: 'canonical', href: canonical.value },
      ...alternateLinks.value
    ],
    script: [
      {
        type: 'application/ld+json',
        children: () => JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: routeSeo.value.title,
          description: routeSeo.value.description,
          url: canonical.value,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web'
        })
      }
    ]
  })
}
