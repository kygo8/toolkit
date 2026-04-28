import { seoByPath, siteUrl } from './routes.js'

const normalizePath = (path) => {
  if (!path || path === '/') return '/'
  return path.endsWith('/') ? path.slice(0, -1) : path
}

export const useToolSeo = (path) => {
  const normalizedPath = normalizePath(path)
  const routeSeo = seoByPath[normalizedPath] || seoByPath['/']
  const canonical = `${siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`

  useSeoMeta({
    title: routeSeo.title,
    description: routeSeo.description,
    ogTitle: routeSeo.title,
    ogDescription: routeSeo.description,
    ogUrl: canonical,
    ogType: 'website',
    twitterCard: 'summary',
    twitterTitle: routeSeo.title,
    twitterDescription: routeSeo.description
  })

  useHead({
    link: [
      { rel: 'canonical', href: canonical }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: routeSeo.title,
          description: routeSeo.description,
          url: canonical,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web'
        })
      }
    ]
  })
}
