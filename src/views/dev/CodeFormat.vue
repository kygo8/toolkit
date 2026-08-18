<script setup>
import { ref } from 'vue'
import { formatCss, formatJavaScript, minifyCss, minifyJavaScript } from '../../utils/code-format.js'
import { useConvertTool } from '../../utils/useConvertTool.js'

const language = ref('javascript')
const indent = ref('2')
const { input, output, error, copied, run, clearAll, copyResult } = useConvertTool()

const switchLanguage = (nextLanguage) => {
  language.value = nextLanguage
  output.value = ''
  error.value = ''
}

const beautify = () => {
  run((value) => (
    language.value === 'css'
      ? formatCss(value, indent.value)
      : formatJavaScript(value, indent.value)
  ))
}

const minify = () => {
  run((value) => (language.value === 'css' ? minifyCss(value) : minifyJavaScript(value)))
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">💻 代码格式化</h1>

    <div class="card">
      <div class="mode-tabs">
        <button class="mode-tab" :class="{ active: language === 'javascript' }" @click="switchLanguage('javascript')">
          JavaScript
        </button>
        <button class="mode-tab" :class="{ active: language === 'css' }" @click="switchLanguage('css')">
          CSS
        </button>
      </div>

      <div class="editor-container">
        <div class="editor-section">
          <div class="editor-header">
            <span class="editor-title">{{ language === 'css' ? '输入 CSS' : '输入 JavaScript' }}</span>
            <select v-model="indent" class="form-select-sm">
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tabs</option>
            </select>
          </div>
          <textarea
            v-model="input"
            class="editor-textarea"
            :placeholder="language === 'css' ? '.card { color: #00d9ff; }' : 'function hello(name) { return name }'"
            @keydown.ctrl.enter="beautify"
            @keydown.meta.enter="beautify"
          ></textarea>
        </div>

        <div class="actions">
          <button class="action-btn primary" @click="beautify">▶ 格式化</button>
          <button class="action-btn" @click="minify">▼ 压缩</button>
          <button class="action-btn" @click="clearAll">✕ 清空</button>
        </div>

        <div class="editor-section">
          <div class="editor-header">
            <span class="editor-title">输出结果</span>
            <button v-if="output" class="copy-btn-small" @click="copyResult">
              {{ copied ? '✓ 已复制' : '📋 复制' }}
            </button>
          </div>
          <div v-if="error" class="error-message">❌ {{ error }}</div>
          <textarea :value="output" readonly class="editor-textarea output" placeholder="格式化结果将显示在这里"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 900px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem; }
.mode-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; background: var(--bg-color); padding: 0.375rem; border-radius: 10px; }
.mode-tab { flex: 1; padding: 0.75rem; background: transparent; border: none; border-radius: 8px; color: var(--text-muted); font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
.mode-tab.active { background: var(--primary-color); color: var(--bg-color); }
.mode-tab:not(.active):hover { color: var(--text-color); }
.editor-container { display: flex; flex-direction: column; gap: 1rem; }
.editor-section { display: flex; flex-direction: column; gap: 0.5rem; }
.editor-header { display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; }
.editor-title { font-weight: 600; color: var(--text-color); font-size: 0.9rem; }
.form-select-sm { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.5rem 0.75rem; color: var(--text-color); font-size: 0.85rem; }
.editor-textarea { width: 100%; min-height: 200px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.875rem; color: var(--text-color); resize: vertical; line-height: 1.6; }
.editor-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.editor-textarea.output { color: var(--primary-color); }
.error-message { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 0.75rem 1rem; color: #ef4444; font-size: 0.875rem; font-family: var(--font-mono); }
.actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
.action-btn { padding: 0.75rem 1.5rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.action-btn.primary:hover { filter: brightness(1.1); }
.copy-btn-small { padding: 0.375rem 0.75rem; background: transparent; border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
@media (max-width: 640px) { .editor-textarea { min-height: 150px; } .actions { flex-direction: column; } .action-btn { width: 100%; } }
</style>
