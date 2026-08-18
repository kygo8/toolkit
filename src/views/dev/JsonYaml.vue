<script setup>
import { ref } from 'vue'
import { formatYaml, jsonToYaml, yamlToJson } from '../../utils/yaml-json.js'
import { useConvertTool } from '../../utils/useConvertTool.js'

const mode = ref('json-to-yaml')
const placeholders = {
  'json-to-yaml': '{"key": "value"}',
  'yaml-to-json': 'key: value'
}
const { input, output, error, copied, run, clearAll, swapInputOutput, copyResult } = useConvertTool()

const convert = () => {
  run((value) => (mode.value === 'json-to-yaml' ? jsonToYaml(value) : yamlToJson(value)))
}

const formatInput = () => {
  run((value) => (
    mode.value === 'json-to-yaml'
      ? JSON.stringify(JSON.parse(value), null, 2)
      : formatYaml(value)
  ))
}

const minifyInput = () => {
  run((value) => (
    mode.value === 'json-to-yaml'
      ? JSON.stringify(JSON.parse(value))
      : yamlToJson(formatYaml(value), false)
  ))
}

const switchMode = (nextMode) => {
  mode.value = nextMode
  clearAll()
}

const swap = () => {
  swapInputOutput(() => {
    mode.value = mode.value === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml'
  })
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🧾 JSON ↔ YAML</h1>

    <div class="card">
      <div class="mode-tabs">
        <button class="mode-tab" :class="{ active: mode === 'json-to-yaml' }" @click="switchMode('json-to-yaml')">
          JSON → YAML
        </button>
        <button class="mode-tab" :class="{ active: mode === 'yaml-to-json' }" @click="switchMode('yaml-to-json')">
          YAML → JSON
        </button>
      </div>

      <div class="converter-container">
        <div class="converter-section">
          <div class="section-header">
            <span class="section-title">{{ mode === 'json-to-yaml' ? '输入 JSON' : '输入 YAML' }}</span>
          </div>
          <textarea
            v-model="input"
            class="converter-textarea"
            :placeholder="placeholders[mode]"
            @keydown.ctrl.enter="convert"
            @keydown.meta.enter="convert"
          ></textarea>
        </div>

        <div class="converter-actions">
          <button class="convert-btn" @click="convert">→ 转换</button>
          <button class="action-btn" @click="formatInput">▶ 格式化</button>
          <button class="action-btn" @click="minifyInput">▼ 压缩</button>
          <button v-if="output" class="swap-btn" title="交换输入输出" @click="swap">⇄</button>
        </div>

        <div class="converter-section">
          <div class="section-header">
            <span class="section-title">输出结果</span>
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
.tool-page { max-width: 900px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem; }
.mode-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; background: var(--bg-color); padding: 0.375rem; border-radius: 10px; }
.mode-tab { flex: 1; padding: 0.75rem; background: transparent; border: none; border-radius: 8px; color: var(--text-muted); font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
.mode-tab.active { background: var(--primary-color); color: var(--bg-color); }
.mode-tab:not(.active):hover { color: var(--text-color); }
.converter-container { display: flex; flex-direction: column; gap: 1rem; }
.converter-section { display: flex; flex-direction: column; gap: 0.5rem; }
.section-header { display: flex; justify-content: space-between; align-items: center; }
.section-title { font-weight: 600; color: var(--text-color); font-size: 0.9rem; }
.converter-textarea { width: 100%; min-height: 180px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.875rem; color: var(--text-color); resize: vertical; line-height: 1.6; }
.converter-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.converter-textarea.output { color: var(--primary-color); }
.error-message { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; padding: 0.75rem 1rem; color: #ef4444; font-size: 0.875rem; font-family: var(--font-mono); }
.converter-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
.convert-btn { padding: 0.875rem 2rem; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.convert-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0, 217, 255, 0.4); }
.action-btn { padding: 0.75rem 1.25rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); font-weight: 500; cursor: pointer; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.swap-btn { padding: 0.875rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); font-size: 1.25rem; cursor: pointer; }
.swap-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.copy-btn-small { padding: 0.375rem 0.75rem; background: transparent; border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
.clear-section { margin-top: 1rem; text-align: center; }
.clear-btn { padding: 0.625rem 1.5rem; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; }
.clear-btn:hover { border-color: #ef4444; color: #ef4444; }
@media (max-width: 640px) { .converter-textarea { min-height: 140px; } }
</style>
