<script setup>
import { ref, computed } from 'vue'

const inputValue = ref('')
const inputBase = ref(10)
const copied = ref('')

const bases = [
  { label: '二进制', value: 2, prefix: '0b' },
  { label: '八进制', value: 8, prefix: '0o' },
  { label: '十进制', value: 10, prefix: '' },
  { label: '十六进制', value: 16, prefix: '0x' }
]

const results = computed(() => {
  if (!inputValue.value.trim()) return {}
  const raw = inputValue.value.trim()

  let num
  if (inputBase.value === 10) {
    num = parseInt(raw, 10)
  } else if (inputBase.value === 16) {
    num = parseInt(raw.replace(/^0x/i, ''), 16)
  } else if (inputBase.value === 8) {
    num = parseInt(raw.replace(/^0o/, ''), 8)
  } else {
    num = parseInt(raw.replace(/^0b/, ''), 2)
  }

  if (isNaN(num)) return { error: '无效输入' }

  return {
    2: { label: '二进制', value: num.toString(2), prefix: '0b' },
    8: { label: '八进制', value: num.toString(8), prefix: '0o' },
    10: { label: '十进制', value: num.toString(10), prefix: '' },
    16: { label: '十六进制', value: num.toString(16).toUpperCase(), prefix: '0x' },
    error: null
  }
})

const displayValue = (base) => {
  const r = results.value[base]
  if (!r || results.value.error) return ''
  return r.prefix + r.value
}

const copyText = async (text, label) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = label
    setTimeout(() => copied.value = '', 2000)
  } catch {}
}

const clearAll = () => { inputValue.value = '' }
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔢 进制转换</h1>

    <div class="card">
      <div class="input-section">
        <div class="input-row">
          <input type="text" v-model="inputValue" class="form-input" placeholder="输入数值" />
          <select v-model.number="inputBase" class="form-select">
            <option :value="2">二进制</option>
            <option :value="8">八进制</option>
            <option :value="10">十进制</option>
            <option :value="16">十六进制</option>
          </select>
        </div>
      </div>

      <div v-if="results.error" class="error-msg">❌ {{ results.error }}</div>

      <div v-if="inputValue && !results.error" class="results-grid">
        <div v-for="base in [2, 8, 10, 16]" :key="base" class="result-card" :class="{ active: inputBase === base }">
          <div class="result-header">
            <span class="result-base">{{ bases.find(b => b.value === base).label }}</span>
            <button class="copy-btn-small" @click="copyText(displayValue(base), String(base))">
              {{ copied === String(base) ? '✓' : '📋' }}
            </button>
          </div>
          <div class="result-value">{{ displayValue(base) }}</div>
        </div>
      </div>

      <div class="clear-section">
        <button class="clear-btn" @click="clearAll">✕ 清空</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 700px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.input-section { margin-bottom: 1.25rem; }
.input-row { display: flex; gap: 0.75rem; }
.form-input { flex: 1; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; color: var(--text-color); font-size: 1rem; font-family: var(--font-mono); }
.form-input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.form-select { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; color: var(--text-color); font-size: 0.9rem; }
.error-msg { color: #ef4444; font-size: 0.85rem; margin-bottom: 1rem; }
.results-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
.result-card { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; }
.result-card.active { border-color: var(--primary-color); background: rgba(0, 217, 255, 0.05); }
.result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.result-base { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }
.copy-btn-small { padding: 0.15rem 0.4rem; background: transparent; border: 1px solid var(--border-color); border-radius: 3px; color: var(--text-muted); font-size: 0.65rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
.result-value { font-family: var(--font-mono); font-size: 1rem; color: var(--primary-color); font-weight: 600; word-break: break-all; }
.clear-section { text-align: center; }
.clear-btn { padding: 0.5rem 1.25rem; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; }
.clear-btn:hover { border-color: #ef4444; color: #ef4444; }
@media (max-width: 480px) { .results-grid { grid-template-columns: 1fr; } }
</style>
