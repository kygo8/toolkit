<script setup>
import { ref, watch } from 'vue'
import { HMAC_ALGORITHMS, computeHmac } from '~/src/utils/hmac.js'

const message = ref('')
const secret = ref('')
const algorithm = ref('SHA-256')
const results = ref(null)
const error = ref('')
const copied = ref('')

const compute = async () => {
  if (!message.value && !secret.value) {
    results.value = null
    error.value = ''
    return
  }

  try {
    results.value = await computeHmac({
      message: message.value,
      secret: secret.value,
      algorithm: algorithm.value
    })
    error.value = ''
  } catch (err) {
    results.value = null
    error.value = '计算失败: ' + err.message
  }
}

watch([message, secret, algorithm], compute)

const copyText = async (text, key) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = key
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {}
}

const clearAll = () => {
  message.value = ''
  secret.value = ''
  results.value = null
  error.value = ''
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔏 HMAC</h1>

    <div class="card">
      <div class="input-section">
        <label class="form-label">密钥 Secret</label>
        <input v-model="secret" type="text" class="form-input" placeholder="输入 HMAC 密钥..." />
      </div>

      <div class="input-section">
        <label class="form-label">消息 Message</label>
        <textarea v-model="message" class="form-textarea" placeholder="输入要签名的文本..."></textarea>
      </div>

      <div class="config-row">
        <label class="config-label">算法</label>
        <select v-model="algorithm" class="form-select-sm">
          <option v-for="algo in HMAC_ALGORITHMS" :key="algo" :value="algo">{{ algo }}</option>
        </select>
      </div>

      <div v-if="error" class="error-msg">❌ {{ error }}</div>

      <div v-if="results" class="results-section">
        <div class="hash-item">
          <div class="hash-header">
            <span class="hash-algo">HEX</span>
            <button class="copy-btn-small" @click="copyText(results.hex, 'hex')">
              {{ copied === 'hex' ? '✓ 已复制' : '📋 复制' }}
            </button>
          </div>
          <div class="hash-value">{{ results.hex }}</div>
        </div>
        <div class="hash-item">
          <div class="hash-header">
            <span class="hash-algo">Base64</span>
            <button class="copy-btn-small" @click="copyText(results.base64, 'base64')">
              {{ copied === 'base64' ? '✓ 已复制' : '📋 复制' }}
            </button>
          </div>
          <div class="hash-value">{{ results.base64 }}</div>
        </div>
      </div>

      <div class="clear-section">
        <button class="clear-btn" @click="clearAll">✕ 清空</button>
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
.form-input, .form-textarea { width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.85rem 1rem; font-family: var(--font-mono); font-size: 0.875rem; color: var(--text-color); }
.form-textarea { min-height: 100px; resize: vertical; line-height: 1.6; }
.form-input:focus, .form-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.config-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; }
.config-label { font-size: 0.85rem; color: var(--text-muted); }
.form-select-sm { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.4rem 0.6rem; color: var(--text-color); }
.error-msg { color: #ef4444; font-size: 0.85rem; margin-bottom: 1rem; }
.results-section { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; }
.hash-item { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
.hash-header { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; border-bottom: 1px solid var(--border-color); background: rgba(0, 217, 255, 0.05); }
.hash-algo { font-weight: 600; font-size: 0.85rem; color: var(--primary-color); font-family: var(--font-mono); }
.hash-value { padding: 0.75rem 1rem; font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-color); word-break: break-all; }
.copy-btn-small { padding: 0.25rem 0.5rem; background: transparent; border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
.clear-section { text-align: center; }
.clear-btn { padding: 0.5rem 1.25rem; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; }
.clear-btn:hover { border-color: #ef4444; color: #ef4444; }
</style>
