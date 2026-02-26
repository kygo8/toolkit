<script setup>
import { ref } from 'vue'

const inputJson = ref('')
const outputJson = ref('')
const error = ref('')
const copied = ref(false)

const formatJson = () => {
  error.value = ''
  if (!inputJson.value.trim()) {
    outputJson.value = ''
    return
  }
  try {
    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed, null, 2)
  } catch (e) {
    error.value = e.message
    outputJson.value = ''
  }
}

const minifyJson = () => {
  error.value = ''
  if (!inputJson.value.trim()) {
    outputJson.value = ''
    return
  }
  try {
    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed)
  } catch (e) {
    error.value = e.message
    outputJson.value = ''
  }
}

const clearAll = () => {
  inputJson.value = ''
  outputJson.value = ''
  error.value = ''
}

const copyResult = async () => {
  if (!outputJson.value) return
  try {
    await navigator.clipboard.writeText(outputJson.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const handleInput = () => {
  if (!inputJson.value.trim()) {
    outputJson.value = ''
    error.value = ''
  }
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">{} JSON格式化</h1>
    
    <div class="card">
      <div class="editor-container">
        <div class="editor-section">
          <div class="editor-header">
            <span class="editor-title">输入 JSON</span>
            <span class="editor-hint">粘贴或输入 JSON 字符串</span>
          </div>
          <textarea 
            v-model="inputJson"
            @input="handleInput"
            class="editor-textarea"
            placeholder='{"key": "value"}'
          ></textarea>
        </div>

        <div class="actions">
          <button class="action-btn primary" @click="formatJson">
            ▶ 格式化
          </button>
          <button class="action-btn" @click="minifyJson">
            ▼ 压缩
          </button>
          <button class="action-btn" @click="clearAll">
            ✕ 清空
          </button>
        </div>

        <div class="editor-section">
          <div class="editor-header">
            <span class="editor-title">输出结果</span>
            <button 
              v-if="outputJson" 
              class="copy-btn-small"
              @click="copyResult"
            >
              {{ copied ? '✓ 已复制' : '📋 复制' }}
            </button>
          </div>
          <div v-if="error" class="error-message">
            ❌ {{ error }}
          </div>
          <textarea 
            :value="outputJson"
            readonly
            class="editor-textarea output"
            placeholder="格式化结果将显示在这里"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page {
  max-width: 900px;
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
  border-radius: 16px;
  padding: 1.5rem;
}

.editor-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;
}

.editor-hint {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.editor-textarea {
  width: 100%;
  min-height: 200px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-color);
  resize: vertical;
  line-height: 1.6;
}

.editor-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
}

.editor-textarea.output {
  color: var(--primary-color);
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ef4444;
  font-size: 0.875rem;
  font-family: var(--font-mono);
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
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

.action-btn.primary:hover {
  filter: brightness(1.1);
}

.copy-btn-small {
  padding: 0.375rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn-small:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

@media (max-width: 640px) {
  .editor-textarea {
    min-height: 150px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>
