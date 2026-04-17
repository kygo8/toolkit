<script setup>
import { ref } from 'vue'
import jsQR from 'jsqr'

const imageUrl = ref('')
const decodedText = ref('')
const error = ref('')
const copied = ref(false)
const isDragging = ref(false)

const decodeFromFile = (file) => {
  if (!file || !file.type.startsWith('image/')) {
    error.value = '请选择图片文件'
    return
  }

  error.value = ''
  decodedText.value = ''

  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        decodedText.value = code.data
      } else {
        error.value = '未检测到二维码，请确认图片中包含有效的二维码'
      }
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleFileInput = (e) => {
  const file = e.target.files[0]
  if (file) decodeFromFile(file)
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) decodeFromFile(file)
}

const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handlePaste = (e) => {
  const items = e.clipboardData.items
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      decodeFromFile(item.getAsFile())
      break
    }
  }
}

const copyResult = async () => {
  if (!decodedText.value) return
  try {
    await navigator.clipboard.writeText(decodedText.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {}
}

const clearAll = () => {
  imageUrl.value = ''
  decodedText.value = ''
  error.value = ''
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔍 二维码解码</h1>

    <div class="card">
      <div
        class="drop-zone"
        :class="{ dragging: isDragging, 'has-image': imageUrl }"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @paste="handlePaste"
      >
        <div v-if="imageUrl" class="image-preview">
          <img :src="imageUrl" alt="uploaded" />
        </div>
        <div v-else class="drop-hint">
          <div class="drop-icon">📁</div>
          <p>拖拽图片到此处</p>
          <p class="sub">或粘贴截图 (Ctrl+V)</p>
        </div>
        <input type="file" accept="image/*" @change="handleFileInput" class="file-input" id="file-input" />
        <label for="file-input" class="upload-btn">📂 选择图片</label>
      </div>

      <div v-if="error" class="error-msg">❌ {{ error }}</div>

      <div v-if="decodedText" class="result-section">
        <div class="result-header">
          <span class="result-title">识别结果</span>
          <div class="result-actions">
            <button class="action-btn" @click="copyResult">{{ copied ? '✓ 已复制' : '📋 复制' }}</button>
            <button class="action-btn" @click="clearAll">✕ 清空</button>
          </div>
        </div>
        <div class="result-content">
          <div v-if="decodedText.startsWith('http')" class="result-link">
            <a :href="decodedText" target="_blank" rel="noopener">{{ decodedText }}</a>
          </div>
          <pre v-else class="result-text">{{ decodedText }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 700px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.drop-zone { position: relative; border: 2px dashed var(--border-color); border-radius: 12px; min-height: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; transition: all 0.3s ease; cursor: pointer; }
.drop-zone.dragging { border-color: var(--primary-color); background: rgba(0, 217, 255, 0.05); }
.drop-zone.has-image { border-style: solid; padding: 1rem; }
.drop-hint { text-align: center; }
.drop-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.drop-hint p { margin: 0.25rem 0; color: var(--text-color); font-size: 0.95rem; }
.drop-hint .sub { color: var(--text-muted); font-size: 0.8rem; }
.image-preview { max-width: 100%; max-height: 350px; }
.image-preview img { max-width: 100%; max-height: 350px; border-radius: 8px; }
.file-input { display: none; }
.upload-btn { padding: 0.5rem 1.25rem; background: var(--primary-color); border-radius: 8px; color: var(--bg-color); font-size: 0.85rem; cursor: pointer; font-weight: 500; }
.error-msg { color: #ef4444; font-size: 0.85rem; margin-top: 1rem; padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px; }
.result-section { margin-top: 1.25rem; border-top: 1px solid var(--border-color); padding-top: 1.25rem; }
.result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.result-title { font-weight: 600; font-size: 0.9rem; color: var(--text-color); }
.result-actions { display: flex; gap: 0.5rem; }
.action-btn { padding: 0.5rem 0.875rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-color); font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.result-content { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; }
.result-link a { color: var(--primary-color); font-family: var(--font-mono); font-size: 0.9rem; word-break: break-all; }
.result-text { margin: 0; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-color); white-space: pre-wrap; word-break: break-all; line-height: 1.5; }
</style>
