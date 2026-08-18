import { parse, stringify } from 'smol-toml'

const assertTomlRoot = (data) => {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('TOML root must be an object')
  }
  return data
}

export const jsonToToml = (jsonText) => {
  const data = assertTomlRoot(JSON.parse(jsonText))
  return stringify(data).trimEnd()
}

export const tomlToJson = (tomlText, pretty = true) => {
  const data = parse(tomlText)
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
}

export const formatToml = (tomlText) => stringify(parse(tomlText)).trimEnd()
