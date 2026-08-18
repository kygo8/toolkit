import { dump, load } from 'js-yaml'

const dumpOptions = {
  lineWidth: -1,
  noRefs: true,
  sortKeys: false
}

export const jsonToYaml = (jsonText) => {
  const data = JSON.parse(jsonText)
  return dump(data, dumpOptions).trimEnd()
}

export const yamlToJson = (yamlText, pretty = true) => {
  const data = load(yamlText)
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
}

export const formatYaml = (yamlText) => {
  const data = load(yamlText)
  return dump(data, dumpOptions).trimEnd()
}
