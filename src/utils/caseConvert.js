const ACRONYM = /([A-Z]+)([A-Z][a-z])/g
const CAMEL = /([a-z0-9])([A-Z])/g

export function splitWords(input) {
  if (input == null) return []

  return String(input)
    .replace(ACRONYM, '$1 $2')
    .replace(CAMEL, '$1 $2')
    .replace(/[_\-.]+/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase())
}

const capitalize = (word) => (word ? word[0].toUpperCase() + word.slice(1) : '')

export function toCamelCase(words) {
  return words.map((word, index) => (index === 0 ? word : capitalize(word))).join('')
}

export function toPascalCase(words) {
  return words.map(capitalize).join('')
}

export function toSnakeCase(words) {
  return words.join('_')
}

export function toKebabCase(words) {
  return words.join('-')
}

export function toConstantCase(words) {
  return words.map((word) => word.toUpperCase()).join('_')
}

export function toTitleCase(words) {
  return words.map(capitalize).join(' ')
}

export function convertAllCases(input) {
  const words = splitWords(input)
  if (words.length === 0) {
    return {
      camelCase: '',
      pascalCase: '',
      snakeCase: '',
      kebabCase: '',
      constantCase: '',
      titleCase: ''
    }
  }

  return {
    camelCase: toCamelCase(words),
    pascalCase: toPascalCase(words),
    snakeCase: toSnakeCase(words),
    kebabCase: toKebabCase(words),
    constantCase: toConstantCase(words),
    titleCase: toTitleCase(words)
  }
}
