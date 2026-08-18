import { CronExpressionParser } from 'cron-parser'
import cronstrue from 'cronstrue'
import 'cronstrue/locales/zh_CN.js'

const CRONSTRUE_LOCALES = {
  'zh-CN': 'zh_CN',
  en: 'en'
}

export function describeCron(expression, locale = 'en') {
  const value = String(expression ?? '').trim()
  if (!value) return { text: '' }

  try {
    return {
      text: cronstrue.toString(value, {
        locale: CRONSTRUE_LOCALES[locale] || 'en',
        use24HourTimeFormat: true,
        throwExceptionOnParseError: true
      })
    }
  } catch (error) {
    return { error: error.message }
  }
}

export function nextCronRuns(expression, count = 5, now = new Date()) {
  const value = String(expression ?? '').trim()
  if (!value) return { runs: [] }

  try {
    const interval = CronExpressionParser.parse(value, { currentDate: now })
    const runs = []
    for (let index = 0; index < count; index += 1) {
      runs.push(interval.next().toDate())
    }
    return { runs }
  } catch (error) {
    return { error: error.message }
  }
}
