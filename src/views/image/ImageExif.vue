<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { groupExifFields, isJpeg, jpegHasExif, pickGps, stripJpegMetadata } from '~/src/utils/image-exif.js'

const fileInput = ref(null)
const sourceFile = ref(null)
const sourcePreview = ref('')
const sourceWidth = ref(0)
const sourceHeight = ref(0)
const parsedExif = ref(null)
const grouped = ref({ groups: [], extra: [] })
const gps = ref(null)
const hadJpegExif = ref(false)
const resultUrl = ref('')
const resultName = ref('')
const resultSize = ref(0)
const isProcessing = ref(false)
const isDragging = ref(false)
const errorText = ref('')
const copied = ref(false)

const sourceSize = computed(() => sourceFile.value ? formatBytes(sourceFile.value.size) : '-')
const resultSizeText = computed(() => resultSize.value ? formatBytes(resultSize.value) : '-')
const fieldCount = computed(() => grouped.value.groups.reduce((sum, group) => sum + group.fields.length, 0) + grouped.value.extra.length)
const mapHref = computed(() => gps.value ? `https://www.openstreetmap.org/?mlat=${gps.value.latitude}&mlon=${gps.value.longitude}#map=16/${gps.value.latitude}/${gps.value.longitude}` : '')

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
  parsedExif.value = null
  grouped.value = { groups: [], extra: [] }
  gps.value = null
  hadJpegExif.value = false
  copied.value = false
  clearResult()
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
      else reject(new Error('Export failed.'))
    }, type, 0.92)
  })
}

async function parseExif(file) {
  const exifr = (await import('exifr')).default
  return exifr.parse(file, {
    tiff: true,
    exif: true,
    gps: true,
    iptc: true,
    ifd0: true,
    interop: true,
    translateKeys: true,
    translateValues: true,
    reviveValues: true,
    sanitize: true,
    mergeOutput: true
  })
}

async function acceptImageFile(file) {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorText.value = 'Please select an image file.'
    return
  }

  resetSource()
  sourceFile.value = file
  sourcePreview.value = URL.createObjectURL(file)
  errorText.value = ''
  isProcessing.value = true

  try {
    const [image, parsed, buffer] = await Promise.all([
      loadImageFromUrl(sourcePreview.value),
      parseExif(file).catch(() => null),
      file.arrayBuffer()
    ])
    sourceWidth.value = image.naturalWidth
    sourceHeight.value = image.naturalHeight
    parsedExif.value = parsed || null
    grouped.value = groupExifFields(parsed)
    gps.value = pickGps(parsed)
    hadJpegExif.value = jpegHasExif(new Uint8Array(buffer))
  } catch (error) {
    errorText.value = error.message
  } finally {
    isProcessing.value = false
  }
}

async function handleFile(event) {
  await acceptImageFile(event.target.files?.[0])
  if (fileInput.value) fileInput.value.value = ''
}

async function handleDrop(event) {
  isDragging.value = false
  await acceptImageFile(event.dataTransfer?.files?.[0])
}

async function exportStripped() {
  if (!sourceFile.value) {
    errorText.value = 'Please select an image first.'
    return
  }

  isProcessing.value = true
  errorText.value = ''
  clearResult()

  try {
    const buffer = await sourceFile.value.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    let blob
    let ext = sourceFile.value.name.split('.').pop() || 'jpg'

    if (isJpeg(bytes)) {
      const stripped = stripJpegMetadata(bytes)
      blob = new Blob([stripped], { type: 'image/jpeg' })
      ext = 'jpg'
    } else {
      const image = await loadImageFromUrl(sourcePreview.value)
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      canvas.getContext('2d').drawImage(image, 0, 0)
      const type = sourceFile.value.type === 'image/webp' ? 'image/webp' : 'image/png'
      ext = type === 'image/webp' ? 'webp' : 'png'
      blob = await canvasToBlob(canvas, type)
    }

    resultUrl.value = URL.createObjectURL(blob)
    resultName.value = `${sourceFile.value.name.replace(/\.[^.]+$/, '')}-stripped.${ext}`
    resultSize.value = blob.size
  } catch (error) {
    errorText.value = error.message
  } finally {
    isProcessing.value = false
  }
}

async function copyJson() {
  if (!parsedExif.value) return
  await navigator.clipboard.writeText(JSON.stringify(parsedExif.value, null, 2))
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1600)
}

onBeforeUnmount(() => {
  resetSource()
})
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">EXIF Viewer</h1>
    <p class="intro">
      Inspect camera, GPS, dates and other EXIF fields locally, then export a stripped copy. JPEG metadata is removed
      without re-encoding; other formats are redrawn on canvas. Images never leave your browser.
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
        <p>Drop a photo here or choose a file. EXIF is parsed in the browser.</p>
      </div>

      <div v-if="errorText" class="error-msg">{{ errorText }}</div>

      <div class="stats">
        <div><span>File</span><strong>{{ sourceFile?.name || '-' }}</strong></div>
        <div><span>Size</span><strong>{{ sourceSize }}</strong></div>
        <div><span>Dimensions</span><strong>{{ sourceWidth && sourceHeight ? `${sourceWidth} × ${sourceHeight}` : '-' }}</strong></div>
        <div><span>EXIF fields</span><strong>{{ sourceFile ? fieldCount : '-' }}</strong></div>
      </div>

      <div class="preview-grid">
        <div class="preview-box">
          <h2>Preview</h2>
          <img v-if="sourcePreview" :src="sourcePreview" alt="EXIF source preview" />
          <p v-else>Drop or choose an image to inspect metadata.</p>
        </div>
        <div class="preview-box">
          <h2>Stripped copy</h2>
          <img v-if="resultUrl" :src="resultUrl" alt="Stripped image preview" />
          <p v-else>Export a copy with EXIF and extra JPEG metadata removed.</p>
          <span>Size: {{ resultSizeText }}</span>
          <div class="action-row">
            <button class="action-btn primary" :disabled="isProcessing || !sourceFile" @click="exportStripped">
              {{ isProcessing ? 'Working...' : 'Export stripped copy' }}
            </button>
            <a v-if="resultUrl" class="download-link" :href="resultUrl" :download="resultName">Download {{ resultName }}</a>
          </div>
        </div>
      </div>

      <div v-if="gps" class="gps-box">
        <strong>GPS</strong>
        <span>{{ gps.latitude.toFixed(6) }}, {{ gps.longitude.toFixed(6) }}</span>
        <a :href="mapHref" target="_blank" rel="noreferrer">Open in OpenStreetMap</a>
      </div>

      <div v-if="sourceFile && !fieldCount" class="empty-msg">
        No EXIF metadata found. {{ hadJpegExif ? 'A JPEG EXIF segment was detected but could not be decoded.' : 'You can still export a re-encoded or stripped copy.' }}
      </div>

      <div v-for="group in grouped.groups" :key="group.key" class="meta-group">
        <h2>{{ group.label }}</h2>
        <div class="meta-table">
          <div v-for="field in group.fields" :key="field.key" class="meta-row">
            <span>{{ field.key }}</span>
            <strong>{{ field.value }}</strong>
          </div>
        </div>
      </div>

      <div v-if="grouped.extra.length" class="meta-group">
        <h2>Other</h2>
        <div class="meta-table">
          <div v-for="field in grouped.extra" :key="field.key" class="meta-row">
            <span>{{ field.key }}</span>
            <strong>{{ field.value }}</strong>
          </div>
        </div>
      </div>

      <button v-if="parsedExif" class="action-btn" type="button" @click="copyJson">
        {{ copied ? 'Copied' : 'Copy EXIF JSON' }}
      </button>
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
.stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; margin: 1rem 0; }
.stats div { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.85rem; min-width: 0; }
.stats span { display: block; color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.35rem; }
.stats strong { display: block; color: var(--primary-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.preview-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.preview-box { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px; padding: 1rem; min-height: 240px; }
.preview-box h2, .meta-group h2 { font-size: 1rem; margin-bottom: 0.75rem; }
.preview-box img { width: 100%; max-height: 280px; object-fit: contain; border-radius: 8px; background: rgba(255, 255, 255, 0.04); }
.preview-box p, .preview-box span { color: var(--text-muted); font-size: 0.85rem; }
.action-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; margin-top: 0.75rem; }
.action-btn { padding: 0.72rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: transparent; color: var(--text-color); cursor: pointer; white-space: nowrap; }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); font-weight: 700; }
.action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.download-link { color: var(--primary-color); text-decoration: none; }
.gps-box, .empty-msg, .error-msg, .meta-group { margin-top: 1rem; border-radius: 10px; padding: 0.85rem 1rem; }
.gps-box, .empty-msg, .meta-group { background: var(--bg-color); border: 1px solid var(--border-color); }
.gps-box { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
.gps-box a { color: var(--primary-color); text-decoration: none; }
.empty-msg { color: var(--text-muted); }
.error-msg { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
.meta-table { display: grid; gap: 0.45rem; }
.meta-row { display: grid; grid-template-columns: minmax(140px, 220px) minmax(0, 1fr); gap: 0.75rem; }
.meta-row span { color: var(--text-muted); font-size: 0.85rem; }
.meta-row strong { color: var(--text-color); overflow-wrap: anywhere; font-weight: 600; }
@media (max-width: 720px) {
  .stats, .preview-grid, .meta-row { grid-template-columns: 1fr; }
}
</style>
