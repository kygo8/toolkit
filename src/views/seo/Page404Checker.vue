<script setup>
import { ref } from 'vue'

const urls = ref('')
const results = ref([])
const isChecking = ref(false)

const checkUrls = async () => {
  if (!urls.value.trim()) return

  isChecking.value = true
  results.value = []

  const urlList = urls.value.split('\n').map(u => u.trim()).filter(u => u)

  for (const url of urlList) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      const is404 = response.status === 404
      results.value.push({
        url,
        status: response.status,
        ok: !is404,
        is404
      })
    } catch (error) {
      results.value.push({
        url,
        status: 0,
        statusText: error.name === 'AbortError' ? '请求超时' : '无法访问',
        ok: false,
        is404: false
      })
    }
  }

  isChecking.value = false
}

const clearAll = () => {
  urls.value = ''
  results.value = []
}

const exportResults = () => {
  if (results.value.length === 0) return

  const content = results.value
    .map(r => `${r.ok ? '✓' : '✕'} ${r.url} - ${r.status || r.statusText}`)
    .join('\n')

  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '404-check-report.txt'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔍 404页面检查</h1>

    <div class="card">
      <div class="input-section">
        <label class="form-label">输入要检查的URL（每行一个）</label>
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
          @click="checkUrls"
          :disabled="isChecking || !urls.trim()"
        >
          {{ isChecking ? '检查中...' : '🔍 开始检查' }}
        </button>
        <button class="action-btn" @click="clearAll">清空</button>
      </div>

      <div v-if="results.length > 0" class="results-section">
        <div class="results-summary">
          <span class="summary-item success">正常: {{ results.filter(r => r.ok && !r.is404).length }}</span>
          <span class="summary-item error">404错误: {{ results.filter(r => r.is404).length }}</span>
          <span class="summary-item warning">其他错误: {{ results.filter(r => !r.ok && !r.is404).length }}</span>
        </div>

        <button v-if="results.some(r => r.is404)" class="export-btn" @click="exportResults">
          📥 导出404报告
        </button>

        <div class="results-list">
          <div
            v-for="(result, index) in results"
            :key="index"
            class="result-item"
            :class="{ error: result.is404, warning: !result.ok && !result.is404 }"
          >
            <span class="result-status" :class="{ error: result.is404, warning: !result.ok && !result.is404 }">
              {{ result.is404 ? '404' : result.status || result.statusText }}
            </span>
            <span class="result-url">{{ result.url }}</span>
            <span class="result-badge" :class="{ error: result.is404, success: !result.is404 && result.ok }">
              {{ result.is404 ? '✕ 死链' : result.ok ? '✓ 正常' : '⚠ 错误' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="tips">
      <h4>💡 使用提示</h4>
      <ul>
        <li>输入完整的URL地址，包括 https://</li>
        <li>每行一个URL</li>
        <li>404错误表示页面不存在，建议设置友好的404错误页面</li>
        <li>由于浏览器安全限制，部分URL可能无法检测</li>
      </ul>
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
  flex-wrap: wrap;
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

.summary-item.warning {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.export-btn {
  margin-bottom: 1rem;
  padding: 0.625rem 1rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.result-item.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.result-item.warning {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
}

.result-status {
  min-width: 60px;
  text-align: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--font-mono);
}

.result-status.error {
  background: #ef4444;
  color: white;
}

.result-status.warning {
  background: #f59e0b;
  color: white;
}

.result-url {
  flex: 1;
  font-size: 0.85rem;
  color: var(--text-color);
  font-family: var(--font-mono);
  word-break: break-all;
}

.result-badge {
  font-size: 0.8rem;
  white-space: nowrap;
}

.result-badge.error {
  color: #ef4444;
}

.result-badge.success {
  color: #10b981;
}

.tips {
  margin-top: 1.25rem;
  padding: 1rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.tips h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-color);
}

.tips ul {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.8;
}
</style>
