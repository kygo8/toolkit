<script setup>
import { computed, ref } from 'vue'

const baseFile = ref(null)
const watermarkFile = ref(null)
const basePreview = ref('')
const watermarkPreview = ref('')
const resultUrl = ref('')
const resultName = ref('')
const resultSize = ref(0)
const errorText = ref('')
const isProcessing = ref(false)

const watermarkType = ref('text')
const watermarkText = ref('ToolX')
const textStyle = ref('plain')
const position = ref('bottom-right')
const opacity = ref(0.45)
const scale = ref(0.25)
const rotation = ref(0)
const fontSize = ref(42)
const color = ref('#ef4444')
const strokeColor = ref('#ffffff')
const margin = ref(32)
const offsetX = ref(0)
const offsetY = ref(0)
const outputType = ref('image/png')

const positionOptions = [
  { label: 'Top left', value: 'top-left' },
  { label: 'Top center', value: 'top-center' },
  { label: 'Top right', value: 'top-right' },
  { label: 'Middle left', value: 'middle-left' },
  { label: 'Center', value: 'center' },
  { label: 'Middle right', value: 'middle-right' },
  { label: 'Bottom left', value: 'bottom-left' },
  { label: 'Bottom center', value: 'bottom-center' },
  { label: 'Bottom right', value: 'bottom-right' },
  { label: 'Custom offset', value: 'custom' }
]

const textStyleOptions = [
  { label: 'Plain text', value: 'plain' },
  { label: 'Outlined text', value: 'outline' },
  { label: 'Circle stamp', value: 'circle-stamp' },
  { label: 'Square stamp', value: 'square-stamp' },
  { label: 'Diagonal tiled', value: 'tiled' }
]

const outputOptions = [
  { label: 'PNG', value: 'image/png', ext: 'png' },
  { label: 'JPG', value: 'image/jpeg', ext: 'jpg' },
  { label: 'WebP', value: 'image/webp', ext: 'webp' }
]

const resultSizeText = computed(() => resultSize.value ? formatBytes(resultSize.value) : '-')
const selectedOutput = computed(() => outputOptions.find((item) => item.value === outputType.value) || outputOptions[0])
const canUseImageWatermark = computed(() => watermarkType.value === 'image')

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB']
  let value = bytes || 0
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

function setPreview(targetRef, file) {
  if (targetRef.value) URL.revokeObjectURL(targetRef.value)
  targetRef.value = URL.createObjectURL(file)
}

function handleBaseFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorText.value = 'Please select an image file.'
    return
  }
  baseFile.value = file
  errorText.value = ''
  clearResult()
  setPreview(basePreview, file)
}

function handleWatermarkFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorText.value = 'Please select an image watermark file.'
    return
  }
  watermarkFile.value = file
  errorText.value = ''
  setPreview(watermarkPreview, file)
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
      reject(new Error('Image read failed.'))
    }
    image.src = url
  })
}

function canvasToBlob(canvas, type) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Export failed.'))
    }, type, 0.92)
  })
}

function getAnchorPoint(canvas, width, height) {
  const left = margin.value + width / 2
  const centerX = canvas.width / 2
  const right = canvas.width - margin.value - width / 2
  const top = margin.value + height / 2
  const centerY = canvas.height / 2
  const bottom = canvas.height - margin.value - height / 2

  const points = {
    'top-left': [left, top],
    'top-center': [centerX, top],
    'top-right': [right, top],
    'middle-left': [left, centerY],
    center: [centerX, centerY],
    'middle-right': [right, centerY],
    'bottom-left': [left, bottom],
    'bottom-center': [centerX, bottom],
    'bottom-right': [right, bottom],
    custom: [centerX + offsetX.value, centerY + offsetY.value]
  }

  return points[position.value] || points['bottom-right']
}

function drawStampShape(ctx, style, width, height) {
  ctx.lineWidth = Math.max(3, Math.round(fontSize.value * 0.08))
  ctx.strokeStyle = color.value

  if (style === 'circle-stamp') {
    const radius = Math.max(width, height) / 2
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, radius * 0.78, 0, Math.PI * 2)
    ctx.stroke()
    return
  }

  if (style === 'square-stamp') {
    const padding = fontSize.value * 0.5
    ctx.strokeRect(-width / 2 - padding, -height / 2 - padding, width + padding * 2, height + padding * 2)
    ctx.strokeRect(-width / 2 - padding * 0.65, -height / 2 - padding * 0.65, width + padding * 1.3, height + padding * 1.3)
  }
}

function drawTextAt(ctx, canvas, x, y) {
  const text = watermarkText.value || 'ToolX'
  const style = textStyle.value
  ctx.save()
  ctx.globalAlpha = opacity.value
  ctx.translate(x, y)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.font = `700 ${fontSize.value}px Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const metrics = ctx.measureText(text)
  const width = metrics.width
  const height = fontSize.value * 1.25

  drawStampShape(ctx, style, width, height)

  if (style === 'outline') {
    ctx.lineWidth = Math.max(2, Math.round(fontSize.value * 0.08))
    ctx.strokeStyle = strokeColor.value
    ctx.strokeText(text, 0, 0)
  }

  ctx.fillStyle = color.value
  ctx.fillText(text, 0, 0)
  ctx.restore()
}

function drawTextWatermark(ctx, canvas) {
  if (textStyle.value === 'tiled') {
    const step = Math.max(180, fontSize.value * 5)
    for (let y = -step; y < canvas.height + step; y += step) {
      for (let x = -step; x < canvas.width + step; x += step) {
        drawTextAt(ctx, canvas, x, y)
      }
    }
    return
  }

  ctx.font = `700 ${fontSize.value}px Georgia, serif`
  const width = Math.max(ctx.measureText(watermarkText.value || 'ToolX').width + fontSize.value, fontSize.value * 4)
  const height = fontSize.value * 2.2
  const [x, y] = getAnchorPoint(canvas, width, height)
  drawTextAt(ctx, canvas, x, y)
}

function drawImageWatermark(ctx, canvas, image) {
  const maxSide = Math.min(canvas.width, canvas.height) * scale.value
  const ratio = Math.min(maxSide / image.naturalWidth, maxSide / image.naturalHeight)
  const width = image.naturalWidth * ratio
  const height = image.naturalHeight * ratio
  const [x, y] = getAnchorPoint(canvas, width, height)

  ctx.save()
  ctx.globalAlpha = opacity.value
  ctx.translate(x, y)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.drawImage(image, -width / 2, -height / 2, width, height)
  ctx.restore()
}

async function applyWatermark() {
  if (!baseFile.value) {
    errorText.value = 'Please upload a base image first.'
    return
  }
  if (canUseImageWatermark.value && !watermarkFile.value) {
    errorText.value = 'Please upload a watermark image.'
    return
  }

  isProcessing.value = true
  errorText.value = ''
  clearResult()

  try {
    const baseImage = await loadImage(baseFile.value)
    const watermarkImage = canUseImageWatermark.value ? await loadImage(watermarkFile.value) : null
    const canvas = document.createElement('canvas')
    canvas.width = baseImage.naturalWidth
    canvas.height = baseImage.naturalHeight
    const ctx = canvas.getContext('2d')

    ctx.drawImage(baseImage, 0, 0)
    if (watermarkImage) {
      drawImageWatermark(ctx, canvas, watermarkImage)
    } else {
      drawTextWatermark(ctx, canvas)
    }

    const blob = await canvasToBlob(canvas, outputType.value)
    resultUrl.value = URL.createObjectURL(blob)
    resultName.value = `${baseFile.value.name.replace(/\.[^.]+$/, '')}-watermarked.${selectedOutput.value.ext}`
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
    <h1 class="page-title">Image Watermark</h1>
    <p class="intro">
      Add text or image watermarks locally in your browser. Supports regular text, outlined text, circle stamps,
      square stamps, diagonal tiled marks, custom position, rotation and opacity.
    </p>

    <div class="layout-grid">
      <section class="card controls-card">
        <label class="field">
          Base image
          <input class="file-input" type="file" accept="image/*" @change="handleBaseFile" />
        </label>

        <div class="segmented">
          <button :class="{ active: watermarkType === 'text' }" type="button" @click="watermarkType = 'text'">Text watermark</button>
          <button :class="{ active: watermarkType === 'image' }" type="button" @click="watermarkType = 'image'">Image watermark</button>
        </div>

        <template v-if="watermarkType === 'text'">
          <label class="field">
            Watermark text
            <input v-model="watermarkText" type="text" placeholder="ToolX" />
          </label>
          <label class="field">
            Text style
            <select v-model="textStyle">
              <option v-for="item in textStyleOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </label>
          <div class="two-col">
            <label class="field">
              Text color
              <input v-model="color" type="color" />
            </label>
            <label class="field">
              Stroke color
              <input v-model="strokeColor" type="color" />
            </label>
          </div>
          <label class="field">
            <span>Font size <output>{{ fontSize }}px</output></span>
            <input v-model.number="fontSize" type="range" min="18" max="120" step="2" />
          </label>
        </template>

        <template v-else>
          <label class="field">
            Watermark image
            <input class="file-input" type="file" accept="image/*" @change="handleWatermarkFile" />
          </label>
          <label class="field">
            <span>Image scale <output>{{ Math.round(scale * 100) }}%</output></span>
            <input v-model.number="scale" type="range" min="0.05" max="0.8" step="0.01" />
          </label>
        </template>

        <label class="field">
          Position
          <select v-model="position">
            <option v-for="item in positionOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </label>

        <div v-if="position === 'custom'" class="two-col">
          <label class="field">
            X offset
            <input v-model.number="offsetX" type="number" />
          </label>
          <label class="field">
            Y offset
            <input v-model.number="offsetY" type="number" />
          </label>
        </div>

        <label class="field">
          <span>Opacity <output>{{ Math.round(opacity * 100) }}%</output></span>
          <input v-model.number="opacity" type="range" min="0.05" max="1" step="0.05" />
        </label>

        <label class="field">
          <span>Rotation <output>{{ rotation }}°</output></span>
          <input v-model.number="rotation" type="range" min="-45" max="45" step="1" />
        </label>

        <label class="field">
          <span>Margin <output>{{ margin }}px</output></span>
          <input v-model.number="margin" type="range" min="0" max="160" step="4" />
        </label>

        <label class="field">
          Output format
          <select v-model="outputType">
            <option v-for="item in outputOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </label>

        <button class="action-btn primary" :disabled="isProcessing" type="button" @click="applyWatermark">
          {{ isProcessing ? 'Processing...' : 'Apply watermark' }}
        </button>

        <div v-if="errorText" class="error-msg">{{ errorText }}</div>
      </section>

      <section class="card preview-card">
        <div class="preview-grid">
          <div class="preview-box">
            <h2>Base preview</h2>
            <img v-if="basePreview" :src="basePreview" alt="Base image preview" />
            <p v-else>Upload a base image to start.</p>
          </div>
          <div class="preview-box">
            <h2>Watermark preview</h2>
            <img v-if="watermarkPreview && watermarkType === 'image'" :src="watermarkPreview" alt="Watermark image preview" />
            <p v-else>{{ watermarkType === 'text' ? watermarkText : 'Upload a watermark image.' }}</p>
          </div>
        </div>

        <div class="result-box">
          <div class="result-header">
            <div>
              <h2>Result</h2>
              <span>{{ resultSizeText }}</span>
            </div>
            <a v-if="resultUrl" class="download-link" :href="resultUrl" :download="resultName">Download</a>
          </div>
          <img v-if="resultUrl" :src="resultUrl" alt="Watermarked result preview" />
          <p v-else>Generated image will appear here.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 1180px; margin: 0 auto; }
.page-title { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; font-family: var(--font-mono); }
.intro { color: var(--text-muted); line-height: 1.7; max-width: 840px; margin-bottom: 1.25rem; }
.layout-grid { display: grid; grid-template-columns: minmax(280px, 360px) minmax(0, 1fr); gap: 1.25rem; align-items: start; }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.25rem; }
.controls-card { display: grid; gap: 1rem; }
.field { display: grid; gap: 0.45rem; color: var(--text-muted); font-size: 0.86rem; }
.field input:not([type="range"]):not([type="color"]), .field select, .file-input {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  color: var(--text-color);
  padding: 0.72rem;
}
.field input[type="color"] { width: 100%; height: 2.7rem; border: 1px solid var(--border-color); border-radius: 10px; background: var(--bg-color); padding: 0.2rem; }
.field input[type="range"] { width: 100%; }
.segmented { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }
.segmented button, .action-btn {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  padding: 0.75rem 0.9rem;
}
.segmented button.active { border-color: var(--primary-color); color: var(--primary-color); background: rgba(0, 217, 255, 0.08); }
.two-col { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); font-weight: 800; }
.action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.preview-card { display: grid; gap: 1rem; }
.preview-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.preview-box, .result-box { border: 1px solid var(--border-color); background: var(--bg-color); border-radius: 14px; padding: 1rem; min-height: 210px; }
.preview-box h2, .result-box h2 { font-size: 1rem; margin-bottom: 0.7rem; }
.preview-box img, .result-box img { width: 100%; max-height: 520px; object-fit: contain; border-radius: 10px; background: rgba(255, 255, 255, 0.04); }
.preview-box p, .result-box p, .result-box span { color: var(--text-muted); font-size: 0.88rem; overflow-wrap: anywhere; }
.result-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; }
.download-link { color: var(--primary-color); text-decoration: none; font-weight: 800; }
.error-msg { color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 10px; padding: 0.75rem; }
@media (max-width: 900px) {
  .layout-grid, .preview-grid { grid-template-columns: 1fr; }
}
</style>
