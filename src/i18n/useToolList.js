import { computed } from 'vue'
import { categoryCatalog } from './catalog.js'
import { withLocalePath } from './paths.js'
import { useI18n } from './useI18n.js'

export const useCategoryTools = (categoryKey) => {
  const { category, locale, tool } = useI18n()

  const categoryInfo = computed(() => {
    const info = category(categoryKey)
    return {
      ...info,
      path: withLocalePath(info.path, locale.value)
    }
  })
  const tools = computed(() => (
    (categoryCatalog[categoryKey]?.tools || []).map((key) => {
      const info = tool(key)
      return {
        ...info,
        path: withLocalePath(info.path, locale.value)
      }
    })
  ))

  return {
    categoryInfo,
    tools
  }
}
