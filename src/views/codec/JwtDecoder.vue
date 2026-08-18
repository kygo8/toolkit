<script setup>
import { computed, ref } from 'vue'
import { decodeJwt, signJwtHs256 } from '~/src/utils/jwt.js'

const mode = ref('decode')
const token = ref('')
const copiedHeader = ref(false)
const copiedPayload = ref(false)
const copiedToken = ref(false)

const payloadText = ref(JSON.stringify({
  sub: '1234567890',
  name: 'John Doe',
  iat: 1516239022
}, null, 2))
const secret = ref('your-256-bit-secret')
const addTimestamps = ref(true)
const encodedToken = ref('')
const encodeError = ref('')

const decoded = computed(() => {
  if (!token.value.trim()) return null
  const result = decodeJwt(token.value)
  if (result.error === 'invalid_format') {
    return { error: '无效的 JWT 格式，应为三段以 . 分隔的字符串' }
  }
  if (result.error) {
    return { error: '解析失败: ' + result.error }
  }
  return {
    ...result,
    issuedAt: result.issuedAt ? result.issuedAt.toLocaleString() : null,
    expiresAt: result.expiresAt ? result.expiresAt.toLocaleString() : null
  }
})

const copySection = async (type) => {
  if (!decoded.value || decoded.value.error) return
  const content = JSON.stringify(decoded.value[type], null, 2)
  try {
    await navigator.clipboard.writeText(content)
    if (type === 'header') {
      copiedHeader.value = true
      setTimeout(() => { copiedHeader.value = false }, 2000)
    } else {
      copiedPayload.value = true
      setTimeout(() => { copiedPayload.value = false }, 2000)
    }
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const encodeToken = async () => {
  encodeError.value = ''
  encodedToken.value = ''

  let payload
  try {
    payload = JSON.parse(payloadText.value)
  } catch (error) {
    encodeError.value = 'Payload 不是有效 JSON: ' + error.message
    return
  }

  if (addTimestamps.value) {
    const now = Math.floor(Date.now() / 1000)
    payload.iat = payload.iat ?? now
    payload.exp = payload.exp ?? now + 3600
  }

  try {
    encodedToken.value = await signJwtHs256({ payload, secret: secret.value })
  } catch (error) {
    encodeError.value = '签名失败: ' + error.message
  }
}

const copyEncoded = async () => {
  if (!encodedToken.value) return
  try {
    await navigator.clipboard.writeText(encodedToken.value)
    copiedToken.value = true
    setTimeout(() => { copiedToken.value = false }, 2000)
  } catch {}
}

const useEncodedAsInput = () => {
  if (!encodedToken.value) return
  token.value = encodedToken.value
  mode.value = 'decode'
}

const clearAll = () => {
  token.value = ''
  encodedToken.value = ''
  encodeError.value = ''
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔑 JWT 编解码</h1>

    <div class="mode-tabs">
      <button class="mode-tab" :class="{ active: mode === 'decode' }" @click="mode = 'decode'">解码</button>
      <button class="mode-tab" :class="{ active: mode === 'encode' }" @click="mode = 'encode'">编码 / HS256 签名</button>
    </div>

    <div v-if="mode === 'decode'" class="card">
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
              <button class="copy-btn-small" @click="copySection('header')">
                {{ copiedHeader ? '✓ 已复制' : '📋 复制' }}
              </button>
            </div>
            <pre class="json-output">{{ JSON.stringify(decoded.header, null, 2) }}</pre>
          </div>

          <div class="json-section">
            <div class="section-header">
              <span class="section-title" style="color: #7c3aed">● Payload</span>
              <button class="copy-btn-small" @click="copySection('payload')">
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

    <div v-else class="card">
      <div class="input-section">
        <label class="form-label">Payload JSON</label>
        <textarea v-model="payloadText" class="form-textarea tall" placeholder='{"sub":"1234567890"}'></textarea>
      </div>

      <div class="input-section">
        <label class="form-label">密钥 Secret (HS256)</label>
        <input v-model="secret" type="text" class="form-input" placeholder="输入签名密钥..." />
      </div>

      <label class="checkbox-label">
        <input type="checkbox" v-model="addTimestamps" />
        <span class="checkbox-custom"></span>
        自动补齐 iat / exp
      </label>

      <div class="action-row">
        <button class="action-btn primary" @click="encodeToken">🔐 签名生成</button>
        <button class="clear-btn" @click="clearAll">✕ 清空</button>
      </div>

      <div v-if="encodeError" class="error-message">❌ {{ encodeError }}</div>

      <div v-if="encodedToken" class="json-section">
        <div class="section-header">
          <span class="section-title" style="color: #10b981">● JWT Token</span>
          <div class="header-actions">
            <button class="copy-btn-small" @click="copyEncoded">{{ copiedToken ? '✓ 已复制' : '📋 复制' }}</button>
            <button class="copy-btn-small" @click="useEncodedAsInput">解码此 Token</button>
          </div>
        </div>
        <pre class="json-output signature">{{ encodedToken }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 800px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.mode-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.mode-tab { padding: 0.5rem 1rem; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; }
.mode-tab.active { border-color: var(--primary-color); color: var(--primary-color); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.input-section { margin-bottom: 1rem; }
.form-label { display: block; font-weight: 500; color: var(--text-color); font-size: 0.9rem; margin-bottom: 0.5rem; }
.form-input, .form-textarea { width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-color); }
.form-textarea { min-height: 100px; resize: vertical; line-height: 1.5; word-break: break-all; }
.form-textarea.tall { min-height: 160px; }
.form-input:focus, .form-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.clear-section { margin-bottom: 1.25rem; text-align: center; }
.clear-btn { padding: 0.5rem 1.25rem; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; }
.clear-btn:hover { border-color: #ef4444; color: #ef4444; }
.error-message { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 0.75rem 1rem; color: #ef4444; font-size: 0.875rem; font-family: var(--font-mono); }
.status-bar { padding: 0.625rem 1rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1rem; background: rgba(16, 185, 129, 0.15); color: #10b981; }
.status-bar.expired { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.result-section { display: flex; flex-direction: column; gap: 1rem; }
.json-section { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; margin-top: 1rem; }
.section-header { display: flex; justify-content: space-between; align-items: center; padding: 0.625rem 1rem; border-bottom: 1px solid var(--border-color); }
.section-title { font-weight: 600; font-size: 0.85rem; }
.header-actions { display: flex; gap: 0.4rem; }
.copy-btn-small { padding: 0.25rem 0.5rem; background: transparent; border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
.json-output { padding: 1rem; margin: 0; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-color); white-space: pre-wrap; word-break: break-all; line-height: 1.6; }
.json-output.signature { color: var(--text-muted); font-size: 0.8rem; }
.checkbox-label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-size: 0.85rem; color: var(--text-color); margin-bottom: 1rem; }
.checkbox-label input { display: none; }
.checkbox-custom { width: 16px; height: 16px; border: 2px solid var(--border-color); border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; }
.checkbox-label input:checked + .checkbox-custom { background: var(--primary-color); border-color: var(--primary-color); }
.checkbox-label input:checked + .checkbox-custom::after { content: '✓'; color: var(--bg-color); font-size: 10px; }
.action-row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 1rem; }
.action-btn { padding: 0.55rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); cursor: pointer; }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
</style>
