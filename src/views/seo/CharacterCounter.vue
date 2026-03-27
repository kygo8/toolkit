<script setup>
import { ref, computed } from 'vue'

const text = ref('')
const mode = ref('title')

const charCounts = computed(() => {
  const chars = text.value.length
  const charsNoSpaces = text.value.replace(/\s/g, '').length
  const words = text.value.trim() ? text.value.trim().split(/\s+/).length : 0
  return { chars, charsNoSpaces, words }
})

const limits = computed(() => {
  const limits = {
    title: { min: 30, max: 60, label: '标题' },
    description: { min: 120, max: 160, label: '描述' },
    h1: { min: 20, max: 70, label: 'H1标题' },
    h2: { min: 20, max: 70, label: 'H2标题' },
    body: { min: 300, max: null, label: '正文' }
  }
  return limits[mode.value]
})

const status = computed(() => {
  const len = charCounts.value.chars
  const limit = limits.value
  
  if (limit.max) {
    if (len < limit.min) return { text: '太短', color: '#ef4444' }
    if (len > limit.max) return { text: '太长', color: '#f59e0b' }
    return { text: '合适', color: '#10b981' }
  } else {
    if (len < limit.min) return { text: '偏短', color: '#f59e0b' }
    return { text: '合适', color: '#10b981' }
  }
})

const copyText = async () => {
  if (!text.value) return
  try {
    await navigator.clipboard.writeText(text.value)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const clearText = () => {
  text.value = ''
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔢 字符计数器</h1>
    
    <div class="card">
      <div class="mode-tabs">
        <button 
          v-for="(item, key) in { title: '标题', description: '描述', h1: 'H1', h2: 'H2', body: '正文' }"
          :key="key"
          class="mode-tab"
          :class="{ active: mode === key }"
          @click="mode = key"
        >
          {{ item }}
        </button>
      </div>

      <div class="input-section">
        <textarea 
          v-model="text"
          class="form-textarea"
          placeholder="输入要统计的文本..."
        ></textarea>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">字符数</div>
          <div class="stat-value">{{ charCounts.chars }}</div>
          <div class="stat-limit" :style="{ color: status.color }">
            建议: {{ limits.min }}-{{ limits.max || '不限' }}
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-label">字符数(不含空格)</div>
          <div class="stat-value">{{ charCounts.charsNoSpaces }}</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-label">单词数</div>
          <div class="stat-value">{{ charCounts.words }}</div>
        </div>
        
        <div class="stat-card highlight" :class="status.text === '合适' ? 'good' : 'warning'">
          <div class="stat-label">状态</div>
          <div class="stat-value">{{ status.text }}</div>
        </div>
      </div>

      <div class="actions">
        <button class="action-btn" @click="copyText">📋 复制</button>
        <button class="action-btn" @click="clearText">✕ 清空</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page {
  max-width: 700px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-family: var(--font-mono);
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.mode-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.mode-tab {
  padding: 0.5rem 1rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-tab.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--bg-color);
}

.mode-tab:not(.active):hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.input-section {
  margin-bottom: 1.25rem;
}

.form-textarea {
  width: 100%;
  min-height: 120px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  color: var(--text-color);
  font-size: 0.9rem;
  resize: vertical;
  line-height: 1.6;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.stat-card.highlight.good {
  border-color: #10b981;
}

.stat-card.highlight.warning {
  border-color: #f59e0b;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  font-family: var(--font-mono);
}

.stat-limit {
  font-size: 0.7rem;
  margin-top: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.action-btn {
  padding: 0.625rem 1.5rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
</style>
