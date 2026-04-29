<script setup>
import { computed, ref } from 'vue'

const fileInput = ref(null)
const sourceFile = ref(null)
const sourcePreview = ref('')
const targetFormat = ref('image/webp')
const quality = ref(0.9)
const resultUrl = ref('')
const resultName = ref('')
const resultSize = ref(0)
const isProcessing = ref(false)
const errorText = ref('')

const formatOptions = [
  { label: 'WebP', value: 'image/webp', ext: 'webp' },
  { label: 'PNG', value: 'image/png', ext: 'png' },
  { label: 'JPG', value: 'image/jpeg', ext: 'jpg' }
]

const sourceSize = computed(() => sourceFile.value ? formatBytes(sourceFile.value.size) : '-')
const convertedSize = computed(() => resultSize.value ? formatBytes(resultSize.value) : '-')

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

function clearResult() {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultUrl.value = ''
  resultName.value = ''
  resultSize.value = 0
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
  clearResult()
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
      else reject(new Error('当前浏览器不支持该格式转换'))
    }, type, imageQuality)
  })
}

async function convertImage() {
  if (!sourceFile.value) {
    errorText.value = '请先选择图片'
    return
  }
  isProcessing.value = true
  errorText.value = ''
  clearResult()
  try {
    const image = await loadImage(sourceFile.value)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0)

    const selected = formatOptions.find((item) => item.value === targetFormat.value)
    const blob = await canvasToBlob(canvas, targetFormat.value, targetFormat.value === 'image/png' ? undefined : quality.value)
    resultUrl.value = URL.createObjectURL(blob)
    resultName.value = `${sourceFile.value.name.replace(/\.[^.]+$/, '')}.${selected.ext}`
    resultSize.value = blob.size
  } catch (error) {
    errorText.value = error.message
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🖼️ 图片格式转换</h1>
    <p class="intro">上传图片后可在本地转换为 WebP、PNG 或 JPG，适合网页图片优化和格式兼容处理。</p>

    <div class="card">
      <input ref="fileInput" class="file-input" type="file" accept="image/*" @change="handleFile" />

      <div class="controls">
        <label>
          输出格式
          <select v-model="targetFormat">
            <option v-for="option in formatOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </label>
        <label>
          图片质量 {{ Math.round(quality * 100) }}%
          <input v-model.number="quality" type="range" min="0.1" max="1" step="0.05" :disabled="targetFormat === 'image/png'" />
        </label>
        <button class="action-btn primary" :disabled="isProcessing" @click="convertImage">
          {{ isProcessing ? '转换中...' : '转换图片' }}
        </button>
      </div>

      <div v-if="errorText" class="error-msg">{{ errorText }}</div>

      <div class="preview-grid">
        <div class="preview-box">
          <h2>原图</h2>
          <img v-if="sourcePreview" :src="sourcePreview" alt="原图预览" />
          <p v-else>请选择一张图片</p>
          <span>大小：{{ sourceSize }}</span>
        </div>
        <div class="preview-box">
          <h2>转换结果</h2>
          <img v-if="resultUrl" :src="resultUrl" alt="转换结果预览" />
          <p v-else>转换后会显示预览</p>
          <span>大小：{{ convertedSize }}</span>
          <a v-if="resultUrl" class="download-link" :href="resultUrl" :download="resultName">下载 {{ resultName }}</a>
        </div>
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
.controls { display: grid; grid-template-columns: 180px 1fr auto; gap: 1rem; align-items: end; margin: 1rem 0; }
.controls label { color: var(--text-muted); font-size: 0.85rem; display: grid; gap: 0.45rem; }
select, input[type="range"] { width: 100%; }
select { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); padding: 0.68rem; }
.action-btn { padding: 0.72rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: transparent; color: var(--text-color); cursor: pointer; white-space: nowrap; }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); font-weight: 700; }
.action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.preview-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.preview-box { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px; padding: 1rem; min-height: 260px; }
.preview-box h2 { font-size: 1rem; margin-bottom: 0.75rem; }
.preview-box img { width: 100%; max-height: 320px; object-fit: contain; border-radius: 8px; background: rgba(255, 255, 255, 0.04); }
.preview-box p, .preview-box span { color: var(--text-muted); font-size: 0.85rem; }
.download-link { display: inline-block; margin-top: 0.75rem; color: var(--primary-color); text-decoration: none; }
.error-msg { margin: 1rem 0; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 8px; padding: 0.75rem; }
@media (max-width: 720px) { .controls, .preview-grid { grid-template-columns: 1fr; } }
</style>
