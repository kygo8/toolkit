<script setup>
import { ref, computed } from 'vue'

const method = ref('GET')
const url = ref('')
const headers = ref([{ key: '', value: '' }])
const bodyType = ref('none')
const rawBody = ref('')
const formData = ref([{ key: '', value: '' }])
const authType = ref('none')
const authToken = ref('')
const authUser = ref('')
const authPass = ref('')
const copied = ref(false)

const addHeader = () => headers.value.push({ key: '', value: '' })
const removeHeader = (i) => headers.value.length > 1 && headers.value.splice(i, 1)
const addFormData = () => formData.value.push({ key: '', value: '' })
const removeFormData = (i) => formData.value.length > 1 && formData.value.splice(i, 1)

const curlCommand = computed(() => {
  let parts = ['curl']
  parts.push(url.value || 'https://example.com')

  if (method.value !== 'GET') parts.push(`-X ${method.value}`)

  if (authType.value === 'bearer' && authToken.value) {
    parts.push(`-H "Authorization: Bearer ${authToken.value}"`)
  } else if (authType.value === 'basic' && authUser.value) {
    parts.push(`-u "${authUser.value}:${authPass.value}"`)
  }

  headers.value.forEach(h => {
    if (h.key && h.value) parts.push(`-H "${h.key}: ${h.value}"`)
  })

  if (bodyType.value === 'raw' && rawBody.value) {
    parts.push(`-d '${rawBody.value}'`)
  } else if (bodyType.value === 'form') {
    formData.value.forEach(f => {
      if (f.key) parts.push(`-F "${f.key}=${f.value}"`)
    })
  }

  parts.push('--compressed')
  return parts.join(' \\\n  ')
})

const copyResult = async () => {
  try { await navigator.clipboard.writeText(curlCommand.value); copied.value = true; setTimeout(() => copied.value = false, 2000) } catch {}
}

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🛠️ cURL 构建器</h1>
    <div class="card">
      <div class="form-row">
        <div class="method-group">
          <select v-model="method" class="method-select" :class="method.toLowerCase()">
            <option v-for="m in methods" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
        <div class="url-group">
          <input type="text" v-model="url" class="url-input" placeholder="https://api.example.com/endpoint" />
        </div>
      </div>

      <div class="section">
        <h4 class="section-title">认证</h4>
        <div class="auth-row">
          <select v-model="authType" class="form-select-sm">
            <option value="none">无</option>
            <option value="bearer">Bearer Token</option>
            <option value="basic">Basic Auth</option>
          </select>
          <template v-if="authType === 'bearer'">
            <input type="text" v-model="authToken" class="kv-input" placeholder="Token" />
          </template>
          <template v-if="authType === 'basic'">
            <input type="text" v-model="authUser" class="kv-input" placeholder="用户名" />
            <input type="password" v-model="authPass" class="kv-input" placeholder="密码" />
          </template>
        </div>
      </div>

      <div class="section">
        <h4 class="section-title">Headers</h4>
        <div class="kv-list">
          <div v-for="(h, i) in headers" :key="i" class="kv-row">
            <input type="text" v-model="h.key" class="kv-input" placeholder="Header名" />
            <input type="text" v-model="h.value" class="kv-input" placeholder="Header值" />
            <button class="remove-btn" @click="removeHeader(i)">✕</button>
          </div>
        </div>
        <button class="add-btn" @click="addHeader">+ 添加Header</button>
      </div>

      <div class="section">
        <h4 class="section-title">Body</h4>
        <div class="body-tabs">
          <button class="body-tab" :class="{ active: bodyType === 'none' }" @click="bodyType = 'none'">none</button>
          <button class="body-tab" :class="{ active: bodyType === 'raw' }" @click="bodyType = 'raw'">raw</button>
          <button class="body-tab" :class="{ active: bodyType === 'form' }" @click="bodyType = 'form'">form-data</button>
        </div>
        <div v-if="bodyType === 'raw'" class="body-raw">
          <textarea v-model="rawBody" class="body-textarea" placeholder='{"key": "value"}' rows="4"></textarea>
        </div>
        <div v-if="bodyType === 'form'" class="body-form">
          <div v-for="(f, i) in formData" :key="i" class="kv-row">
            <input type="text" v-model="f.key" class="kv-input" placeholder="字段名" />
            <input type="text" v-model="f.value" class="kv-input" placeholder="字段值" />
            <button class="remove-btn" @click="removeFormData(i)">✕</button>
          </div>
          <button class="add-btn" @click="addFormData">+ 添加字段</button>
        </div>
      </div>

      <div class="output-section">
        <div class="output-header">
          <span class="output-title">生成的 cURL 命令</span>
          <button class="action-btn" @click="copyResult">{{ copied ? '✓ 已复制' : '📋 复制' }}</button>
        </div>
        <pre class="code-output">{{ curlCommand }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 900px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.form-row { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; }
.method-group { width: 110px; }
.method-select { width: 100%; padding: 0.75rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px 0 0 8px; font-weight: 700; font-family: var(--font-mono); cursor: pointer; }
.method-select.get { color: #10b981; }
.method-select.post { color: #f59e0b; }
.method-select.put { color: #00d9ff; }
.method-select.delete { color: #ef4444; }
.method-select.patch { color: #7c3aed; }
.url-group { flex: 1; }
.url-input { width: 100%; padding: 0.75rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 0 8px 8px 0; color: var(--text-color); font-family: var(--font-mono); font-size: 0.9rem; border-left: none; }
.url-input:focus { outline: none; border-color: var(--primary-color); }
.section { margin-bottom: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }
.section-title { font-size: 0.85rem; font-weight: 600; color: var(--text-color); margin-bottom: 0.75rem; }
.auth-row { display: flex; gap: 0.5rem; align-items: center; }
.form-select-sm { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.4rem 0.5rem; color: var(--text-color); font-size: 0.82rem; }
.kv-list { display: flex; flex-direction: column; gap: 0.5rem; }
.kv-row { display: flex; gap: 0.5rem; align-items: center; }
.kv-input { flex: 1; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.4rem 0.625rem; color: var(--text-color); font-size: 0.82rem; font-family: var(--font-mono); }
.kv-input:focus { outline: none; border-color: var(--primary-color); }
.remove-btn { padding: 0.35rem 0.5rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }
.remove-btn:hover { color: #ef4444; }
.add-btn { margin-top: 0.5rem; padding: 0.3rem 0.75rem; background: transparent; border: 1px dashed var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.78rem; cursor: pointer; }
.add-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.body-tabs { display: flex; gap: 0.25rem; margin-bottom: 0.75rem; }
.body-tab { padding: 0.375rem 0.75rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.78rem; cursor: pointer; }
.body-tab.active { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.body-textarea { width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.625rem; color: var(--text-color); font-family: var(--font-mono); font-size: 0.82rem; resize: vertical; line-height: 1.5; }
.body-textarea:focus { outline: none; border-color: var(--primary-color); }
.output-section { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; margin-top: 0.5rem; }
.output-header { display: flex; justify-content: space-between; align-items: center; padding: 0.625rem 1rem; border-bottom: 1px solid var(--border-color); }
.output-title { font-size: 0.82rem; font-weight: 600; color: var(--primary-color); }
.action-btn { padding: 0.4rem 0.75rem; background: transparent; border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-color); font-size: 0.78rem; cursor: pointer; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.code-output { padding: 1rem; margin: 0; font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-color); white-space: pre-wrap; word-break: break-all; line-height: 1.6; }
</style>
