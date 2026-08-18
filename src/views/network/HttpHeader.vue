<script setup>
import { computed, ref } from 'vue'
import { parseHttpHeaders } from '~/src/utils/http-headers.js'

const raw = ref(`GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html
Accept-Language: zh-CN,en;q=0.8
Cookie: session=abc123`)
const copied = ref(false)
const showExplain = ref(true)

const parsed = computed(() => parseHttpHeaders(raw.value))

const copyTable = async () => {
  if (!parsed.value.headers.length) return
  const lines = parsed.value.headers.map((header) => `${header.name}: ${header.value}`)
  try {
    await navigator.clipboard.writeText(lines.join('\n'))
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

const useExample = (kind) => {
  raw.value = kind === 'response'
    ? `HTTP/1.1 200 OK
Date: Tue, 18 Aug 2026 04:00:00 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 128
Cache-Control: max-age=600
Server: cloudflare
Set-Cookie: id=1; Path=/; HttpOnly`
    : `POST /api/login HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer token
Origin: https://example.com
Content-Length: 32`
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">📑 HTTP Header 解析</h1>
    <div class="card">
      <div class="form-group">
        <label class="form-label">原始请求 / 响应头</label>
        <textarea
          v-model="raw"
          class="form-textarea"
          rows="10"
          placeholder="粘贴 HTTP 请求或响应头..."
        />
      </div>

      <div class="actions">
        <button class="action-btn" @click="useExample('request')">请求示例</button>
        <button class="action-btn" @click="useExample('response')">响应示例</button>
        <label class="toggle">
          <input v-model="showExplain" type="checkbox" />
          显示常见 Header 说明
        </label>
        <button class="action-btn primary" :disabled="!parsed.headers.length" @click="copyTable">
          {{ copied ? '✓ 已复制' : '📋 复制' }}
        </button>
      </div>

      <div v-if="parsed.startLine" class="start-line">{{ parsed.startLine }}</div>

      <div v-if="parsed.headers.length" class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th>值</th>
              <th v-if="showExplain">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(header, index) in parsed.headers" :key="`${header.name}-${index}`">
              <td>{{ header.name }}</td>
              <td>{{ header.value }}</td>
              <td v-if="showExplain">{{ header.explanation || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="empty-text">未解析到 Header</p>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 960px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; padding: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-weight: 500; color: var(--text-color); font-size: 0.9rem; }
.form-textarea { width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; color: var(--text-color); font-size: 0.85rem; font-family: var(--font-mono); resize: vertical; line-height: 1.5; }
.form-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.actions { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; margin: 0.85rem 0 1rem; }
.toggle { display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted); font-size: 0.85rem; }
.action-btn { padding: 0.625rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); font-size: 0.85rem; cursor: pointer; }
.action-btn:hover:not(:disabled) { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.start-line { font-family: var(--font-mono); color: var(--primary-color); margin-bottom: 0.85rem; word-break: break-all; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
th, td { text-align: left; padding: 0.7rem 0.75rem; border-bottom: 1px solid var(--border-color); vertical-align: top; }
th { color: var(--text-muted); font-weight: 600; font-size: 0.78rem; }
td { word-break: break-all; }
td:first-child { color: var(--primary-color); font-family: var(--font-mono); white-space: nowrap; }
.empty-text { color: var(--text-muted); }
</style>
