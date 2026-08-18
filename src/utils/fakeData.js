import { uuidv4 } from './uuid.js'

const FIRST_EN = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica']
const LAST_EN = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Martin']
const FIRST_ZH = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '洋', '艳', '勇', '军', '杰', '娟', '涛', '明']
const LAST_ZH = ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '吴', '周', '徐', '孙', '马', '朱']
const CITIES_EN = ['New York', 'San Francisco', 'Seattle', 'Austin', 'Chicago', 'Boston', 'London', 'Berlin']
const STREETS_EN = ['Main St', 'Oak Ave', 'Maple Rd', 'Cedar Blvd', 'Pine St', 'Lake View Dr']
const CITIES_ZH = ['台北市', '上海市', '北京市', '深圳市', '杭州市', '成都市', '广州市', '南京市']
const DISTRICTS_ZH = ['中正区', '浦东新区', '朝阳区', '南山区', '西湖区', '武侯区', '天河区', '鼓楼区']
const LOREM_EN = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua']
const LOREM_ZH = ['开发者', '工具', '可以', '快速', '生成', '测试', '数据', '用于', '接口', '调试', '表单', '填充', '以及', '原型', '展示', '无需', '安装', '额外', '依赖']

const pick = (list, random) => list[Math.floor(random() * list.length)]
const digits = (length, random) => Array.from({ length }, () => Math.floor(random() * 10)).join('')

export function createRng(seed = Math.floor(Math.random() * 1e9)) {
  let value = seed >>> 0
  return () => {
    value = (1664525 * value + 1013904223) >>> 0
    return value / 0x100000000
  }
}

export function randomName(locale = 'en', random = Math.random) {
  if (locale === 'zh-CN') return `${pick(LAST_ZH, random)}${pick(FIRST_ZH, random)}`
  return `${pick(FIRST_EN, random)} ${pick(LAST_EN, random)}`
}

export function randomEmail(locale = 'en', random = Math.random) {
  const name = randomName(locale, random)
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^\w.]/g, locale === 'zh-CN' ? `user${digits(4, random)}` : '')
  const localPart = locale === 'zh-CN' ? `user${digits(6, random)}` : name.replace(/^\.+|\.+$/g, '')
  return `${localPart}@example.com`
}

export function randomPhone(locale = 'en', random = Math.random) {
  if (locale === 'zh-CN') return `1${pick(['3', '5', '7', '8', '9'], random)}${digits(9, random)}`
  return `+1-${digits(3, random)}-${digits(3, random)}-${digits(4, random)}`
}

export function randomAddress(locale = 'en', random = Math.random) {
  if (locale === 'zh-CN') {
    return `${pick(CITIES_ZH, random)}${pick(DISTRICTS_ZH, random)}${100 + Math.floor(random() * 800)}号`
  }
  return `${100 + Math.floor(random() * 8900)} ${pick(STREETS_EN, random)}, ${pick(CITIES_EN, random)}`
}

export function randomLorem(locale = 'en', random = Math.random, words = 18) {
  const dict = locale === 'zh-CN' ? LOREM_ZH : LOREM_EN
  const sentence = Array.from({ length: words }, () => pick(dict, random))
  return locale === 'zh-CN' ? `${sentence.join('') }。` : `${sentence.join(' ')}.`
}

export function generateFakeRecord(locale = 'en', random = Math.random) {
  return {
    name: randomName(locale, random),
    email: randomEmail(locale, random),
    phone: randomPhone(locale, random),
    address: randomAddress(locale, random),
    uuid: uuidv4(),
    lorem: randomLorem(locale, random)
  }
}

export function generateFakeData({ locale = 'en', count = 5, random = Math.random } = {}) {
  return Array.from({ length: count }, () => generateFakeRecord(locale, random))
}
