<script setup>
import { ref, computed } from 'vue'

const textA = ref('')
const textB = ref('')

const diffLines = computed(() => {
  if (!textA.value && !textB.value) return []

  const linesA = textA.value.split('\n')
  const linesB = textB.value.split('\n')
  const maxLen = Math.max(linesA.length, linesB.length)
  const result = []

  for (let i = 0; i < maxLen; i++) {
    const a = linesA[i] ?? ''
    const b = linesB[i] ?? ''
    if (a === b) {
      result.push({ type: 'same', line: i + 1, text: a })
    } else {
      if (a) result.push({ type: 'removed', line: i + 1, text: a })
      if (b) result.push({ type: 'added', line: i + 1, text: b })
    }
  }

  return result
})

const stats = computed(() => {
  const removed = diffLines.value.filter(d => d.type === 'removed').length
  const added = diffLines.value.filter(d => d.type === 'added').length
  const same = diffLines.value.filter(d => d.type === 'same').length
  return { removed, added, same }
})

const clearAll = () => {
  textA.value = ''
  textB.value = ''
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">📄 文本对比</h1>

    <div class="card">
      <div class="input-area">
        <div class="text-panel">
          <label class="panel-label">原始文本</label>
          <textarea v-model="textA" class="panel-textarea" placeholder="输入原始文本..."></textarea>
        </div>
        <div class="text-panel">
          <label class="panel-label">修改文本</label>
          <textarea v-model="textB" class="panel-textarea" placeholder="输入修改后的文本..."></textarea>
        </div>
      </div>

      <div v-if="diffLines.length > 0" class="diff-section">
        <div class="diff-header">
          <span class="diff-title">对比结果</span>
          <div class="diff-stats">
            <span class="stat removed">-{{ stats.removed }}</span>
            <span class="stat added">+{{ stats.added }}</span>
            <span class="stat same">={{ stats.same }}</span>
          </div>
        </div>
        <div class="diff-list">
          <div
            v-for="(line, index) in diffLines"
            :key="index"
            class="diff-line"
            :class="line.type"
          >
            <span class="line-num">{{ line.line }}</span>
            <span class="line-symbol">{{ line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ' }}</span>
            <span class="line-text">{{ line.text }}</span>
          </div>
        </div>
      </div>

      <div class="clear-section">
        <button class="clear-btn" @click="clearAll">✕ 清空</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 900px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.input-area { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }
.text-panel { display: flex; flex-direction: column; gap: 0.375rem; }
.panel-label { font-size: 0.85rem; font-weight: 600; color: var(--text-color); }
.panel-textarea { min-height: 180px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-color); resize: vertical; line-height: 1.6; }
.panel-textarea:focus { outline: none; border-color: var(--primary-color); }
.diff-section { border-top: 1px solid var(--border-color); padding-top: 1.25rem; }
.diff-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.diff-title { font-weight: 600; font-size: 0.9rem; color: var(--text-color); }
.diff-stats { display: flex; gap: 0.75rem; }
.stat { font-size: 0.8rem; font-weight: 600; font-family: var(--font-mono); }
.stat.removed { color: #ef4444; }
.stat.added { color: #10b981; }
.stat.same { color: var(--text-muted); }
.diff-list { max-height: 400px; overflow-y: auto; font-family: var(--font-mono); font-size: 0.82rem; }
.diff-line { display: flex; gap: 0.5rem; padding: 0.2rem 0.75rem; line-height: 1.6; }
.diff-line.same { background: transparent; }
.diff-line.removed { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
.diff-line.added { background: rgba(16, 185, 129, 0.15); color: #6ee7b7; }
.line-num { min-width: 30px; text-align: right; color: var(--text-muted); opacity: 0.5; font-size: 0.75rem; }
.line-symbol { min-width: 14px; font-weight: 700; }
.line-text { flex: 1; word-break: break-all; white-space: pre-wrap; }
.clear-section { margin-top: 1rem; text-align: center; }
.clear-btn { padding: 0.5rem 1.25rem; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; }
.clear-btn:hover { border-color: #ef4444; color: #ef4444; }
@media (max-width: 640px) { .input-area { grid-template-columns: 1fr; } }
</style>
