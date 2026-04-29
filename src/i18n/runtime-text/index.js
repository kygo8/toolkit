import en, { sourceAttributes, sourceText } from './en.js'
import zhCN from './zh-CN.js'
import ja from './ja.js'
import ko from './ko.js'
import es from './es.js'
import fr from './fr.js'
import de from './de.js'
import pt from './pt.js'
import ru from './ru.js'
import ar from './ar.js'
import hi from './hi.js'
import id from './id.js'
import vi from './vi.js'
import tr from './tr.js'
import it from './it.js'
import th from './th.js'
import fa from './fa.js'
import bn from './bn.js'
import ur from './ur.js'
import ta from './ta.js'
import te from './te.js'
import mr from './mr.js'
import tl from './tl.js'
import sw from './sw.js'
import { watermarkAttributeTranslations, watermarkTextTranslations } from './watermark.js'

export { default as en } from './en.js'
export { default as zhCN } from './zh-CN.js'
export { default as ja } from './ja.js'
export { default as ko } from './ko.js'
export { default as es } from './es.js'
export { default as fr } from './fr.js'
export { default as de } from './de.js'
export { default as pt } from './pt.js'
export { default as ru } from './ru.js'
export { default as ar } from './ar.js'
export { default as hi } from './hi.js'
export { default as id } from './id.js'
export { default as vi } from './vi.js'
export { default as tr } from './tr.js'
export { default as it } from './it.js'
export { default as th } from './th.js'
export { default as fa } from './fa.js'
export { default as bn } from './bn.js'
export { default as ur } from './ur.js'
export { default as ta } from './ta.js'
export { default as te } from './te.js'
export { default as mr } from './mr.js'
export { default as tl } from './tl.js'
export { default as sw } from './sw.js'

export { sourceText, sourceAttributes }

const baseRuntimeLocales = {
  en,
  'zh-CN': zhCN,
  ja,
  ko,
  es,
  fr,
  de,
  pt,
  ru,
  ar,
  hi,
  id,
  vi,
  tr,
  it,
  th,
  fa,
  bn,
  ur,
  ta,
  te,
  mr,
  tl,
  sw
}

export const runtimeLocales = Object.fromEntries(
  Object.entries(baseRuntimeLocales).map(([locale, config]) => [
    locale,
    {
      text: {
        ...(config.text || {}),
        ...(watermarkTextTranslations[locale] || {})
      },
      attributes: {
        ...(config.attributes || {}),
        ...(watermarkAttributeTranslations[locale] || {})
      }
    }
  ])
)

export const runtimeTextTranslations = Object.fromEntries(
  Object.entries(runtimeLocales).map(([locale, config]) => [locale, config.text || {}])
)

export const runtimeAttributeTranslations = Object.fromEntries(
  Object.entries(runtimeLocales).map(([locale, config]) => [locale, config.attributes || {}])
)
