import assert from 'node:assert/strict'
import { test } from 'node:test'
import { convertAllCases, splitWords } from '../src/utils/caseConvert.js'

test('splitWords understands camel, snake, kebab and spaced input', () => {
  assert.deepEqual(splitWords('helloWorldExample'), ['hello', 'world', 'example'])
  assert.deepEqual(splitWords('HelloWorldExample'), ['hello', 'world', 'example'])
  assert.deepEqual(splitWords('hello_world_example'), ['hello', 'world', 'example'])
  assert.deepEqual(splitWords('hello-world-example'), ['hello', 'world', 'example'])
  assert.deepEqual(splitWords('HELLO_WORLD_EXAMPLE'), ['hello', 'world', 'example'])
  assert.deepEqual(splitWords('Hello World Example'), ['hello', 'world', 'example'])
  assert.deepEqual(splitWords('parseXMLHttpRequest'), ['parse', 'xml', 'http', 'request'])
})

test('convertAllCases emits every required case variant', () => {
  const result = convertAllCases('hello-world-example')

  assert.equal(result.camelCase, 'helloWorldExample')
  assert.equal(result.pascalCase, 'HelloWorldExample')
  assert.equal(result.snakeCase, 'hello_world_example')
  assert.equal(result.kebabCase, 'hello-world-example')
  assert.equal(result.constantCase, 'HELLO_WORLD_EXAMPLE')
  assert.equal(result.titleCase, 'Hello World Example')
})

test('convertAllCases returns empty strings for blank input', () => {
  const result = convertAllCases('   ')
  assert.equal(result.camelCase, '')
  assert.equal(result.snakeCase, '')
})
