<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentTimestamp = ref(Math.floor(Date.now() / 1000))
const currentDatetime = ref('')
let timer = null

onMounted(() => {
  updateNow()
  timer = setInterval(updateNow, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const updateNow = () => {
  currentTimestamp.value = Math.floor(Date.now() / 1000)
  currentDatetime.value = new Date().toLocaleString('zh-CN', { hour12: false })
}

const tsInput = ref('')
const tsUnit = ref('s')
const tsResult = ref('')
const tsError = ref('')

const dtInput = ref('')
const dtResult = ref('')
const dtError = ref('')

const tsToDt = () => {
  tsError.value = ''
  tsResult.value = ''
  if (!tsInput.value) return

  let ts = Number(tsInput.value)
  if (isNaN(ts)) { tsError.value = '请输入有效数字'; return }

  if (tsUnit.value === 'ms') ts = Math.floor(ts / 1000)

  if (ts < 0) { tsError.value = '时间戳不能为负数'; return }

  const d = new Date(ts * 1000)
  if (isNaN(d.getTime())) { tsError.value = '无效时间戳'; return }

  tsResult.value = d.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  })
}

const dtToTs = () => {
  dtError.value = ''
  dtResult.value = ''
  if (!dtInput.value) return

  const d = new Date(dtInput.value)
  if (isNaN(d.getTime())) { dtError.value = '无效日期时间'; return }

  dtResult.value = Math.floor(d.getTime() / 1000)
}

const copyText = async (text) => {
  if (!text) return
  try { await navigator.clipboard.writeText(String(text)) } catch {}
}

const useNow = () => {
  tsInput.value = String(currentTimestamp.value)
  tsUnit.value = 's'
  tsToDt()
}

const useNowDt = () => {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  dtInput.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  dtToTs()
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🕐 时间戳转换</h1>

    <div class="now-bar">
      <div class="now-item">
        <span class="now-label">当前时间戳</span>
        <span class="now-value">{{ currentTimestamp }}</span>
        <button class="copy-btn-small" @click="copyText(currentTimestamp)">📋</button>
      </div>
      <div class="now-item">
        <span class="now-label">当前时间</span>
        <span class="now-value">{{ currentDatetime }}</span>
      </div>
    </div>

    <div class="card">
      <div class="convert-section">
        <h3 class="section-heading">时间戳 → 日期时间</h3>
        <div class="input-row">
          <input type="text" v-model="tsInput" class="form-input" placeholder="输入时间戳" @keydown.enter="tsToDt" />
          <select v-model="tsUnit" class="form-select-sm">
            <option value="s">秒 (s)</option>
            <option value="ms">毫秒 (ms)</option>
          </select>
          <button class="action-btn primary" @click="tsToDt">转换</button>
          <button class="action-btn" @click="useNow">当前时间</button>
        </div>
        <div v-if="tsError" class="error-msg">{{ tsError }}</div>
        <div v-if="tsResult" class="result-row">
          <span class="result-value">{{ tsResult }}</span>
          <button class="copy-btn-small" @click="copyText(tsResult)">📋 复制</button>
        </div>
      </div>

      <div class="divider"></div>

      <div class="convert-section">
        <h3 class="section-heading">日期时间 → 时间戳</h3>
        <div class="input-row">
          <input type="datetime-local" v-model="dtInput" class="form-input" step="1" @keydown.enter="dtToTs" />
          <button class="action-btn primary" @click="dtToTs">转换</button>
          <button class="action-btn" @click="useNowDt">当前时间</button>
        </div>
        <div v-if="dtError" class="error-msg">{{ dtError }}</div>
        <div v-if="dtResult" class="result-row">
          <span class="result-label">秒:</span>
          <span class="result-value mono">{{ dtResult }}</span>
          <button class="copy-btn-small" @click="copyText(dtResult)">📋</button>
          <span class="result-label" style="margin-left: 1rem">毫秒:</span>
          <span class="result-value mono">{{ dtResult * 1000 }}</span>
          <button class="copy-btn-small" @click="copyText(dtResult * 1000)">📋</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 800px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.now-bar { display: flex; gap: 1.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.now-item { display: flex; align-items: center; gap: 0.5rem; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.625rem 1rem; }
.now-label { color: var(--text-muted); font-size: 0.8rem; }
.now-value { color: var(--primary-color); font-family: var(--font-mono); font-size: 0.9rem; font-weight: 600; }
.copy-btn-small { padding: 0.2rem 0.4rem; background: transparent; border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.7rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.convert-section { margin-bottom: 0; }
.section-heading { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-color); }
.input-row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.form-input { flex: 1; min-width: 200px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; color: var(--text-color); font-size: 0.9rem; font-family: var(--font-mono); }
.form-input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.form-select-sm { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 0.5rem; color: var(--text-color); font-size: 0.85rem; }
.action-btn { padding: 0.75rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.divider { height: 1px; background: var(--border-color); margin: 1.5rem 0; }
.error-msg { color: #ef4444; font-size: 0.85rem; margin-top: 0.5rem; }
.result-row { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.75rem; padding: 0.75rem 1rem; background: var(--bg-color); border-radius: 6px; }
.result-label { color: var(--text-muted); font-size: 0.8rem; }
.result-value { color: var(--text-color); font-size: 0.9rem; }
.result-value.mono { font-family: var(--font-mono); color: var(--primary-color); font-weight: 600; }
@media (max-width: 600px) { .input-row { flex-direction: column; } .form-input { min-width: unset; } }
</style>
