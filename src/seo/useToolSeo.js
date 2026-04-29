import { computed } from 'vue'
import { routeKeyByPath } from '../i18n/catalog.js'
import { useI18n } from '../i18n/useI18n.js'
import { siteUrl } from './routes.js'

const normalizePath = (path) => {
  if (!path || path === '/') return '/'
  return path.endsWith('/') ? path.slice(0, -1) : path
}

export const useToolSeo = (path) => {
  const { category, tool, t } = useI18n()
  const normalizedPath = normalizePath(path)
  const routeInfo = routeKeyByPath[normalizedPath] || routeKeyByPath['/']
  const canonical = `${siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`
  const routeSeo = computed(() => {
    if (routeInfo.type === 'tool') {
      const toolInfo = tool(routeInfo.key)
      return {
        title: t('seo.toolTitle', { title: toolInfo.title }),
        description: t('seo.toolDescription', { description: toolInfo.desc })
      }
    }

    if (routeInfo.type === 'category') {
      const categoryInfo = category(routeInfo.key)
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
    ogUrl: canonical,
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: () => routeSeo.value.title,
    twitterDescription: () => routeSeo.value.description
  })

  useHead({
    link: [
      { rel: 'canonical', href: canonical }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: () => JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: routeSeo.value.title,
          description: routeSeo.value.description,
          url: canonical,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web'
        })
      }
    ]
  })
}
