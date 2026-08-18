<script setup>
import { computed, ref } from 'vue'
import { describeCron, nextCronRuns } from '~/src/utils/cron.js'

const expression = ref('*/5 * * * *')
const count = ref(5)
const copied = ref('')

const description = computed(() => describeCron(expression.value, 'zh-CN'))
const upcoming = computed(() => nextCronRuns(expression.value, count.value))
const error = computed(() => description.value.error || upcoming.value.error || '')

const formatRun = (date) => date.toLocaleString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
})

const copyText = async (text, key) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = key
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {}
}

const clearAll = () => { expression.value = '' }
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">⏱ Cron 解析</h1>

    <div class="card">
      <div class="input-row">
        <input
          v-model="expression"
          type="text"
          class="form-input"
          placeholder="输入 5 或 6 段 Cron 表达式，例如 */5 * * * *"
        />
        <select v-model.number="count" class="form-select-sm">
          <option :value="5">5 次</option>
          <option :value="10">10 次</option>
          <option :value="20">20 次</option>
        </select>
        <button class="clear-btn" @click="clearAll">✕ 清空</button>
      </div>

      <div v-if="error" class="error-msg">❌ {{ error }}</div>

      <div v-else-if="expression.trim()" class="result-section">
        <div class="desc-box">
          <div class="section-header">
            <span class="section-title">可读描述</span>
            <button class="copy-btn-small" @click="copyText(description.text, 'desc')">
              {{ copied === 'desc' ? '✓ 已复制' : '📋 复制' }}
            </button>
          </div>
          <p class="desc-text">{{ description.text }}</p>
        </div>

        <div class="runs-box">
          <div class="section-header">
            <span class="section-title">接下来 {{ upcoming.runs.length }} 次运行</span>
          </div>
          <div class="run-list">
            <div v-for="(run, index) in upcoming.runs" :key="index" class="run-item">
              <span class="run-index">{{ index + 1 }}</span>
              <span class="run-value">{{ formatRun(run) }}</span>
              <span class="run-iso">{{ run.toISOString() }}</span>
              <button class="copy-btn-small" @click="copyText(run.toISOString(), String(index))">
                {{ copied === String(index) ? '✓' : '📋' }}
              </button>
            </div>
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
.input-row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.25rem; }
.form-input { flex: 1; min-width: 220px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; color: var(--text-color); font-size: 0.9rem; font-family: var(--font-mono); }
.form-input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.form-select-sm { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 0.5rem; color: var(--text-color); font-size: 0.85rem; }
.clear-btn { padding: 0.75rem 1rem; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; }
.clear-btn:hover { border-color: #ef4444; color: #ef4444; }
.error-msg { color: #ef4444; font-size: 0.85rem; font-family: var(--font-mono); }
.result-section { display: flex; flex-direction: column; gap: 1rem; }
.desc-box, .runs-box { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
.section-header { display: flex; justify-content: space-between; align-items: center; padding: 0.625rem 1rem; border-bottom: 1px solid var(--border-color); }
.section-title { font-weight: 600; font-size: 0.85rem; color: var(--primary-color); }
.desc-text { margin: 0; padding: 1rem; color: var(--text-color); line-height: 1.6; }
.run-list { display: flex; flex-direction: column; }
.run-item { display: grid; grid-template-columns: 28px 1fr 1fr auto; gap: 0.5rem; align-items: center; padding: 0.6rem 1rem; border-top: 1px solid var(--border-color); font-family: var(--font-mono); font-size: 0.82rem; }
.run-item:first-child { border-top: none; }
.run-index { color: var(--text-muted); }
.run-value { color: var(--text-color); }
.run-iso { color: var(--text-muted); word-break: break-all; }
.copy-btn-small { padding: 0.25rem 0.5rem; background: transparent; border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
@media (max-width: 700px) {
  .run-item { grid-template-columns: 24px 1fr auto; }
  .run-iso { display: none; }
}
</style>
