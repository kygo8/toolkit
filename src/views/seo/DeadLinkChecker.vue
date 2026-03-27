<script setup>
import { ref } from 'vue'

const urls = ref('')
const results = ref([])
const isChecking = ref(false)

const checkLinks = async () => {
  if (!urls.value.trim()) return
  
  isChecking.value = true
  results.value = []
  
  const urlList = urls.value.split('\n').map(u => u.trim()).filter(u => u)
  
  for (const url of urlList) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors'
      })
      clearTimeout(timeoutId)
      
      results.value.push({
        url,
        status: 200,
        statusText: '可访问',
        ok: true
      })
    } catch (error) {
      results.value.push({
        url,
        status: 0,
        statusText: error.name === 'AbortError' ? '超时' : '无法访问',
        ok: false
      })
    }
  }
  
  isChecking.value = false
}

const clearAll = () => {
  urls.value = ''
  results.value = []
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔗 死链检测</h1>
    
    <div class="card">
      <div class="input-section">
        <label class="form-label">输入要检测的URL（每行一个）</label>
        <textarea 
          v-model="urls"
          class="form-textarea"
          placeholder="https://example.com/page1
https://example.com/page2
https://example.com/page3"
        ></textarea>
      </div>

      <div class="actions">
        <button 
          class="action-btn primary" 
          @click="checkLinks"
          :disabled="isChecking || !urls.trim()"
        >
          {{ isChecking ? '检测中...' : '🔍 开始检测' }}
        </button>
        <button class="action-btn" @click="clearAll">清空</button>
      </div>

      <div v-if="results.length > 0" class="results-section">
        <div class="results-summary">
          <span class="summary-item success">有效: {{ results.filter(r => r.ok).length }}</span>
          <span class="summary-item error">无效: {{ results.filter(r => !r.ok).length }}</span>
        </div>
        
        <div class="results-list">
          <div 
            v-for="(result, index) in results" 
            :key="index"
            class="result-item"
            :class="{ error: !result.ok }"
          >
            <span class="result-url">{{ result.url }}</span>
            <span class="result-status" :class="{ error: !result.ok }">
              {{ result.statusText }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="notice">
      <p>⚠️ 注意：由于浏览器安全限制，此工具只能进行基础检测。推荐使用专业的SEO工具进行完整检测。</p>
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
  margin-bottom: 1.25rem;
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
  font-size: 0.85rem;
  font-family: var(--font-mono);
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-btn.primary {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--bg-color);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.results-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1.25rem;
}

.results-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.summary-item {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.summary-item.success {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.summary-item.error {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.result-item.error {
  border-color: #ef4444;
}

.result-url {
  font-size: 0.85rem;
  color: var(--text-color);
  font-family: var(--font-mono);
  word-break: break-all;
}

.result-status {
  font-size: 0.8rem;
  color: #10b981;
  white-space: nowrap;
  margin-left: 1rem;
}

.result-status.error {
  color: #ef4444;
}

.notice {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid #f59e0b;
  border-radius: 8px;
}

.notice p {
  font-size: 0.85rem;
  color: #f59e0b;
  margin: 0;
}
</style>
