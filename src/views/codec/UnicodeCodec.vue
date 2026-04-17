<script setup>
import { ref } from 'vue'

const mode = ref('encode')
const input = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)

const convert = () => {
  error.value = ''
  if (!input.value.trim()) {
    output.value = ''
    return
  }

  try {
    if (mode.value === 'encode') {
      output.value = input.value.split('').map(char => {
        const code = char.charCodeAt(0)
        if (code > 127) {
          return '\\u' + code.toString(16).padStart(4, '0')
        }
        return char
      }).join('')
    } else {
      output.value = input.value.replace(/\\u([0-9a-fA-F]{4})/g, (match, group) => {
        return String.fromCharCode(parseInt(group, 16))
      })
    }
  } catch (e) {
    error.value = '转换失败: ' + e.message
    output.value = ''
  }
}

const swapInputOutput = () => {
  if (output.value) {
    input.value = output.value
    mode.value = mode.value === 'encode' ? 'decode' : 'encode'
    output.value = ''
    error.value = ''
  }
}

const clearAll = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

const copyResult = async () => {
  if (!output.value) return
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🌐 Unicode 编解码</h1>

    <div class="card">
      <div class="mode-tabs">
        <button
          class="mode-tab"
          :class="{ active: mode === 'encode' }"
          @click="mode = 'encode'; clearAll()"
        >编码 (Encode)</button>
        <button
          class="mode-tab"
          :class="{ active: mode === 'decode' }"
          @click="mode = 'decode'; clearAll()"
        >解码 (Decode)</button>
      </div>

      <div class="converter-container">
        <div class="converter-section">
          <div class="section-header">
            <span class="section-title">{{ mode === 'encode' ? '原始文本' : 'Unicode 字符串' }}</span>
          </div>
          <textarea
            v-model="input"
            class="converter-textarea"
            :placeholder="mode === 'encode' ? '输入中文或特殊字符...' : '输入 \\u4f60\\u597d 格式...'"
            @keydown.ctrl.enter="convert"
            @keydown.meta.enter="convert"
          ></textarea>
        </div>

        <div class="converter-actions">
          <button class="convert-btn" @click="convert">
            {{ mode === 'encode' ? '→ 编码' : '→ 解码' }}
          </button>
          <button v-if="output" class="swap-btn" @click="swapInputOutput">⇄</button>
        </div>

        <div class="converter-section">
          <div class="section-header">
            <span class="section-title">{{ mode === 'encode' ? '编码结果' : '解码结果' }}</span>
            <button v-if="output" class="copy-btn-small" @click="copyResult">
              {{ copied ? '✓ 已复制' : '📋 复制' }}
            </button>
          </div>
          <div v-if="error" class="error-message">❌ {{ error }}</div>
          <textarea :value="output" readonly class="converter-textarea output" placeholder="结果将显示在这里"></textarea>
        </div>
      </div>

      <div class="clear-section">
        <button class="clear-btn" @click="clearAll">✕ 清空全部</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 800px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.mode-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; background: var(--bg-color); padding: 0.375rem; border-radius: 10px; }
.mode-tab { flex: 1; padding: 0.75rem; background: transparent; border: none; border-radius: 8px; color: var(--text-muted); font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
.mode-tab.active { background: var(--primary-color); color: var(--bg-color); }
.converter-container { display: flex; flex-direction: column; gap: 1rem; }
.converter-section { display: flex; flex-direction: column; gap: 0.5rem; }
.section-header { display: flex; justify-content: space-between; align-items: center; }
.section-title { font-weight: 600; color: var(--text-color); font-size: 0.9rem; }
.converter-textarea { width: 100%; min-height: 150px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.875rem; color: var(--text-color); resize: vertical; line-height: 1.6; }
.converter-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.converter-textarea.output { color: var(--primary-color); }
.error-message { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 0.75rem 1rem; color: #ef4444; font-size: 0.875rem; font-family: var(--font-mono); }
.converter-actions { display: flex; gap: 0.75rem; justify-content: center; }
.convert-btn { padding: 0.875rem 2rem; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.convert-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0, 217, 255, 0.4); }
.swap-btn { padding: 0.875rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); font-size: 1.25rem; cursor: pointer; transition: all 0.3s ease; }
.swap-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.copy-btn-small { padding: 0.375rem 0.75rem; background: transparent; border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; transition: all 0.2s ease; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
.clear-section { margin-top: 1rem; text-align: center; }
.clear-btn { padding: 0.625rem 1.5rem; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; transition: all 0.3s ease; }
.clear-btn:hover { border-color: #ef4444; color: #ef4444; }
</style>
