<script setup>
import { ref, computed } from 'vue'

const curlInput = ref('')
const copied = ref('')

const parseCurl = (cmd) => {
  const result = { method: 'GET', url: '', headers: {}, data: '', form: {} }
  const tokens = []
  let current = ''
  let inQuote = false
  let quoteChar = ''

  const cleaned = cmd.replace(/\\\n/g, ' ').replace(/\r/g, '').trim()
  const str = cleaned.replace(/^curl\s+/, '')

  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (inQuote) {
      if (ch === quoteChar) { inQuote = false } else { current += ch }
    } else if (ch === '"' || ch === "'") {
      inQuote = true; quoteChar = ch
    } else if (ch === ' ' || ch === '\t') {
      if (current) { tokens.push(current); current = '' }
    } else {
      current += ch
    }
  }
  if (current) tokens.push(current)

  let i = 0
  while (i < tokens.length) {
    const t = tokens[i]
    if (t === '-X' || t === '--request') {
      result.method = tokens[++i] || 'GET'
    } else if (t === '-H' || t === '--header') {
      const h = tokens[++i] || ''
      const idx = h.indexOf(':')
      if (idx > 0) {
        result.headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim()
      }
    } else if (t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-binary' || t === '--data-urlencode') {
      result.data = tokens[++i] || ''
      if (result.method === 'GET') result.method = 'POST'
    } else if (t === '-F' || t === '--form') {
      const f = tokens[++i] || ''
      const idx = f.indexOf('=')
      if (idx > 0) result.form[f.slice(0, idx)] = f.slice(idx + 1)
      if (result.method === 'GET') result.method = 'POST'
    } else if (t === '-u' || t === '--user') {
      const cred = tokens[++i] || ''
      result.headers['Authorization'] = 'Basic ' + btoa(cred)
    } else if (t === '-b' || t === '--cookie') {
      result.headers['Cookie'] = tokens[++i] || ''
    } else if (t === '-A' || t === '--user-agent') {
      result.headers['User-Agent'] = tokens[++i] || ''
    } else if (t === '-e' || t === '--referer') {
      result.headers['Referer'] = tokens[++i] || ''
    } else if (t === '-o' || t === '--output' || t === '-s' || t === '--silent' || t === '-S' || t === '--show-error' || t === '-L' || t === '--location' || t === '-k' || t === '--insecure' || t === '-v' || t === '--verbose' || t === '-i' || t === '--include' || t === '-N' || t === '--no-buffer' || t === '-g' || t === '--globoff') {
      // skip flags without values
    } else if (t === '--compressed' || t === '--ciphers' || t === '--connect-timeout' || t === '--max-time' || t === '-m') {
      if (t === '--compressed') continue
      i++
    } else if (!t.startsWith('-') && !result.url) {
      result.url = t.replace(/^['"]|['"]$/g, '')
    }
    i++
  }

  return result
}

const parsed = computed(() => {
  if (!curlInput.value.trim()) return null
  try { return parseCurl(curlInput.value) } catch { return null }
})

const copyText = async (text, label) => {
  try { await navigator.clipboard.writeText(text); copied.value = label; setTimeout(() => copied.value = '', 2000) } catch {}
}

const clearAll = () => { curlInput.value = '' }
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔍 cURL 解析器</h1>
    <div class="card">
      <div class="form-group">
        <label class="form-label">输入 cURL 命令</label>
        <textarea v-model="curlInput" class="form-textarea" placeholder='curl https://api.example.com/users -H "Authorization: Bearer token" -d "{\"name\":\"test\"}"' rows="5"></textarea>
      </div>
      <div class="actions"><button class="action-btn" @click="clearAll">✕ 清空</button></div>
      <div v-if="parsed" class="result-section">
        <div class="result-grid">
          <div class="result-card">
            <div class="result-header"><span class="result-title">请求方法</span></div>
            <div class="result-value method" :class="parsed.method.toLowerCase()">{{ parsed.method }}</div>
          </div>
          <div class="result-card full">
            <div class="result-header">
              <span class="result-title">URL</span>
              <button class="copy-btn-small" @click="copyText(parsed.url, 'url')">{{ copied === 'url' ? '✓' : '📋' }}</button>
            </div>
            <div class="result-value mono break">{{ parsed.url }}</div>
          </div>
        </div>

        <div v-if="Object.keys(parsed.headers).length > 0" class="section-block">
          <h4 class="block-title">Headers</h4>
          <div class="kv-list">
            <div v-for="(v, k) in parsed.headers" :key="k" class="kv-item">
              <span class="kv-key">{{ k }}</span>
              <span class="kv-val">{{ v }}</span>
            </div>
          </div>
        </div>

        <div v-if="parsed.data" class="section-block">
          <div class="result-header">
            <h4 class="block-title" style="margin-bottom:0">Body</h4>
            <button class="copy-btn-small" @click="copyText(parsed.data, 'body')">{{ copied === 'body' ? '✓ 已复制' : '📋 复制' }}</button>
          </div>
          <pre class="body-content">{{ parsed.data }}</pre>
        </div>

        <div v-if="Object.keys(parsed.form).length > 0" class="section-block">
          <h4 class="block-title">Form Data</h4>
          <div class="kv-list">
            <div v-for="(v, k) in parsed.form" :key="k" class="kv-item">
              <span class="kv-key">{{ k }}</span>
              <span class="kv-val">{{ v }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 800px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.form-group { margin-bottom: 0.75rem; }
.form-label { display: block; font-weight: 500; color: var(--text-color); font-size: 0.9rem; margin-bottom: 0.375rem; }
.form-textarea { width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; color: var(--text-color); font-family: var(--font-mono); font-size: 0.85rem; resize: vertical; line-height: 1.5; }
.form-textarea:focus { outline: none; border-color: var(--primary-color); }
.actions { display: flex; justify-content: flex-end; margin-bottom: 1rem; }
.action-btn { padding: 0.5rem 1rem; background: transparent; border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }
.action-btn:hover { border-color: #ef4444; color: #ef4444; }
.result-section { border-top: 1px solid var(--border-color); padding-top: 1.25rem; }
.result-grid { display: grid; grid-template-columns: 120px 1fr; gap: 0.75rem; margin-bottom: 1rem; }
.result-card { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; }
.result-card.full { grid-column: 1 / -1; }
.result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem; }
.result-title { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
.result-value { font-size: 0.9rem; color: var(--text-color); }
.result-value.mono { font-family: var(--font-mono); font-size: 0.85rem; color: var(--primary-color); }
.result-value.break { word-break: break-all; }
.result-value.method { font-family: var(--font-mono); font-weight: 700; font-size: 1rem; }
.result-value.method.get { color: #10b981; }
.result-value.method.post { color: #f59e0b; }
.result-value.method.put { color: #00d9ff; }
.result-value.method.delete { color: #ef4444; }
.result-value.method.patch { color: #7c3aed; }
.copy-btn-small { padding: 0.15rem 0.4rem; background: transparent; border: 1px solid var(--border-color); border-radius: 3px; color: var(--text-muted); font-size: 0.65rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
.section-block { margin-top: 1rem; }
.block-title { font-size: 0.85rem; font-weight: 600; color: var(--text-color); margin-bottom: 0.5rem; }
.kv-list { display: flex; flex-direction: column; gap: 0.375rem; }
.kv-item { display: flex; gap: 0.75rem; padding: 0.375rem 0.625rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.82rem; }
.kv-key { color: #f59e0b; font-family: var(--font-mono); font-weight: 600; white-space: nowrap; }
.kv-val { color: var(--text-color); font-family: var(--font-mono); word-break: break-all; }
.body-content { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.75rem; font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-color); white-space: pre-wrap; word-break: break-all; margin: 0; }
@media (max-width: 500px) { .result-grid { grid-template-columns: 1fr; } }
</style>
