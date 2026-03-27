<script setup>
import { ref, computed } from 'vue'

const title = ref('')
const description = ref('')
const keywords = ref('')
const canonical = ref('')
const author = ref('')
const copied = ref(false)

const titleLength = computed(() => title.value.length)
const descLength = computed(() => description.value.length)

const titleStatus = computed(() => {
  const len = titleLength.value
  if (len === 0) return { text: '未设置', color: '#666' }
  if (len < 30) return { text: '太短', color: '#ef4444' }
  if (len > 60) return { text: '太长', color: '#f59e0b' }
  return { text: '合适', color: '#10b981' }
})

const descStatus = computed(() => {
  const len = descLength.value
  if (len === 0) return { text: '未设置', color: '#666' }
  if (len < 120) return { text: '太短', color: '#ef4444' }
  if (len > 160) return { text: '太长', color: '#f59e0b' }
  return { text: '合适', color: '#10b981' }
})

const metaOutput = computed(() => {
  let result = ''
  if (title.value) {
    result += `<title>${title.value}</title>\n`
  }
  result += '<meta name="description" content="'
  result += description.value + '">\n'
  if (keywords.value) {
    result += '<meta name="keywords" content="'
    result += keywords.value + '">\n'
  }
  if (canonical.value) {
    result += '<link rel="canonical" href="'
    result += canonical.value + '">\n'
  }
  if (author.value) {
    result += '<meta name="author" content="'
    result += author.value + '">\n'
  }
  return result.trim()
})

const copyResult = async () => {
  if (!metaOutput.value) return
  try {
    await navigator.clipboard.writeText(metaOutput.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const clearAll = () => {
  title.value = ''
  description.value = ''
  keywords.value = ''
  canonical.value = ''
  author.value = ''
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">📝 Meta标签生成器</h1>
    
    <div class="card">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">
            页面标题 (Title)
            <span class="length-hint" :style="{ color: titleStatus.color }">
              {{ titleLength }}/60 - {{ titleStatus.text }}
            </span>
          </label>
          <input 
            type="text" 
            v-model="title"
            class="form-input"
            placeholder="输入页面标题，建议30-60个字符"
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            页面描述 (Description)
            <span class="length-hint" :style="{ color: descStatus.color }">
              {{ descLength }}/160 - {{ descStatus.text }}
            </span>
          </label>
          <textarea 
            v-model="description"
            class="form-textarea"
            placeholder="输入页面描述，建议120-160个字符"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">关键词 (Keywords)</label>
          <input 
            type="text" 
            v-model="keywords"
            class="form-input"
            placeholder="输入关键词，用逗号分隔"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Canonical URL</label>
          <input 
            type="url" 
            v-model="canonical"
            class="form-input"
            placeholder="https://example.com/page"
          />
        </div>

        <div class="form-group">
          <label class="form-label">作者 (Author)</label>
          <input 
            type="text" 
            v-model="author"
            class="form-input"
            placeholder="输入作者名称"
          />
        </div>
      </div>

      <div class="output-section">
        <div class="output-header">
          <span class="output-title">生成结果</span>
          <div class="output-actions">
            <button class="action-btn" @click="clearAll">清空</button>
            <button 
              class="action-btn primary" 
              @click="copyResult"
              :disabled="!metaOutput"
            >
              {{ copied ? '✓ 已复制' : '📋 复制代码' }}
            </button>
          </div>
        </div>
        <pre class="output-code">{{ metaOutput || '请在上方填写内容' }}</pre>
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

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.length-hint {
  font-size: 0.75rem;
  font-weight: 500;
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
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.output-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1.25rem;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.output-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;
}

.output-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 0.8rem;
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
  opacity: 0.5;
  cursor: not-allowed;
}

.output-code {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--primary-color);
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  min-height: 80px;
}
</style>
