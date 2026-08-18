<script setup>
import { computed, ref } from 'vue'
import { calculateCidr, parseCidr } from '~/src/utils/cidr.js'

const cidrInput = ref('192.168.1.0/24')
const copied = ref('')

const result = computed(() => {
  const parsed = parseCidr(cidrInput.value)
  if (!parsed) return null
  try {
    return calculateCidr(parsed)
  } catch {
    return null
  }
})

const errorText = computed(() => {
  if (!cidrInput.value.trim()) return ''
  return result.value ? '' : '请输入有效的 IPv4 或 CIDR，例如 192.168.1.10/24'
})

const rows = computed(() => {
  if (!result.value) return []
  return [
    { label: 'CIDR', value: result.value.cidr },
    { label: '网络地址', value: result.value.network },
    { label: '广播地址', value: result.value.broadcast },
    { label: '主机范围', value: result.value.hostRange },
    { label: '子网掩码', value: result.value.mask },
    { label: '通配符掩码', value: result.value.wildcard },
    { label: '地址总数', value: String(result.value.total) },
    { label: '可用主机数', value: String(result.value.usable) }
  ]
})

const copyText = async (text, key) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = key
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {}
}

const useExample = (value) => {
  cidrInput.value = value
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🧮 CIDR 计算器</h1>
    <div class="card">
      <div class="form-group">
        <label class="form-label">IPv4 / CIDR</label>
        <input
          v-model="cidrInput"
          class="form-input"
          placeholder="192.168.1.10/24"
        />
      </div>

      <div class="presets">
        <span class="presets-label">快速填入:</span>
        <button class="preset-btn" @click="useExample('192.168.1.0/24')">192.168.1.0/24</button>
        <button class="preset-btn" @click="useExample('10.0.0.0/8')">10.0.0.0/8</button>
        <button class="preset-btn" @click="useExample('172.16.0.0/12')">172.16.0.0/12</button>
        <button class="preset-btn" @click="useExample('10.0.0.1/32')">10.0.0.1/32</button>
      </div>

      <div v-if="errorText" class="error-msg">{{ errorText }}</div>

      <div v-if="result" class="result-grid">
        <div v-for="row in rows" :key="row.label" class="summary-item">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
          <button class="copy-btn" @click="copyText(row.value, row.label)">
            {{ copied === row.label ? '✓ 已复制' : '复制' }}
          </button>
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
.form-input { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; color: var(--text-color); font-family: var(--font-mono); }
.form-input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.presets { display: flex; gap: 0.375rem; flex-wrap: wrap; align-items: center; margin-top: 0.85rem; }
.presets-label { font-size: 0.8rem; color: var(--text-muted); }
.preset-btn { padding: 0.25rem 0.625rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.preset-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 1.25rem; }
.summary-item { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.85rem; }
.summary-item span { display: block; color: var(--text-muted); font-size: 0.76rem; margin-bottom: 0.35rem; }
.summary-item strong { color: var(--primary-color); word-break: break-all; display: block; }
.copy-btn { margin-top: 0.6rem; padding: 0.25rem 0.55rem; background: transparent; border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.copy-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.error-msg { margin-top: 1rem; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 8px; padding: 0.75rem; }
</style>
