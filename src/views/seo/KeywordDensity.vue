<script setup>
import { ref, computed } from 'vue'

const content = ref('')
const targetKeyword = ref('')
const results = ref([])

const analyze = () => {
  if (!content.value || !targetKeyword.value) {
    results.value = []
    return
  }
  
  const text = content.value.toLowerCase()
  const keyword = targetKeyword.value.toLowerCase()
  const wordCount = text.split(/\s+/).filter(w => w).length
  const keywordCount = (text.match(new RegExp(keyword, 'g')) || []).length
  const density = wordCount > 0 ? ((keywordCount / wordCount) * 100).toFixed(2) : 0
  
  const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim())
  const sentencesWithKeyword = sentences.filter(s => s.includes(keyword)).length
  
  results.value = [
    {
      label: '总词数',
      value: wordCount,
      status: wordCount > 300 ? 'good' : 'warning',
      hint: wordCount > 300 ? '符合要求' : '建议300词以上'
    },
    {
      label: '关键词出现次数',
      value: keywordCount,
      status: keywordCount > 0 ? 'good' : 'error',
      hint: '关键词出现次数'
    },
    {
      label: '关键词密度',
      value: density + '%',
      status: density >= 1 && density <= 3 ? 'good' : density < 1 ? 'warning' : 'error',
      hint: density >= 1 && density <= 3 ? '理想 (1-3%)' : density < 1 ? '偏低' : '偏高'
    },
    {
      label: '含关键词的句子数',
      value: sentencesWithKeyword + '/' + sentences.length,
      status: sentencesWithKeyword > 0 ? 'good' : 'error',
      hint: '建议至少1句包含关键词'
    }
  ]
}

const clearAll = () => {
  content.value = ''
  targetKeyword.value = ''
  results.value = []
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">📊 关键词密度分析</h1>
    
    <div class="card">
      <div class="input-section">
        <div class="form-group">
          <label class="form-label">目标关键词</label>
          <input 
            type="text" 
            v-model="targetKeyword"
            class="form-input"
            placeholder="输入要分析的关键词"
            @input="analyze"
          />
        </div>

        <div class="form-group">
          <label class="form-label">文章内容</label>
          <textarea 
            v-model="content"
            class="form-textarea"
            placeholder="粘贴文章内容..."
            @input="analyze"
          ></textarea>
        </div>
      </div>

      <div v-if="results.length > 0" class="results-section">
        <h3 class="results-title">分析结果</h3>
        <div class="results-grid">
          <div 
            v-for="(item, index) in results" 
            :key="index"
            class="result-card"
            :class="item.status"
          >
            <div class="result-label">{{ item.label }}</div>
            <div class="result-value">{{ item.value }}</div>
            <div class="result-hint">{{ item.hint }}</div>
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
}

.form-textarea {
  min-height: 150px;
  resize: vertical;
  line-height: 1.6;
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

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.result-card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.result-card.good {
  border-color: #10b981;
}

.result-card.warning {
  border-color: #f59e0b;
}

.result-card.error {
  border-color: #ef4444;
}

.result-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  font-family: var(--font-mono);
}

.result-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
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
