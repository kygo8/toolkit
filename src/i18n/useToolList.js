import { computed } from 'vue'
import { categoryCatalog } from './catalog.js'
import { useI18n } from './useI18n.js'

export const useCategoryTools = (categoryKey) => {
  const { category, tool } = useI18n()

  const categoryInfo = computed(() => category(categoryKey))
  const tools = computed(() => (
    (categoryCatalog[categoryKey]?.tools || []).map((key) => tool(key))
  ))

  return {
    categoryInfo,
    tools
  }
}
