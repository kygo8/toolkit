<script setup>
import { computed, onMounted, ref } from 'vue'
import UAParser from 'ua-parser-js'

const uaInput = ref('')
const copied = ref(false)

const parsed = computed(() => {
  const value = uaInput.value.trim()
  if (!value) return null
  return new UAParser(value).getResult()
})

const rows = computed(() => {
  if (!parsed.value) return []
  const { browser, engine, os, device, cpu } = parsed.value
  return [
    { label: '浏览器', value: [browser.name, browser.version].filter(Boolean).join(' ') || '未知' },
    { label: '操作系统', value: [os.name, os.version].filter(Boolean).join(' ') || '未知' },
    { label: '设备', value: [device.vendor, device.model, device.type].filter(Boolean).join(' ') || '桌面 / 未知' },
    { label: '引擎', value: [engine.name, engine.version].filter(Boolean).join(' ') || '未知' },
    { label: 'CPU', value: cpu.architecture || '未知' }
  ]
})

const useCurrent = () => {
  if (typeof navigator !== 'undefined') {
    uaInput.value = navigator.userAgent || ''
  }
}

const copyResult = async () => {
  if (!parsed.value) return
  const text = rows.value.map((row) => `${row.label}: ${row.value}`).join('\n')
  try {
    await navigator.clipboard.writeText(`${uaInput.value}\n\n${text}`)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

onMounted(useCurrent)
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🧭 User-Agent 解析</h1>
    <div class="card">
      <div class="form-group">
        <label class="form-label">User-Agent</label>
        <textarea
          v-model="uaInput"
          class="form-textarea"
          rows="4"
          placeholder="粘贴 User-Agent 字符串..."
        />
      </div>

      <div class="actions">
        <button class="action-btn" @click="useCurrent">使用当前浏览器</button>
        <button class="action-btn primary" :disabled="!parsed" @click="copyResult">
          {{ copied ? '✓ 已复制' : '📋 复制' }}
        </button>
      </div>

      <div v-if="parsed" class="result-grid">
        <div v-for="row in rows" :key="row.label" class="summary-item">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 900px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; padding: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-weight: 500; color: var(--text-color); font-size: 0.9rem; }
.form-textarea { width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; color: var(--text-color); font-size: 0.85rem; font-family: var(--font-mono); resize: vertical; line-height: 1.5; }
.form-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.85rem; }
.action-btn { padding: 0.625rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); font-size: 0.85rem; cursor: pointer; }
.action-btn:hover:not(:disabled) { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1.25rem; }
.summary-item { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.85rem; }
.summary-item span { display: block; color: var(--text-muted); font-size: 0.76rem; margin-bottom: 0.35rem; }
.summary-item strong { color: var(--primary-color); word-break: break-all; }
</style>
