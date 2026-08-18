<script setup>
import { computed, ref } from 'vue'
import { convertAllCases } from '~/src/utils/caseConvert.js'

const input = ref('helloWorldExample')
const copied = ref('')

const variants = [
  { key: 'camelCase', label: 'camelCase' },
  { key: 'pascalCase', label: 'PascalCase' },
  { key: 'snakeCase', label: 'snake_case' },
  { key: 'kebabCase', label: 'kebab-case' },
  { key: 'constantCase', label: 'CONSTANT_CASE' },
  { key: 'titleCase', label: 'Title Case' }
]

const results = computed(() => convertAllCases(input.value))

const copyText = async (text, key) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = key
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {}
}

const clearAll = () => { input.value = '' }
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">Aa 大小写转换</h1>

    <div class="card">
      <div class="input-section">
        <label class="form-label">输入文本</label>
        <textarea
          v-model="input"
          class="form-textarea"
          placeholder="输入 camelCase、snake_case、kebab-case 或普通文本..."
        ></textarea>
      </div>

      <div class="results-grid">
        <div v-for="variant in variants" :key="variant.key" class="result-card">
          <div class="result-header">
            <span class="result-label">{{ variant.label }}</span>
            <button class="copy-btn-small" @click="copyText(results[variant.key], variant.key)">
              {{ copied === variant.key ? '✓ 已复制' : '📋 复制' }}
            </button>
          </div>
          <div class="result-value">{{ results[variant.key] || '—' }}</div>
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
.input-section { margin-bottom: 1.25rem; }
.form-label { display: block; font-weight: 500; color: var(--text-color); font-size: 0.9rem; margin-bottom: 0.5rem; }
.form-textarea { width: 100%; min-height: 90px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-color); resize: vertical; line-height: 1.6; }
.form-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem; }
.result-card { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
.result-header { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.875rem; border-bottom: 1px solid var(--border-color); }
.result-label { font-weight: 600; font-size: 0.8rem; color: var(--primary-color); font-family: var(--font-mono); }
.result-value { padding: 0.75rem 0.875rem; font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-color); word-break: break-all; min-height: 2.75rem; }
.copy-btn-small { padding: 0.25rem 0.5rem; background: transparent; border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
.clear-section { text-align: center; }
.clear-btn { padding: 0.5rem 1.25rem; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; }
.clear-btn:hover { border-color: #ef4444; color: #ef4444; }
</style>
