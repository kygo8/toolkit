<script setup>
import { computed, ref } from 'vue'

const domainInput = ref('')
const recordType = ref('A')
const dnsResults = ref([])
const parsedDomain = ref(null)
const isChecking = ref(false)
const errorText = ref('')

const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT']

const normalizedDomain = computed(() => {
  const value = domainInput.value.trim()
  if (!value) return ''
  try {
    const withProtocol = /^[a-z]+:\/\//i.test(value) ? value : `https://${value}`
    return new URL(withProtocol).hostname.replace(/\.$/, '')
  } catch {
    return value.replace(/^https?:\/\//i, '').split('/')[0].replace(/\.$/, '')
  }
})

const parseDomain = () => {
  const hostname = normalizedDomain.value
  if (!hostname || !hostname.includes('.')) {
    throw new Error('请输入有效域名，例如 example.com')
  }
  const labels = hostname.split('.').filter(Boolean)
  parsedDomain.value = {
    hostname,
    labels,
    tld: labels.at(-1),
    registrableHint: labels.slice(-2).join('.'),
    subdomain: labels.length > 2 ? labels.slice(0, -2).join('.') : '无'
  }
}

const queryDns = async () => {
  parseDomain()
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(parsedDomain.value.hostname)}&type=${recordType.value}`
  const response = await fetch(url, {
    headers: { accept: 'application/dns-json' }
  })
  if (!response.ok) throw new Error(`DNS 查询失败 (HTTP ${response.status})`)
  const data = await response.json()
  dnsResults.value = data.Answer || []
}

const runCheck = async () => {
  isChecking.value = true
  errorText.value = ''
  dnsResults.value = []
  parsedDomain.value = null
  try {
    await queryDns()
  } catch (error) {
    errorText.value = error.message
  } finally {
    isChecking.value = false
  }
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🌍 域名检测</h1>
    <div class="card">
      <div class="form-row">
        <input v-model="domainInput" class="domain-input" placeholder="example.com 或 https://www.example.com/path" @keyup.enter="runCheck" />
        <select v-model="recordType" class="record-select">
          <option v-for="type in recordTypes" :key="type" :value="type">{{ type }}</option>
        </select>
        <button class="action-btn primary" @click="runCheck" :disabled="isChecking">
          {{ isChecking ? '查询中...' : '检测域名' }}
        </button>
      </div>

      <div v-if="errorText" class="error-msg">{{ errorText }}</div>

      <div v-if="parsedDomain" class="domain-summary">
        <div class="summary-item">
          <span>规范域名</span>
          <strong>{{ parsedDomain.hostname }}</strong>
        </div>
        <div class="summary-item">
          <span>主域名提示</span>
          <strong>{{ parsedDomain.registrableHint }}</strong>
        </div>
        <div class="summary-item">
          <span>子域名</span>
          <strong>{{ parsedDomain.subdomain }}</strong>
        </div>
        <div class="summary-item">
          <span>顶级域</span>
          <strong>.{{ parsedDomain.tld }}</strong>
        </div>
      </div>

      <div v-if="parsedDomain" class="result-section">
        <h2>{{ recordType }} 记录</h2>
        <div v-if="dnsResults.length" class="record-list">
          <div v-for="(record, index) in dnsResults" :key="index" class="record-item">
            <div class="record-meta">
              <span>TTL {{ record.TTL }}</span>
              <span>Type {{ record.type }}</span>
            </div>
            <pre>{{ record.data }}</pre>
          </div>
        </div>
        <p v-else class="empty-text">未查询到 {{ recordType }} 记录。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 900px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; padding: 1.5rem; }
.form-row { display: grid; grid-template-columns: 1fr 110px auto; gap: 0.75rem; align-items: center; }
.domain-input, .record-select { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); padding: 0.75rem; font-family: var(--font-mono); }
.domain-input:focus, .record-select:focus { outline: none; border-color: var(--primary-color); }
.action-btn { padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: transparent; color: var(--text-color); cursor: pointer; white-space: nowrap; }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); font-weight: 700; }
.action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.domain-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1.25rem; }
.summary-item { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.85rem; }
.summary-item span { display: block; color: var(--text-muted); font-size: 0.76rem; margin-bottom: 0.35rem; }
.summary-item strong { color: var(--primary-color); word-break: break-all; }
.result-section { margin-top: 1.25rem; }
.result-section h2 { font-size: 1rem; margin-bottom: 0.75rem; }
.record-list { display: flex; flex-direction: column; gap: 0.75rem; }
.record-item { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.85rem; }
.record-meta { display: flex; gap: 0.75rem; color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.5rem; }
.record-item pre { margin: 0; color: var(--text-color); white-space: pre-wrap; word-break: break-all; font-family: var(--font-mono); }
.empty-text { color: var(--text-muted); }
.error-msg { margin-top: 1rem; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 8px; padding: 0.75rem; }
@media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
</style>
