<script setup>
import { computed, ref } from 'vue'

const sourceFile = ref(null)
const dataUrl = ref('')
const rawBase64 = ref('')
const errorText = ref('')
const isProcessing = ref(false)

const outputLength = computed(() => dataUrl.value ? dataUrl.value.length.toLocaleString() : '0')

function handleFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorText.value = '请选择图片文件'
    return
  }
  sourceFile.value = file
  convertToBase64(file)
}

function convertToBase64(file) {
  isProcessing.value = true
  errorText.value = ''
  const reader = new FileReader()
  reader.onload = () => {
    dataUrl.value = String(reader.result)
    rawBase64.value = dataUrl.value.split(',')[1] || ''
    isProcessing.value = false
  }
  reader.onerror = () => {
    errorText.value = '图片读取失败'
    isProcessing.value = false
  }
  reader.readAsDataURL(file)
}

async function copyText(value) {
  if (!value) return
  await navigator.clipboard.writeText(value)
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔤 图片转 Base64</h1>
    <p class="intro">将图片转换为 Base64 或完整 Data URL，可用于 HTML、CSS、小图标内联和接口调试。</p>

    <div class="card">
      <input class="file-input" type="file" accept="image/*" @change="handleFile" />
      <div v-if="errorText" class="error-msg">{{ errorText }}</div>

      <div class="summary">
        <div><span>文件名</span><strong>{{ sourceFile?.name || '-' }}</strong></div>
        <div><span>Data URL 长度</span><strong>{{ outputLength }}</strong></div>
        <div><span>状态</span><strong>{{ isProcessing ? '转换中...' : (dataUrl ? '已生成' : '等待上传') }}</strong></div>
      </div>

      <img v-if="dataUrl" class="preview" :src="dataUrl" alt="图片预览" />

      <div class="output-group">
        <div class="output-header">
          <h2>Data URL</h2>
          <button class="action-btn" @click="copyText(dataUrl)">复制</button>
        </div>
        <textarea readonly :value="dataUrl" placeholder="上传图片后生成完整 Data URL"></textarea>
      </div>

      <div class="output-group">
        <div class="output-header">
          <h2>Base64</h2>
          <button class="action-btn" @click="copyText(rawBase64)">复制</button>
        </div>
        <textarea readonly :value="rawBase64" placeholder="上传图片后生成纯 Base64"></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 980px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; font-family: var(--font-mono); }
.intro { color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.7; }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; padding: 1.5rem; }
.file-input { width: 100%; padding: 0.9rem; border: 1px dashed var(--border-color); border-radius: 10px; background: var(--bg-color); color: var(--text-color); }
.summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 1rem 0; }
.summary div { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.85rem; min-width: 0; }
.summary span { display: block; color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.35rem; }
.summary strong { display: block; color: var(--primary-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.preview { width: 100%; max-height: 300px; object-fit: contain; border-radius: 10px; background: var(--bg-color); border: 1px solid var(--border-color); margin-bottom: 1rem; }
.output-group { margin-top: 1rem; }
.output-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.output-header h2 { font-size: 1rem; }
textarea { width: 100%; min-height: 130px; resize: vertical; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-color); padding: 0.9rem; font-family: var(--font-mono); font-size: 0.82rem; }
.action-btn { padding: 0.5rem 0.85rem; border: 1px solid var(--border-color); border-radius: 8px; background: transparent; color: var(--text-color); cursor: pointer; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.error-msg { margin: 1rem 0; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 8px; padding: 0.75rem; }
@media (max-width: 720px) { .summary { grid-template-columns: 1fr; } }
</style>
