import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { categoryCatalog, routeKeyByPath, toolCatalog } from '../src/i18n/catalog.js'
import { getToolMessage } from '../src/i18n/messages.js'
import { seoByPath } from '../src/seo/routes.js'
import { formatCss, formatJavaScript, minifyCss, minifyJavaScript } from '../src/utils/code-format.js'
import { csvToJson, jsonToCsv, parseCsv } from '../src/utils/csv.js'
import { formatSql, minifySql } from '../src/utils/sql-format.js'
import { jsonToToml, tomlToJson } from '../src/utils/toml-json.js'
import { jsonToXml, xmlToJson } from '../src/utils/xml.js'
import { jsonToYaml, yamlToJson } from '../src/utils/yaml-json.js'

const root = process.cwd()
const file = (...parts) => join(root, ...parts)

const phase1Tools = [
  { key: 'jsonYaml', path: '/dev/json-yaml', page: 'pages/dev/json-yaml.vue', view: 'src/views/dev/JsonYaml.vue' },
  { key: 'jsonXml', path: '/dev/json-xml', page: 'pages/dev/json-xml.vue', view: 'src/views/dev/JsonXml.vue' },
  { key: 'jsonCsv', path: '/dev/json-csv', page: 'pages/dev/json-csv.vue', view: 'src/views/dev/JsonCsv.vue' },
  { key: 'tomlJson', path: '/dev/toml', page: 'pages/dev/toml.vue', view: 'src/views/dev/TomlJson.vue' },
  { key: 'sqlFormat', path: '/dev/sql', page: 'pages/dev/sql.vue', view: 'src/views/dev/SqlFormat.vue' },
  { key: 'codeFormat', path: '/dev/code-format', page: 'pages/dev/code-format.vue', view: 'src/views/dev/CodeFormat.vue' }
]

test('phase 1 developer tools are registered in pages, catalog, i18n and SEO metadata', () => {
  for (const tool of phase1Tools) {
    assert.equal(existsSync(file(tool.page)), true, `${tool.page} exists`)
    assert.equal(existsSync(file(tool.view)), true, `${tool.view} exists`)
    assert.equal(toolCatalog[tool.key].path, tool.path)
    assert.equal(routeKeyByPath[tool.path].key, tool.key)
    assert.equal(categoryCatalog.dev.tools.includes(tool.key), true)
    assert.equal(Boolean(getToolMessage('en', tool.key).title), true)
    assert.equal(Boolean(getToolMessage('zh-CN', tool.key).title), true)
    assert.equal(seoByPath[tool.path].path, tool.path)
    assert.match(readFileSync(file(tool.page), 'utf8'), new RegExp(`useToolSeo\\('${tool.path}'\\)`))
  }
})

test('JSON and YAML convert in both directions', () => {
  const yaml = jsonToYaml('{"name":"ToolX","enabled":true,"count":2}')
  assert.match(yaml, /name:\s*ToolX/)
  assert.match(yaml, /enabled:\s*true/)

  const json = JSON.parse(yamlToJson('name: ToolX\nenabled: true\ncount: 2'))
  assert.deepEqual(json, { name: 'ToolX', enabled: true, count: 2 })
})

test('JSON and XML convert objects, arrays, attributes and invalid markup', () => {
  const xml = jsonToXml('{"name":"Ada","tags":["dev","seo"]}')
  assert.match(xml, /<name>Ada<\/name>/)
  assert.match(xml, /<tags>dev<\/tags>/)
  assert.match(xml, /<tags>seo<\/tags>/)

  const json = JSON.parse(xmlToJson('<person id="7"><name>Ada</name></person>'))
  assert.equal(json.person['@id'], '7')
  assert.equal(json.person.name, 'Ada')

  const items = JSON.parse(xmlToJson(jsonToXml('[{"id":1},{"id":2}]')))
  assert.deepEqual(items, [{ id: 1 }, { id: 2 }])

  assert.throws(() => xmlToJson('<root><open></root>'), /Mismatched XML tag|Unclosed XML tag/)
})

test('JSON and CSV convert arrays of objects and quoted fields', () => {
  const csv = jsonToCsv('[{"name":"Ada Lovelace","city":"London, UK"},{"name":"Grace","city":"New York"}]')
  assert.equal(csv, 'name,city\nAda Lovelace,"London, UK"\nGrace,New York')

  const rows = JSON.parse(csvToJson('name,note\n"Ada ""A.""","line1\nline2"'))
  assert.equal(rows[0].name, 'Ada "A."')
  assert.equal(rows[0].note, 'line1\nline2')

  assert.deepEqual(parseCsv('a,b\n1,2'), [['a', 'b'], ['1', '2']])
  assert.throws(() => jsonToCsv('{"name":"Ada"}'), /array of objects/)
  assert.throws(() => csvToJson('a,"b'), /not closed/)
})

test('TOML and JSON convert object roots', () => {
  const json = JSON.parse(tomlToJson('title = "ToolX"\n[server]\nport = 8787'))
  assert.equal(json.title, 'ToolX')
  assert.equal(json.server.port, 8787)

  const toml = jsonToToml('{"title":"ToolX","server":{"port":8787}}')
  assert.match(toml, /title\s*=\s*"ToolX"/)
  assert.match(toml, /port\s*=\s*8787/)
  assert.throws(() => jsonToToml('[1,2,3]'), /TOML root must be an object/)
})

test('SQL formatter beautifies and minifies statements', () => {
  const pretty = formatSql('select id,name from users where active=1')
  assert.match(pretty, /SELECT/)
  assert.match(pretty, /FROM/)
  assert.match(pretty, /users/)

  assert.equal(
    minifySql("select   id,   name from users -- comment\nwhere name = 'Ada Lovelace'"),
    "select id,name from users where name = 'Ada Lovelace'"
  )
})

test('code formatter beautifies and minifies JavaScript and CSS', () => {
  const js = formatJavaScript('function hello(name){return name}')
  assert.match(js, /function hello/)
  assert.match(js, /return name/)

  assert.equal(minifyJavaScript('function hello ( name ) { return name }'), 'function hello(name){return name}')
  assert.equal(minifyCss('.card { color: #00d9ff; margin: 0; }'), '.card{color:#00d9ff;margin:0}')
  assert.match(formatCss('.card{color:#00d9ff}'), /color:\s*#00d9ff/)
})
