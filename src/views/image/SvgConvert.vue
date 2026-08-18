<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { computeSvgExportSize, ensureSvgNamespace, isLikelySvg, parseSvgDimensions, wrapRasterInSvg } from '~/src/utils/svg-convert.js'

const fileInput = ref(null)
const sourceFile = ref(null)
const sourcePreview = ref('')
const svgText = ref('')
const sourceKind = ref('')
const sourceWidth = ref(0)
const sourceHeight = ref(0)
const scale = ref(1)
const targetWidth = ref(0)
const targetFormat = ref('image/png')
const resultUrl = ref('')
const resultName = ref('')
const resultSize = ref(0)
const resultKind = ref('')
const isProcessing = ref(false)
const isDragging = ref(false)
const errorText = ref('')

const formatOptions = [
  { label: 'PNG', value: 'image/png', ext: 'png' },
  { label: 'JPG', value: 'image/jpeg', ext: 'jpg' },
  { label: 'WebP', value: 'image/webp', ext: 'webp' }
]

const sourceSize = computed(() => sourceFile.value ? formatBytes(sourceFile.value.size) : (svgText.value ? formatBytes(new Blob([svgText.value]).size) : '-'))
const resultSizeText = computed(() => resultSize.value ? formatBytes(resultSize.value) : '-')
const selectedFormat = computed(() => formatOptions.find((item) => item.value === targetFormat.value) || formatOptions[0])
const exportSize = computed(() => computeSvgExportSize({
  width: sourceWidth.value,
  height: sourceHeight.value,
  scale: scale.value,
  targetWidth: targetWidth.value
}))
const isSvgSource = computed(() => sourceKind.value === 'svg')
const resultPreview = computed(() => {
  if (!resultUrl.value) return ''
  if (resultKind.value === 'svg') return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgOutputText.value)}`
  return resultUrl.value
})
const svgOutputText = ref('')

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
  resultKind.value = ''
  svgOutputText.value = ''
}

function resetSource() {
  if (sourcePreview.value) URL.revokeObjectURL(sourcePreview.value)
  sourcePreview.value = ''
  sourceFile.value = null
  sourceKind.value = ''
  sourceWidth.value = 0
  sourceHeight.value = 0
  clearResult()
}

function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('File read failed.'))
    reader.readAsText(file)
  })
}

function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Image read failed.'))
    image.src = url
  })
}

function canvasToBlob(canvas, type) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Export failed. This browser may not support the selected format.'))
    }, type, 0.92)
  })
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Image read failed.'))
    reader.readAsDataURL(blob)
  })
}

async function setSvgSource(text, file = null) {
  const nextText = ensureSvgNamespace(text)
  if (!isLikelySvg(nextText)) {
    errorText.value = 'Please provide valid SVG markup.'
    return
  }

  resetSource()
  svgText.value = nextText
  sourceFile.value = file
  sourceKind.value = 'svg'
  const dimensions = parseSvgDimensions(nextText)
  const blob = new Blob([nextText], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  sourcePreview.value = url

  try {
    const image = await loadImageFromUrl(url)
    sourceWidth.value = dimensions.width || image.naturalWidth || 512
    sourceHeight.value = dimensions.height || image.naturalHeight || 512
    errorText.value = ''
  } catch (error) {
    sourceWidth.value = dimensions.width || 512
    sourceHeight.value = dimensions.height || 512
    errorText.value = error.message
  }
}

async function setRasterSource(file) {
  resetSource()
  sourceFile.value = file
  sourceKind.value = 'raster'
  svgText.value = ''
  const url = URL.createObjectURL(file)
  sourcePreview.value = url
  try {
    const image = await loadImageFromUrl(url)
    sourceWidth.value = image.naturalWidth
    sourceHeight.value = image.naturalHeight
    errorText.value = ''
  } catch (error) {
    errorText.value = error.message
  }
}

async function acceptFile(file) {
  if (!file) return
  const looksSvg = file.type === 'image/svg+xml' || /\.svg$/i.test(file.name)
  if (looksSvg || file.type.startsWith('text/')) {
    const text = await readFileText(file)
    await setSvgSource(text, file)
    return
  }
  if (!file.type.startsWith('image/')) {
    errorText.value = 'Please select an SVG or image file.'
    return
  }
  await setRasterSource(file)
}

async function handleFile(event) {
  await acceptFile(event.target.files?.[0])
  if (fileInput.value) fileInput.value.value = ''
}

async function handleDrop(event) {
  isDragging.value = false
  await acceptFile(event.dataTransfer?.files?.[0])
}

async function applySvgText() {
  await setSvgSource(svgText.value)
}

async function convertImage() {
  if (!sourceKind.value && !svgText.value.trim()) {
    errorText.value = 'Please drop a file or paste SVG markup first.'
    return
  }

  isProcessing.value = true
  errorText.value = ''
  clearResult()

  try {
    if (isSvgSource.value || isLikelySvg(svgText.value)) {
      const markup = ensureSvgNamespace(svgText.value)
      const blob = new Blob([markup], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      try {
        const image = await loadImageFromUrl(url)
        const size = computeSvgExportSize({
          width: sourceWidth.value || image.naturalWidth,
          height: sourceHeight.value || image.naturalHeight,
          scale: scale.value,
          targetWidth: targetWidth.value
        })
        const canvas = document.createElement('canvas')
        canvas.width = size.width
        canvas.height = size.height
        const ctx = canvas.getContext('2d')
        if (targetFormat.value === 'image/jpeg') {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, size.width, size.height)
        }
        ctx.drawImage(image, 0, 0, size.width, size.height)
        const output = await canvasToBlob(canvas, targetFormat.value)
        resultUrl.value = URL.createObjectURL(output)
        resultKind.value = 'raster'
        resultName.value = `${(sourceFile.value?.name || 'image').replace(/\.[^.]+$/, '')}.${selectedFormat.value.ext}`
        resultSize.value = output.size
      } finally {
        URL.revokeObjectURL(url)
      }
      return
    }

    const image = await loadImageFromUrl(sourcePreview.value)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    canvas.getContext('2d').drawImage(image, 0, 0)
    const pngBlob = await canvasToBlob(canvas, 'image/png')
    const dataUrl = await blobToDataUrl(pngBlob)
    const svg = wrapRasterInSvg({ dataUrl, width: canvas.width, height: canvas.height })
    svgOutputText.value = svg
    const output = new Blob([svg], { type: 'image/svg+xml' })
    resultUrl.value = URL.createObjectURL(output)
    resultKind.value = 'svg'
    resultName.value = `${sourceFile.value.name.replace(/\.[^.]+$/, '')}.svg`
    resultSize.value = output.size
  } catch (error) {
    errorText.value = error.message
  } finally {
    isProcessing.value = false
  }
}

onBeforeUnmount(() => {
  resetSource()
})
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">SVG Converter</h1>
    <p class="intro">
      Convert SVG markup or files to PNG, JPG or WebP, or wrap a PNG/JPG in a simple SVG. Preview the result and file
      size. Everything runs in the browser with canvas and Blob APIs.
    </p>

    <div class="card">
      <div
        class="dropzone"
        :class="{ active: isDragging }"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <input ref="fileInput" class="file-input" type="file" accept="image/*,.svg,image/svg+xml" @change="handleFile" />
        <p>Drop an SVG or image here. SVG text can also be pasted below.</p>
      </div>

      <label class="field">
        SVG text
        <textarea v-model="svgText" placeholder="Paste SVG markup here"></textarea>
      </label>
      <button class="action-btn" type="button" @click="applySvgText">Use SVG text</button>

      <div class="controls">
        <label>
          Scale
          <select v-model.number="scale">
            <option :value="1">1x</option>
            <option :value="2">2x</option>
            <option :value="3">3x</option>
          </select>
        </label>
        <label>
          Target width
          <input v-model.number="targetWidth" type="number" min="0" max="8000" placeholder="Optional" />
        </label>
        <label>
          Raster format
          <select v-model="targetFormat">
            <option v-for="option in formatOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </label>
        <button class="action-btn primary" :disabled="isProcessing" @click="convertImage">
          {{ isProcessing ? 'Converting...' : (isSvgSource || isLikelySvg(svgText) ? 'Convert to raster' : 'Wrap as SVG') }}
        </button>
      </div>

      <div v-if="errorText" class="error-msg">{{ errorText }}</div>

      <div class="preview-grid">
        <div class="preview-box">
          <h2>Source</h2>
          <img v-if="sourcePreview" :src="sourcePreview" alt="Source preview" />
          <p v-else>Drop a file or paste SVG markup.</p>
          <span>{{ sourceWidth && sourceHeight ? `${Math.round(sourceWidth)} × ${Math.round(sourceHeight)}` : '-' }} · {{ sourceSize }}</span>
        </div>
        <div class="preview-box">
          <h2>Result</h2>
          <img v-if="resultPreview" :src="resultPreview" alt="Conversion result preview" />
          <p v-else>Converted output will appear here.</p>
          <span>{{ exportSize.width && sourceKind ? `${exportSize.width} × ${exportSize.height}` : '-' }} · {{ resultSizeText }}</span>
          <a v-if="resultUrl" class="download-link" :href="resultUrl" :download="resultName">Download {{ resultName }}</a>
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
.dropzone { position: relative; border: 1px dashed var(--border-color); border-radius: 10px; background: var(--bg-color); padding: 0.9rem; margin-bottom: 1rem; }
.dropzone.active { border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.12); }
.dropzone p { color: var(--text-muted); font-size: 0.85rem; margin-top: 0.55rem; }
.file-input { width: 100%; color: var(--text-color); }
.field { display: grid; gap: 0.45rem; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.75rem; }
textarea { width: 100%; min-height: 140px; resize: vertical; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-color); padding: 0.9rem; font-family: var(--font-mono); font-size: 0.82rem; }
.controls { display: grid; grid-template-columns: 120px 160px 160px auto; gap: 1rem; align-items: end; margin: 1rem 0; }
.controls label { color: var(--text-muted); font-size: 0.85rem; display: grid; gap: 0.45rem; }
select, input[type="number"] { width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); padding: 0.68rem; }
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
