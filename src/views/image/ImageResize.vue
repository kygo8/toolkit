<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { CROP_ASPECTS, SIZE_PRESETS, clampCropRect, computeCenteredCrop, computeOutputSize, moveCropRect, resizeCropRect } from '~/src/utils/image-resize.js'

const fileInput = ref(null)
const previewImage = ref(null)
const sourceFile = ref(null)
const sourcePreview = ref('')
const sourceWidth = ref(0)
const sourceHeight = ref(0)
const crop = ref({ x: 0, y: 0, width: 0, height: 0 })
const cropAspect = ref(0)
const outputWidth = ref(0)
const outputHeight = ref(0)
const keepAspect = ref(true)
const targetFormat = ref('image/png')
const quality = ref(0.92)
const resultUrl = ref('')
const resultName = ref('')
const resultSize = ref(0)
const isProcessing = ref(false)
const isDragging = ref(false)
const errorText = ref('')
const displaySize = ref({ width: 0, height: 0 })

let dragState = null

const formatOptions = [
  { label: 'PNG', value: 'image/png', ext: 'png' },
  { label: 'JPG', value: 'image/jpeg', ext: 'jpg', lossy: true },
  { label: 'WebP', value: 'image/webp', ext: 'webp', lossy: true }
]

const sourceSize = computed(() => sourceFile.value ? formatBytes(sourceFile.value.size) : '-')
const resultSizeText = computed(() => resultSize.value ? formatBytes(resultSize.value) : '-')
const selectedFormat = computed(() => formatOptions.find((item) => item.value === targetFormat.value) || formatOptions[0])
const supportsQuality = computed(() => Boolean(selectedFormat.value.lossy))
const outputSize = computed(() => computeOutputSize({
  sourceWidth: crop.value.width || sourceWidth.value,
  sourceHeight: crop.value.height || sourceHeight.value,
  width: outputWidth.value,
  height: outputHeight.value,
  keepAspect: keepAspect.value
}))
const cropStyle = computed(() => {
  const scale = displayScale.value
  if (!scale || !crop.value.width) return { display: 'none' }
  return {
    left: `${crop.value.x * scale}px`,
    top: `${crop.value.y * scale}px`,
    width: `${crop.value.width * scale}px`,
    height: `${crop.value.height * scale}px`
  }
})
const displayScale = computed(() => {
  if (!sourceWidth.value || !displaySize.value.width) return 0
  return displaySize.value.width / sourceWidth.value
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

function clearResult() {
  if (resultUrl.value) URL.revokeObjectURL(resultUrl.value)
  resultUrl.value = ''
  resultName.value = ''
  resultSize.value = 0
}

function resetSource() {
  if (sourcePreview.value) URL.revokeObjectURL(sourcePreview.value)
  sourcePreview.value = ''
  sourceFile.value = null
  sourceWidth.value = 0
  sourceHeight.value = 0
  crop.value = { x: 0, y: 0, width: 0, height: 0 }
  outputWidth.value = 0
  outputHeight.value = 0
  displaySize.value = { width: 0, height: 0 }
  clearResult()
}

function acceptImageFile(file) {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorText.value = 'Please select an image file.'
    return
  }
  resetSource()
  sourceFile.value = file
  sourcePreview.value = URL.createObjectURL(file)
  errorText.value = ''
}

function handleFile(event) {
  acceptImageFile(event.target.files?.[0])
  if (fileInput.value) fileInput.value.value = ''
}

function handleDrop(event) {
  isDragging.value = false
  acceptImageFile(event.dataTransfer?.files?.[0])
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

function canvasToBlob(canvas, type, imageQuality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Export failed. This browser may not support the selected format.'))
    }, type, imageQuality)
  })
}

function syncDisplaySize() {
  const image = previewImage.value
  if (!image) return
  displaySize.value = { width: image.clientWidth, height: image.clientHeight }
}

function applyCropAspect(aspect) {
  cropAspect.value = aspect
  if (!sourceWidth.value || !sourceHeight.value) return
  crop.value = computeCenteredCrop({
    sourceWidth: sourceWidth.value,
    sourceHeight: sourceHeight.value,
    aspect
  })
  if (keepAspect.value) {
    outputWidth.value = crop.value.width
    outputHeight.value = crop.value.height
  }
  clearResult()
}

function applyPreset(preset) {
  if (!sourceWidth.value) return
  if (!preset.width || !preset.height) {
    outputWidth.value = crop.value.width || sourceWidth.value
    outputHeight.value = crop.value.height || sourceHeight.value
  } else {
    outputWidth.value = preset.width
    outputHeight.value = preset.height
  }
  clearResult()
}

function onWidthInput(value) {
  outputWidth.value = Math.max(1, Math.round(Number(value) || 1))
  if (keepAspect.value && crop.value.height) {
    const ratio = crop.value.width / crop.value.height
    outputHeight.value = Math.max(1, Math.round(outputWidth.value / ratio))
  }
  clearResult()
}

function onHeightInput(value) {
  outputHeight.value = Math.max(1, Math.round(Number(value) || 1))
  if (keepAspect.value && crop.value.width) {
    const ratio = crop.value.width / crop.value.height
    outputWidth.value = Math.max(1, Math.round(outputHeight.value * ratio))
  }
  clearResult()
}

async function onImageLoad() {
  const image = previewImage.value
  if (!image) return
  sourceWidth.value = image.naturalWidth
  sourceHeight.value = image.naturalHeight
  crop.value = computeCenteredCrop({
    sourceWidth: sourceWidth.value,
    sourceHeight: sourceHeight.value,
    aspect: cropAspect.value
  })
  outputWidth.value = crop.value.width
  outputHeight.value = crop.value.height
  syncDisplaySize()
}

function toNaturalPoint(event) {
  const image = previewImage.value
  if (!image || !displayScale.value) return null
  const bounds = image.getBoundingClientRect()
  return {
    x: (event.clientX - bounds.left) / displayScale.value,
    y: (event.clientY - bounds.top) / displayScale.value
  }
}

function startMove(event) {
  if (!sourceWidth.value) return
  event.preventDefault()
  const point = toNaturalPoint(event)
  if (!point) return
  dragState = {
    type: 'move',
    lastX: point.x,
    lastY: point.y
  }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopDrag)
}

function startResize(handle, event) {
  if (!sourceWidth.value) return
  event.preventDefault()
  event.stopPropagation()
  const point = toNaturalPoint(event)
  if (!point) return
  dragState = {
    type: 'resize',
    handle,
    lastX: point.x,
    lastY: point.y
  }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopDrag)
}

function onPointerMove(event) {
  if (!dragState) return
  const point = toNaturalPoint(event)
  if (!point) return
  const deltaX = point.x - dragState.lastX
  const deltaY = point.y - dragState.lastY
  dragState.lastX = point.x
  dragState.lastY = point.y

  crop.value = dragState.type === 'move'
    ? moveCropRect(crop.value, deltaX, deltaY, sourceWidth.value, sourceHeight.value, cropAspect.value)
    : resizeCropRect(crop.value, dragState.handle, deltaX, deltaY, sourceWidth.value, sourceHeight.value, cropAspect.value)

  if (keepAspect.value) {
    outputWidth.value = crop.value.width
    outputHeight.value = crop.value.height
  }
  clearResult()
}

function stopDrag() {
  dragState = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopDrag)
}

async function processImage() {
  if (!sourceFile.value) {
    errorText.value = 'Please select an image first.'
    return
  }

  isProcessing.value = true
  errorText.value = ''
  clearResult()

  try {
    const image = await loadImage(sourceFile.value)
    const nextCrop = clampCropRect({
      ...crop.value,
      sourceWidth: image.naturalWidth,
      sourceHeight: image.naturalHeight,
      aspect: cropAspect.value
    })
    const size = computeOutputSize({
      sourceWidth: nextCrop.width,
      sourceHeight: nextCrop.height,
      width: outputWidth.value,
      height: outputHeight.value,
      keepAspect: keepAspect.value
    })
    const canvas = document.createElement('canvas')
    canvas.width = size.width
    canvas.height = size.height
    const ctx = canvas.getContext('2d')
    if (targetFormat.value === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size.width, size.height)
    }
    ctx.drawImage(
      image,
      nextCrop.x,
      nextCrop.y,
      nextCrop.width,
      nextCrop.height,
      0,
      0,
      size.width,
      size.height
    )

    const blob = await canvasToBlob(canvas, targetFormat.value, supportsQuality.value ? quality.value : undefined)
    resultUrl.value = URL.createObjectURL(blob)
    resultName.value = `${sourceFile.value.name.replace(/\.[^.]+$/, '')}-${size.width}x${size.height}.${selectedFormat.value.ext}`
    resultSize.value = blob.size
  } catch (error) {
    errorText.value = error.message
  } finally {
    isProcessing.value = false
  }
}

onBeforeUnmount(() => {
  stopDrag()
  resetSource()
})
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">Crop &amp; Resize</h1>
    <p class="intro">
      Crop and resize images locally in your browser. Set width and height, lock aspect ratio, apply common presets,
      then download PNG, JPG or WebP. Files are not uploaded.
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
        <input ref="fileInput" class="file-input" type="file" accept="image/*" @change="handleFile" />
        <p>Drop an image here or choose a file. Processing stays in your browser.</p>
      </div>

      <div class="controls">
        <label>
          Width
          <input :value="outputWidth" type="number" min="1" max="10000" @change="onWidthInput($event.target.value)" />
        </label>
        <label>
          Height
          <input :value="outputHeight" type="number" min="1" max="10000" @change="onHeightInput($event.target.value)" />
        </label>
        <label class="checkbox">
          <input v-model="keepAspect" type="checkbox" />
          Keep aspect
        </label>
        <label>
          Output format
          <select v-model="targetFormat">
            <option v-for="option in formatOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </label>
        <label>
          Quality {{ Math.round(quality * 100) }}%
          <input v-model.number="quality" type="range" min="0.1" max="1" step="0.05" :disabled="!supportsQuality" />
        </label>
        <button class="action-btn primary" :disabled="isProcessing" @click="processImage">
          {{ isProcessing ? 'Processing...' : 'Crop & Resize' }}
        </button>
      </div>

      <div class="preset-row">
        <span>Size presets</span>
        <button v-for="preset in SIZE_PRESETS" :key="preset.key" class="chip" type="button" @click="applyPreset(preset)">
          {{ preset.label }}
        </button>
      </div>

      <div class="preset-row">
        <span>Crop ratio</span>
        <button
          v-for="item in CROP_ASPECTS"
          :key="item.key"
          class="chip"
          :class="{ active: cropAspect === item.value }"
          type="button"
          @click="applyCropAspect(item.value)"
        >
          {{ item.label }}
        </button>
      </div>

      <div v-if="errorText" class="error-msg">{{ errorText }}</div>

      <div class="preview-grid">
        <div class="preview-box">
          <h2>Original</h2>
          <div v-if="sourcePreview" class="crop-stage">
            <img ref="previewImage" :src="sourcePreview" alt="Original image preview" @load="onImageLoad" />
            <div class="crop-box" :style="cropStyle" @pointerdown="startMove">
              <button class="handle nw" type="button" aria-label="Resize crop northwest" @pointerdown="startResize('nw', $event)" />
              <button class="handle ne" type="button" aria-label="Resize crop northeast" @pointerdown="startResize('ne', $event)" />
              <button class="handle sw" type="button" aria-label="Resize crop southwest" @pointerdown="startResize('sw', $event)" />
              <button class="handle se" type="button" aria-label="Resize crop southeast" @pointerdown="startResize('se', $event)" />
            </div>
          </div>
          <p v-else>Drop or choose an image to start.</p>
          <span>{{ sourceWidth && sourceHeight ? `${sourceWidth} × ${sourceHeight}` : '-' }} · {{ sourceSize }}</span>
        </div>
        <div class="preview-box">
          <h2>Result</h2>
          <img v-if="resultUrl" :src="resultUrl" alt="Cropped and resized preview" />
          <p v-else>The cropped image will appear here.</p>
          <span>{{ outputSize.width && outputSize.height ? `${outputSize.width} × ${outputSize.height}` : '-' }} · {{ resultSizeText }}</span>
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
.dropzone { position: relative; border: 1px dashed var(--border-color); border-radius: 10px; background: var(--bg-color); padding: 0.9rem; }
.dropzone.active { border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.12); }
.dropzone p { color: var(--text-muted); font-size: 0.85rem; margin-top: 0.55rem; }
.file-input { width: 100%; color: var(--text-color); }
.controls { display: grid; grid-template-columns: 120px 120px auto 140px 1fr auto; gap: 1rem; align-items: end; margin: 1rem 0; }
.controls label { color: var(--text-muted); font-size: 0.85rem; display: grid; gap: 0.45rem; }
.checkbox { display: flex !important; align-items: center; gap: 0.5rem; padding-bottom: 0.65rem; }
select, input[type="number"], input[type="range"] { width: 100%; }
select, input[type="number"] { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); padding: 0.68rem; }
.action-btn { padding: 0.72rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: transparent; color: var(--text-color); cursor: pointer; white-space: nowrap; }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); font-weight: 700; }
.action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.preset-row { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem; }
.preset-row span { color: var(--text-muted); font-size: 0.8rem; margin-right: 0.25rem; }
.chip { border: 1px solid var(--border-color); background: transparent; color: var(--text-color); border-radius: 999px; padding: 0.35rem 0.7rem; cursor: pointer; font-size: 0.8rem; }
.chip.active, .chip:hover { border-color: var(--primary-color); color: var(--primary-color); }
.preview-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.preview-box { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px; padding: 1rem; min-height: 260px; }
.preview-box h2 { font-size: 1rem; margin-bottom: 0.75rem; }
.preview-box img { width: 100%; max-height: 320px; object-fit: contain; border-radius: 8px; background: rgba(255, 255, 255, 0.04); }
.preview-box p, .preview-box span { color: var(--text-muted); font-size: 0.85rem; }
.crop-stage { position: relative; display: inline-block; max-width: 100%; touch-action: none; }
.crop-stage img { display: block; width: auto; max-width: 100%; max-height: 320px; object-fit: contain; }
.crop-box { position: absolute; border: 2px solid var(--primary-color); box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4); cursor: move; }
.handle { position: absolute; width: 12px; height: 12px; border: 2px solid var(--primary-color); background: var(--bg-color); padding: 0; }
.handle.nw { top: -7px; left: -7px; cursor: nwse-resize; }
.handle.ne { top: -7px; right: -7px; cursor: nesw-resize; }
.handle.sw { bottom: -7px; left: -7px; cursor: nesw-resize; }
.handle.se { bottom: -7px; right: -7px; cursor: nwse-resize; }
.download-link { display: inline-block; margin-top: 0.75rem; color: var(--primary-color); text-decoration: none; }
.error-msg { margin: 1rem 0; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 8px; padding: 0.75rem; }
@media (max-width: 900px) {
  .controls, .preview-grid { grid-template-columns: 1fr; }
}
</style>
