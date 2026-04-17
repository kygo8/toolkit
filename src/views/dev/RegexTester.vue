<script setup>
import { ref, computed } from 'vue'

const pattern = ref('')
const flags = ref('g')
const testStr = ref('')
const replaceStr = ref('')
const error = ref('')

const matches = computed(() => {
  if (!pattern.value || !testStr.value) return []
  error.value = ''
  try {
    const regex = new RegExp(pattern.value, flags.value)
    const results = []
    let match
    const re = new RegExp(pattern.value, flags.value.includes('g') ? flags.value : flags.value + 'g')
    while ((match = re.exec(testStr.value)) !== null) {
      results.push({ value: match[0], index: match.index, groups: match.slice(1) })
      if (!flags.value.includes('g')) break
    }
    return results
  } catch (e) {
    error.value = e.message
    return []
  }
})

const highlightedText = computed(() => {
  if (!pattern.value || !testStr.value || matches.value.length === 0) return testStr.value
  let result = ''
  let lastIndex = 0
  for (const m of matches.value) {
    result += escapeHtml(testStr.value.slice(lastIndex, m.index))
    result += `<mark>${escapeHtml(m.value)}</mark>`
    lastIndex = m.index + m.value.length
  }
  result += escapeHtml(testStr.value.slice(lastIndex))
  return result
})

const replacedText = computed(() => {
  if (!pattern.value || !testStr.value || !replaceStr.value) return ''
  try {
    return testStr.value.replace(new RegExp(pattern.value, flags.value), replaceStr.value)
  } catch { return '' }
})

const escapeHtml = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')

const commonPatterns = [
  { label: 'Email', value: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { label: 'URL', value: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-.,@?^=%&:/~+#]*' },
  { label: '手机号', value: '1[3-9]\\d{9}' },
  { label: 'IP', value: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
  { label: '日期', value: '\\d{4}[-/]\\d{2}[-/]\\d{2}' },
  { label: '中文', value: '[\\u4e00-\\u9fa5]+' }
]

const usePattern = (p) => { pattern.value = p }
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔍 正则测试</h1>

    <div class="card">
      <div class="regex-input">
        <div class="regex-row">
          <span class="regex-slash">/</span>
          <input type="text" v-model="pattern" class="regex-pattern" placeholder="输入正则表达式" />
          <span class="regex-slash">/</span>
          <input type="text" v-model="flags" class="regex-flags" placeholder="gi" />
        </div>
      </div>

      <div class="common-patterns">
        <span class="patterns-label">常用:</span>
        <button v-for="p in commonPatterns" :key="p.label" class="pattern-btn" @click="usePattern(p.value)">{{ p.label }}</button>
      </div>

      <div class="test-section">
        <label class="section-label">测试文本</label>
        <textarea v-model="testStr" class="form-textarea" placeholder="输入要匹配的文本..."></textarea>
      </div>

      <div class="result-section">
        <label class="section-label">匹配结果 <span v-if="matches.length" class="match-count">{{ matches.length }} 个匹配</span></label>
        <div v-if="error" class="error-msg">❌ {{ error }}</div>
        <div v-else-if="testStr" class="highlighted" v-html="highlightedText"></div>
        <div v-else class="placeholder">在上方输入测试文本</div>
      </div>

      <div v-if="matches.length > 0" class="matches-list">
        <div v-for="(m, i) in matches" :key="i" class="match-item">
          <span class="match-index">#{{ i + 1 }}</span>
          <span class="match-value">{{ m.value }}</span>
          <span class="match-pos">位置 {{ m.index }}</span>
          <span v-if="m.groups.length" class="match-groups">分组: {{ m.groups.join(', ') }}</span>
        </div>
      </div>

      <div class="replace-section">
        <label class="section-label">替换</label>
        <div class="replace-row">
          <input type="text" v-model="replaceStr" class="form-input" placeholder="替换字符串 ($1, $2...)" />
        </div>
        <div v-if="replacedText" class="replace-result">{{ replacedText }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 800px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.regex-input { margin-bottom: 0.75rem; }
.regex-row { display: flex; align-items: center; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0 0.75rem; }
.regex-row:focus-within { border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.regex-slash { color: var(--primary-color); font-size: 1.25rem; font-family: var(--font-mono); font-weight: 700; }
.regex-pattern { flex: 1; background: transparent; border: none; padding: 0.75rem 0.5rem; color: var(--text-color); font-family: var(--font-mono); font-size: 0.95rem; outline: none; }
.regex-flags { width: 50px; background: transparent; border: none; padding: 0.75rem 0.25rem; color: #f59e0b; font-family: var(--font-mono); font-size: 0.95rem; outline: none; }
.common-patterns { display: flex; gap: 0.375rem; flex-wrap: wrap; margin-bottom: 1.25rem; align-items: center; }
.patterns-label { font-size: 0.8rem; color: var(--text-muted); margin-right: 0.25rem; }
.pattern-btn { padding: 0.25rem 0.625rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.pattern-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.section-label { display: block; font-weight: 600; font-size: 0.85rem; color: var(--text-color); margin-bottom: 0.5rem; }
.match-count { color: var(--primary-color); font-weight: 500; font-size: 0.8rem; }
.test-section { margin-bottom: 1rem; }
.form-textarea { width: 100%; min-height: 100px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-color); resize: vertical; line-height: 1.6; }
.form-textarea:focus { outline: none; border-color: var(--primary-color); }
.result-section { margin-bottom: 1rem; }
.highlighted { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; word-break: break-all; white-space: pre-wrap; color: var(--text-color); }
.highlighted :deep(mark) { background: rgba(0, 217, 255, 0.3); color: var(--primary-color); border-radius: 2px; padding: 0 2px; }
.placeholder { color: var(--text-muted); font-size: 0.85rem; }
.error-msg { color: #ef4444; font-size: 0.85rem; }
.matches-list { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 1.25rem; }
.match-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.375rem 0.75rem; background: var(--bg-color); border-radius: 4px; font-size: 0.82rem; }
.match-index { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem; }
.match-value { color: var(--primary-color); font-family: var(--font-mono); }
.match-pos { color: var(--text-muted); font-size: 0.75rem; }
.match-groups { color: #f59e0b; font-size: 0.75rem; }
.replace-section { border-top: 1px solid var(--border-color); padding-top: 1rem; }
.replace-row { margin-bottom: 0.5rem; }
.form-input { width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.5rem 0.75rem; color: var(--text-color); font-size: 0.85rem; font-family: var(--font-mono); }
.form-input:focus { outline: none; border-color: var(--primary-color); }
.replace-result { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.75rem 1rem; font-family: var(--font-mono); font-size: 0.85rem; color: #10b981; word-break: break-all; white-space: pre-wrap; }
</style>
