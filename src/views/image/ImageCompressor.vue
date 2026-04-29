<script setup>
import { computed, ref } from 'vue'

const sourceFile = ref(null)
const sourcePreview = ref('')
const outputUrl = ref('')
const outputName = ref('')
const outputSize = ref(0)
const quality = ref(0.78)
const maxWidth = ref(1600)
const isProcessing = ref(false)
const errorText = ref('')

const sourceSize = computed(() => sourceFile.value ? formatBytes(sourceFile.value.size) : '-')
const compressedSize = computed(() => outputSize.value ? formatBytes(outputSize.value) : '-')
const savedRatio = computed(() => {
  if (!sourceFile.value || !outputSize.value) return '-'
  const saved = Math.max(0, 1 - outputSize.value / sourceFile.value.size)
  return `${Math.round(saved * 100)}%`
})

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB']
  let value = bytes
  let index = 0
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index += 1
  }
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

function clearOutput() {
  if (outputUrl.value) URL.revokeObjectURL(outputUrl.value)
  outputUrl.value = ''
  outputName.value = ''
  outputSize.value = 0
}

function handleFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorText.value = '请选择图片文件'
    return
  }
  sourceFile.value = file
  errorText.value = ''
  clearOutput()
  if (sourcePreview.value) URL.revokeObjectURL(sourcePreview.value)
  sourcePreview.value = URL.createObjectURL(file)
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const url = URL.createObjectURL(file)
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片读取失败'))
    }
    image.src = url
  })
}

function canvasToBlob(canvas, type, imageQuality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('图片压缩失败'))
    }, type, imageQuality)
  })
}

async function compressImage() {
  if (!sourceFile.value) {
    errorText.value = '请先选择图片'
    return
  }
  isProcessing.value = true
  errorText.value = ''
  clearOutput()
  try {
    const image = await loadImage(sourceFile.value)
    const scale = Math.min(1, maxWidth.value / image.naturalWidth)
    const width = Math.round(image.naturalWidth * scale)
    const height = Math.round(image.naturalHeight * scale)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(image, 0, 0, width, height)

    const blob = await canvasToBlob(canvas, 'image/jpeg', quality.value)
    outputUrl.value = URL.createObjectURL(blob)
    outputName.value = `${sourceFile.value.name.replace(/\.[^.]+$/, '')}-compressed.jpg`
    outputSize.value = blob.size
  } catch (error) {
    errorText.value = error.message
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">📉 图片压缩</h1>
    <p class="intro">通过质量和最大宽度压缩图片，适合博客、官网、社交分享图和 SEO 图片体积优化。</p>

    <div class="card">
      <input class="file-input" type="file" accept="image/*" @change="handleFile" />

      <div class="controls">
        <label>
          输出质量 {{ Math.round(quality * 100) }}%
          <input v-model.number="quality" type="range" min="0.1" max="1" step="0.05" />
        </label>
        <label>
          最大宽度
          <input v-model.number="maxWidth" type="number" min="320" max="6000" step="80" />
        </label>
        <button class="action-btn primary" :disabled="isProcessing" @click="compressImage">
          {{ isProcessing ? '压缩中...' : '压缩图片' }}
        </button>
      </div>

      <div v-if="errorText" class="error-msg">{{ errorText }}</div>

      <div class="stats">
        <div><span>原始大小</span><strong>{{ sourceSize }}</strong></div>
        <div><span>压缩后</span><strong>{{ compressedSize }}</strong></div>
        <div><span>节省体积</span><strong>{{ savedRatio }}</strong></div>
      </div>

      <div class="preview-grid">
        <img v-if="sourcePreview" :src="sourcePreview" alt="原图预览" />
        <img v-if="outputUrl" :src="outputUrl" alt="压缩结果预览" />
      </div>
      <a v-if="outputUrl" class="download-link" :href="outputUrl" :download="outputName">下载 {{ outputName }}</a>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 980px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; font-family: var(--font-mono); }
.intro { color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.7; }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; padding: 1.5rem; }
.file-input { width: 100%; padding: 0.9rem; border: 1px dashed var(--border-color); border-radius: 10px; background: var(--bg-color); color: var(--text-color); }
.controls { display: grid; grid-template-columns: 1fr 160px auto; gap: 1rem; align-items: end; margin: 1rem 0; }
.controls label { color: var(--text-muted); font-size: 0.85rem; display: grid; gap: 0.45rem; }
input[type="number"] { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); padding: 0.68rem; }
.action-btn { padding: 0.72rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: transparent; color: var(--text-color); cursor: pointer; white-space: nowrap; }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); font-weight: 700; }
.action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin: 1rem 0; }
.stats div { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.85rem; }
.stats span { display: block; color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.35rem; }
.stats strong { color: var(--primary-color); }
.preview-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.preview-grid img { width: 100%; max-height: 340px; object-fit: contain; border-radius: 10px; background: var(--bg-color); border: 1px solid var(--border-color); }
.download-link { display: inline-block; margin-top: 1rem; color: var(--primary-color); text-decoration: none; }
.error-msg { margin: 1rem 0; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 8px; padding: 0.75rem; }
@media (max-width: 720px) { .controls, .stats, .preview-grid { grid-template-columns: 1fr; } }
</style>
