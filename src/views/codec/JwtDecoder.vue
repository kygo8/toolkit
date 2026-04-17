<script setup>
import { ref, computed } from 'vue'

const token = ref('')
const copiedHeader = ref(false)
const copiedPayload = ref(false)

const decoded = computed(() => {
  if (!token.value.trim()) return null

  const parts = token.value.trim().split('.')
  if (parts.length !== 3) {
    return { error: '无效的 JWT 格式，应为三段以 . 分隔的字符串' }
  }

  try {
    const decodeBase64 = (str) => {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
      while (base64.length % 4) base64 += '='
      return JSON.parse(atob(base64))
    }

    const header = decodeBase64(parts[0])
    const payload = decodeBase64(parts[1])

    const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : null

    return {
      header,
      payload,
      signature: parts[2],
      isExpired,
      issuedAt: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : null,
      expiresAt: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : null
    }
  } catch (e) {
    return { error: '解析失败: ' + e.message }
  }
})

const copySection = async (section, type) => {
  if (!decoded.value || decoded.value.error) return
  const content = JSON.stringify(decoded.value[type], null, 2)
  try {
    await navigator.clipboard.writeText(content)
    if (type === 'header') {
      copiedHeader.value = true
      setTimeout(() => copiedHeader.value = false, 2000)
    } else {
      copiedPayload.value = true
      setTimeout(() => copiedPayload.value = false, 2000)
    }
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const clearAll = () => {
  token.value = ''
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔑 JWT 解码</h1>

    <div class="card">
      <div class="input-section">
        <label class="form-label">输入 JWT Token</label>
        <textarea
          v-model="token"
          class="form-textarea"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        ></textarea>
      </div>

      <div class="clear-section">
        <button class="clear-btn" @click="clearAll">✕ 清空</button>
      </div>

      <div v-if="decoded">
        <div v-if="decoded.error" class="error-message">
          ❌ {{ decoded.error }}
        </div>

        <div v-else class="result-section">
          <div v-if="decoded.isExpired !== null" class="status-bar" :class="{ expired: decoded.isExpired }">
            {{ decoded.isExpired ? '⚠️ Token 已过期' : '✓ Token 未过期' }}
            <span v-if="decoded.expiresAt"> ({{ decoded.expiresAt }})</span>
          </div>

          <div class="json-section">
            <div class="section-header">
              <span class="section-title" style="color: #ef4444">● Header</span>
              <button class="copy-btn-small" @click="copySection($event, 'header')">
                {{ copiedHeader ? '✓ 已复制' : '📋 复制' }}
              </button>
            </div>
            <pre class="json-output">{{ JSON.stringify(decoded.header, null, 2) }}</pre>
          </div>

          <div class="json-section">
            <div class="section-header">
              <span class="section-title" style="color: #7c3aed">● Payload</span>
              <button class="copy-btn-small" @click="copySection($event, 'payload')">
                {{ copiedPayload ? '✓ 已复制' : '📋 复制' }}
              </button>
            </div>
            <pre class="json-output">{{ JSON.stringify(decoded.payload, null, 2) }}</pre>
          </div>

          <div class="json-section">
            <div class="section-header">
              <span class="section-title" style="color: #10b981">● Signature</span>
            </div>
            <pre class="json-output signature">{{ decoded.signature }}</pre>
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
.input-section { margin-bottom: 1rem; }
.form-label { display: block; font-weight: 500; color: var(--text-color); font-size: 0.9rem; margin-bottom: 0.5rem; }
.form-textarea { width: 100%; min-height: 100px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-color); resize: vertical; line-height: 1.5; word-break: break-all; }
.form-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.clear-section { margin-bottom: 1.25rem; text-align: center; }
.clear-btn { padding: 0.5rem 1.25rem; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; transition: all 0.3s ease; }
.clear-btn:hover { border-color: #ef4444; color: #ef4444; }
.error-message { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 0.75rem 1rem; color: #ef4444; font-size: 0.875rem; font-family: var(--font-mono); }
.status-bar { padding: 0.625rem 1rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1rem; background: rgba(16, 185, 129, 0.15); color: #10b981; }
.status-bar.expired { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.result-section { display: flex; flex-direction: column; gap: 1rem; }
.json-section { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
.section-header { display: flex; justify-content: space-between; align-items: center; padding: 0.625rem 1rem; border-bottom: 1px solid var(--border-color); }
.section-title { font-weight: 600; font-size: 0.85rem; }
.copy-btn-small { padding: 0.25rem 0.5rem; background: transparent; border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
.json-output { padding: 1rem; margin: 0; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-color); white-space: pre-wrap; word-break: break-all; line-height: 1.6; }
.json-output.signature { color: var(--text-muted); font-size: 0.8rem; }
</style>
