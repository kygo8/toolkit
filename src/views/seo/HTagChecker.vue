<script setup>
import { ref, computed } from 'vue'

const htmlContent = ref('')
const results = ref([])

const analyze = () => {
  if (!htmlContent.value) {
    results.value = []
    return
  }

  const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  const found = []

  tags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'gi')
    const matches = []
    let match
    while ((match = regex.exec(htmlContent.value)) !== null) {
      matches.push(match[1].trim())
    }
    if (matches.length > 0) {
      found.push({ tag: tag.toUpperCase(), count: matches.length, texts: matches })
    }
  })

  const issues = []

  const h1Count = found.find(f => f.tag === 'H1')?.count || 0
  if (h1Count === 0) {
    issues.push({ type: 'error', msg: '缺少 H1 标签，建议每个页面只有一个 H1' })
  } else if (h1Count > 1) {
    issues.push({ type: 'warning', msg: `H1 标签出现 ${h1Count} 次，建议每个页面只有一个 H1` })
  } else {
    issues.push({ type: 'success', msg: 'H1 标签使用正确' })
  }

  const h2Count = found.find(f => f.tag === 'H2')?.count || 0
  if (h2Count === 0) {
    issues.push({ type: 'warning', msg: '建议添加 H2 标题来组织内容' })
  }

  if (found.length === 0) {
    issues.push({ type: 'error', msg: '未找到任何 H 标签' })
  }

  results.value = { found, issues }
}

const clearAll = () => {
  htmlContent.value = ''
  results.value = []
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title"># H标签结构检查</h1>
    
    <div class="card">
      <div class="input-section">
        <label class="form-label">输入HTML内容</label>
        <textarea 
          v-model="htmlContent"
          class="form-textarea"
          placeholder="<h1>主标题</h1>
<h2>章节标题</h2>
<h3>小节标题</h3>"
          @input="analyze"
        ></textarea>
      </div>

      <div v-if="results.issues?.length > 0" class="results-section">
        <h3 class="results-title">检查结果</h3>
        
        <div class="issues-list">
          <div 
            v-for="(issue, index) in results.issues" 
            :key="index"
            class="issue-item"
            :class="issue.type"
          >
            <span class="issue-icon">
              {{ issue.type === 'success' ? '✓' : issue.type === 'warning' ? '⚠' : '✕' }}
            </span>
            <span class="issue-msg">{{ issue.msg }}</span>
          </div>
        </div>

        <div v-if="results.found?.length > 0" class="tags-summary">
          <h4 class="summary-title">标签统计</h4>
          <div class="tags-grid">
            <div 
              v-for="item in results.found" 
              :key="item.tag"
              class="tag-card"
            >
              <span class="tag-name">{{ item.tag }}</span>
              <span class="tag-count">{{ item.count }}</span>
            </div>
          </div>

          <div class="tag-details">
            <div 
              v-for="item in results.found" 
              :key="item.tag"
              class="detail-group"
            >
              <div class="detail-header">{{ item.tag }} 标签内容 ({{ item.count }}个)</div>
              <div 
                v-for="(text, i) in item.texts" 
                :key="i"
                class="detail-item"
              >
                {{ text || '(空)' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="action-btn" @click="clearAll">清空</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page {
  max-width: 800px;
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

.input-section {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.form-textarea {
  width: 100%;
  min-height: 150px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  color: var(--text-color);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  resize: vertical;
  line-height: 1.6;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
}

.results-section {
  margin-bottom: 1.5rem;
}

.results-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.issue-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.issue-item.success {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.issue-item.warning {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.issue-item.error {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.issue-icon {
  font-size: 1rem;
}

.tags-summary {
  border-top: 1px solid var(--border-color);
  padding-top: 1.25rem;
}

.summary-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.tags-grid {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.tag-card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tag-name {
  font-weight: 600;
  color: var(--primary-color);
  font-family: var(--font-mono);
}

.tag-count {
  background: var(--primary-color);
  color: var(--bg-color);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.tag-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-group {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.detail-header {
  padding: 0.75rem 1rem;
  background: rgba(0, 217, 255, 0.1);
  font-weight: 500;
  font-size: 0.85rem;
  color: var(--primary-color);
}

.detail-item {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
}

.detail-item:last-child {
  border-bottom: none;
}

.actions {
  display: flex;
  justify-content: center;
}

.action-btn {
  padding: 0.625rem 1.5rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}
</style>
