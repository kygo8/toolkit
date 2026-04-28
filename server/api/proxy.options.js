import { setHeaders, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
  setResponseStatus(event, 204)
  setHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  })
  return null
})
