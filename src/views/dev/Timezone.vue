<script setup>
import { computed, ref } from 'vue'
import { convertAcrossTimezones } from '~/src/utils/timezone.js'

const pad = (value) => String(value).padStart(2, '0')
const toLocalInput = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

const datetime = ref(toLocalInput(new Date()))
const copied = ref('')

const sourceDate = computed(() => {
  if (!datetime.value) return null
  const date = new Date(datetime.value)
  return Number.isNaN(date.getTime()) ? null : date
})

const rows = computed(() => (sourceDate.value ? convertAcrossTimezones(sourceDate.value) : []))
const unix = computed(() => (sourceDate.value ? Math.floor(sourceDate.value.getTime() / 1000) : ''))
const utcIso = computed(() => (sourceDate.value ? sourceDate.value.toISOString() : ''))

const useNow = () => { datetime.value = toLocalInput(new Date()) }

const copyText = async (text, key) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(String(text))
    copied.value = key
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {}
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🌍 时区转换</h1>

    <div class="card">
      <div class="input-row">
        <input v-model="datetime" type="datetime-local" step="1" class="form-input" />
        <button class="action-btn" @click="useNow">当前时间</button>
      </div>

      <div v-if="sourceDate" class="meta-row">
        <div class="meta-item">
          <span class="meta-label">Unix</span>
          <span class="meta-value">{{ unix }}</span>
          <button class="copy-btn-small" @click="copyText(unix, 'unix')">{{ copied === 'unix' ? '✓' : '📋' }}</button>
        </div>
        <div class="meta-item">
          <span class="meta-label">UTC ISO</span>
          <span class="meta-value">{{ utcIso }}</span>
          <button class="copy-btn-small" @click="copyText(utcIso, 'iso')">{{ copied === 'iso' ? '✓' : '📋' }}</button>
        </div>
      </div>

      <div v-if="rows.length" class="zone-list">
        <div v-for="row in rows" :key="row.id" class="zone-item">
          <div class="zone-name">{{ row.label }}</div>
          <div class="zone-local">{{ row.local }} <span class="zone-offset">{{ row.offset }}</span></div>
          <div class="zone-iso">{{ row.iso }}</div>
          <div class="zone-unix">{{ row.unix }}</div>
          <button class="copy-btn-small" @click="copyText(row.iso, row.id)">{{ copied === row.id ? '✓' : '📋' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 900px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.input-row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 1rem; }
.form-input { flex: 1; min-width: 220px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; color: var(--text-color); font-size: 0.9rem; font-family: var(--font-mono); }
.form-input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.action-btn { padding: 0.75rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); cursor: pointer; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.meta-row { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem; }
.meta-item { display: flex; align-items: center; gap: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.5rem 0.75rem; }
.meta-label { color: var(--text-muted); font-size: 0.75rem; }
.meta-value { font-family: var(--font-mono); font-size: 0.82rem; color: var(--primary-color); word-break: break-all; }
.zone-list { display: flex; flex-direction: column; gap: 0.4rem; }
.zone-item { display: grid; grid-template-columns: 170px 1.2fr 1.3fr 90px auto; gap: 0.5rem; align-items: center; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.65rem 0.85rem; font-size: 0.8rem; font-family: var(--font-mono); }
.zone-name { color: var(--primary-color); font-weight: 600; }
.zone-local, .zone-iso { color: var(--text-color); word-break: break-all; }
.zone-offset { color: var(--text-muted); }
.zone-unix { color: var(--text-muted); }
.copy-btn-small { padding: 0.2rem 0.45rem; background: transparent; border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.7rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
@media (max-width: 800px) {
  .zone-item { grid-template-columns: 1fr auto; }
  .zone-iso, .zone-unix { display: none; }
}
</style>
