import { nextTick, onBeforeUnmount } from 'vue'
import {
  runtimeAttributeTranslations,
  runtimeTextTranslations,
  sourceAttributes,
  sourceText
} from './runtime-text/index.js'

const textNodeSources = new WeakMap()
const attributeSources = new WeakMap()
let observer

const targetLocale = (locale) => (locale === 'zh-CN' ? 'zh-CN' : locale || 'en')

const resolveSemanticValue = (value, sourceDictionary) => {
  const original = value.trim()
  if (!original) return ''
  return sourceDictionary[original] || original
}

const translateValue = (value, locale, sourceDictionary, localeDictionary) => {
  const original = value.trim()
  if (!original) return value
  if (locale === 'zh-CN') return value

  const semanticValue = resolveSemanticValue(original, sourceDictionary)
  const translated = localeDictionary[locale]?.[semanticValue] || localeDictionary.en?.[semanticValue] || semanticValue
  if (!translated || translated === original) return value

  return value.replace(original, translated)
}

const translateTextNode = (node, locale) => {
  if (!node.nodeValue?.trim()) return

  const source = textNodeSources.get(node) || node.nodeValue
  textNodeSources.set(node, source)

  const nextValue = translateValue(source, locale, sourceText, runtimeTextTranslations)
  if (node.nodeValue !== nextValue) {
    node.nodeValue = nextValue
  }
}

const translateAttributes = (element, locale) => {
  for (const attr of ['placeholder', 'title', 'aria-label']) {
    if (!element.hasAttribute?.(attr)) continue

    let sources = attributeSources.get(element)
    if (!sources) {
      sources = {}
      attributeSources.set(element, sources)
    }

    sources[attr] ||= element.getAttribute(attr)
    const nextValue = translateValue(sources[attr], locale, sourceAttributes, runtimeAttributeTranslations)
    if (element.getAttribute(attr) !== nextValue) {
      element.setAttribute(attr, nextValue)
    }
  }
}

const shouldSkipNode = (node) => {
  const tag = node.nodeName
  return tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT'
}

const walkAndTranslate = (root, locale) => {
  if (!root || shouldSkipNode(root)) return

  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root, locale)
    return
  }

  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return

  if (root.nodeType === Node.ELEMENT_NODE) {
    translateAttributes(root, locale)
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    }
  })

  while (walker.nextNode()) {
    const node = walker.currentNode
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, locale)
    if (node.nodeType === Node.ELEMENT_NODE) translateAttributes(node, locale)
  }
}

export const useRuntimeTextI18n = () => {
  const applyRuntimeTextI18n = async (locale) => {
    if (!process.client) return
    await nextTick()
    walkAndTranslate(document.querySelector('.main'), targetLocale(locale))
  }

  const observeRuntimeTextI18n = (localeRef) => {
    if (!process.client || observer) return

    observer = new MutationObserver(() => {
      walkAndTranslate(document.querySelector('.main'), targetLocale(localeRef.value))
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    })
  }

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = undefined
  })

  return {
    applyRuntimeTextI18n,
    observeRuntimeTextI18n
  }
}
