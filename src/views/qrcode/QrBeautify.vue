<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'

const text = ref('')
const size = ref(400)
const errorLevel = ref('H')
const darkColor = ref('#000000')
const lightColor = ref('#ffffff')
const useGradient = ref(false)
const gradientFrom = ref('#00d9ff')
const gradientTo = ref('#7c3aed')
const gradientType = ref('linear')
const dotStyle = ref('square')
const cornerStyle = ref('square')
const cornerColor = ref('')
const logoUrl = ref('')
const logoSize = ref(0.25)
const error = ref('')
const canvasRef = ref(null)
const qrData = ref(null)
const copied = ref(false)

const generateQRData = async () => {
  if (!text.value.trim()) { qrData.value = null; return }
  try {
    qrData.value = QRCode.create(text.value, { errorCorrectionLevel: errorLevel.value })
  } catch (e) {
    error.value = e.message
  }
}

const drawQR = async () => {
  await nextTick()
  if (!canvasRef.value || !qrData.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const modules = qrData.value.modules
  const count = modules.size
  const marginPx = 16
  const totalSize = size.value + marginPx * 2
  const cellSize = size.value / count

  canvas.width = totalSize
  canvas.height = totalSize

  ctx.fillStyle = lightColor.value
  ctx.fillRect(0, 0, totalSize, totalSize)

  const getDotColor = (row, col) => {
    if (!useGradient.value) return darkColor.value
    const x = col / count
    const y = row / count
    if (gradientType.value === 'linear') {
      const t = (x + y) / 2
      return interpolateColor(gradientFrom.value, gradientTo.value, t)
    } else {
      const cx = 0.5, cy = 0.5
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / 0.7
      return interpolateColor(gradientFrom.value, gradientTo.value, Math.min(dist, 1))
    }
  }

  const getCornerColor = () => cornerColor.value || darkColor.value

  const isFinderPattern = (row, col) => {
    if (row < 7 && col < 7) return true
    if (row < 7 && col >= count - 7) return true
    if (row >= count - 7 && col < 7) return true
    return false
  }

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!modules.get(row, col)) continue
      const x = marginPx + col * cellSize
      const y = marginPx + row * cellSize
      const s = cellSize

      if (isFinderPattern(row, col)) {
        ctx.fillStyle = getCornerColor()
      } else {
        ctx.fillStyle = getDotColor(row, col)
      }

      if ((isFinderPattern(row, col) && cornerStyle.value === 'rounded') || dotStyle.value === 'rounded') {
        const r = s * 0.35
        drawRoundRect(ctx, x, y, s, s, r)
      } else if (dotStyle.value === 'dots' && !isFinderPattern(row, col)) {
        ctx.beginPath()
        ctx.arc(x + s / 2, y + s / 2, s * 0.4, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillRect(x, y, s, s)
      }
    }
  }

  if (logoUrl.value) {
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = logoUrl.value
      })
      const logoPx = size.value * logoSize.value
      const lx = (totalSize - logoPx) / 2
      const ly = (totalSize - logoPx) / 2
      const padding = 8
      ctx.fillStyle = lightColor.value
      drawRoundRect(ctx, lx - padding, ly - padding, logoPx + padding * 2, logoPx + padding * 2, 8)
      ctx.drawImage(img, lx, ly, logoPx, logoPx)
    } catch {}
  }
}

const drawRoundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
}

const interpolateColor = (c1, c2, t) => {
  const r1 = parseInt(c1.slice(1, 3), 16), g1 = parseInt(c1.slice(3, 5), 16), b1 = parseInt(c1.slice(5, 7), 16)
  const r2 = parseInt(c2.slice(1, 3), 16), g2 = parseInt(c2.slice(3, 5), 16), b2 = parseInt(c2.slice(5, 7), 16)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r},${g},${b})`
}

const handleLogoUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { logoUrl.value = ev.target.result }
  reader.readAsDataURL(file)
}

const download = () => {
  if (!canvasRef.value) return
  const a = document.createElement('a')
  a.href = canvasRef.value.toDataURL('image/png')
  a.download = `qr-beautified-${Date.now()}.png`
  a.click()
}

const copyImage = async () => {
  if (!canvasRef.value) return
  try {
    const blob = await new Promise(r => canvasRef.value.toBlob(r, 'image/png'))
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {}
}

watch([text, errorLevel], generateQRData, { immediate: true })
watch([qrData, darkColor, lightColor, useGradient, gradientFrom, gradientTo, gradientType, dotStyle, cornerStyle, cornerColor, logoUrl, logoSize], drawQR)

onMounted(() => { text.value = 'https://example.com' })
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🎨 二维码美化</h1>

    <div class="card">
      <div class="main-layout">
        <div class="config-side">
          <div class="form-group">
            <label class="form-label">内容</label>
            <input type="text" v-model="text" class="form-input" placeholder="输入文本或URL" />
          </div>

          <div class="form-group">
            <label class="form-label">点样式</label>
            <div class="btn-group">
              <button class="opt-btn" :class="{ active: dotStyle === 'square' }" @click="dotStyle = 'square'">方形</button>
              <button class="opt-btn" :class="{ active: dotStyle === 'rounded' }" @click="dotStyle = 'rounded'">圆角</button>
              <button class="opt-btn" :class="{ active: dotStyle === 'dots' }" @click="dotStyle = 'dots'">圆点</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">定位点样式</label>
            <div class="btn-group">
              <button class="opt-btn" :class="{ active: cornerStyle === 'square' }" @click="cornerStyle = 'square'">方形</button>
              <button class="opt-btn" :class="{ active: cornerStyle === 'rounded' }" @click="cornerStyle = 'rounded'">圆角</button>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">前景色</label>
              <input type="color" v-model="darkColor" class="color-picker-lg" />
            </div>
            <div class="form-group">
              <label class="form-label">背景色</label>
              <input type="color" v-model="lightColor" class="color-picker-lg" />
            </div>
            <div class="form-group">
              <label class="form-label">定位点色</label>
              <input type="color" v-model="cornerColor" class="color-picker-lg" />
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="useGradient" />
              <span class="checkbox-custom"></span>
              启用渐变色
            </label>
          </div>

          <div v-if="useGradient" class="form-row">
            <div class="form-group">
              <label class="form-label">渐变起始</label>
              <input type="color" v-model="gradientFrom" class="color-picker-lg" />
            </div>
            <div class="form-group">
              <label class="form-label">渐变结束</label>
              <input type="color" v-model="gradientTo" class="color-picker-lg" />
            </div>
            <div class="form-group">
              <label class="form-label">渐变类型</label>
              <select v-model="gradientType" class="form-select">
                <option value="linear">线性</option>
                <option value="radial">径向</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Logo (建议容错H)</label>
            <div class="logo-row">
              <input type="file" accept="image/*" @change="handleLogoUpload" class="file-input" id="logo-input" />
              <label for="logo-input" class="upload-btn">📂 选择Logo</label>
              <input type="range" v-model.number="logoSize" min="0.1" max="0.35" step="0.05" class="slider-sm" v-if="logoUrl" />
              <button v-if="logoUrl" class="clear-logo" @click="logoUrl = ''">✕</button>
            </div>
          </div>
        </div>

        <div class="preview-side">
          <canvas ref="canvasRef" class="qr-canvas" v-show="qrData"></canvas>
          <div v-if="qrData" class="preview-actions">
            <button class="action-btn primary" @click="download">📥 下载 PNG</button>
            <button class="action-btn" @click="copyImage">{{ copied ? '✓ 已复制' : '📋 复制' }}</button>
          </div>
          <div v-if="error" class="error-msg">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 950px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.main-layout { display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem; }
.config-side { display: flex; flex-direction: column; gap: 0.875rem; }
.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.form-label { font-weight: 500; color: var(--text-color); font-size: 0.82rem; }
.form-input { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.5rem 0.75rem; color: var(--text-color); font-size: 0.85rem; }
.form-input:focus { outline: none; border-color: var(--primary-color); }
.form-select { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.4rem 0.5rem; color: var(--text-color); font-size: 0.82rem; }
.form-row { display: flex; gap: 0.75rem; }
.form-row .form-group { flex: 1; }
.btn-group { display: flex; gap: 0.375rem; }
.opt-btn { flex: 1; padding: 0.4rem 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.78rem; cursor: pointer; transition: all 0.2s; }
.opt-btn.active { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.color-picker-lg { width: 100%; height: 36px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; padding: 2px; background: none; }
.checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.82rem; }
.checkbox-label input { display: none; }
.checkbox-custom { width: 16px; height: 16px; border: 2px solid var(--border-color); border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; }
.checkbox-label input:checked + .checkbox-custom { background: var(--primary-color); border-color: var(--primary-color); }
.checkbox-label input:checked + .checkbox-custom::after { content: '✓'; color: var(--bg-color); font-size: 10px; }
.logo-row { display: flex; gap: 0.5rem; align-items: center; }
.file-input { display: none; }
.upload-btn { padding: 0.375rem 0.75rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-color); font-size: 0.78rem; cursor: pointer; }
.slider-sm { flex: 1; height: 4px; background: var(--border-color); border-radius: 2px; appearance: none; cursor: pointer; }
.slider-sm::-webkit-slider-thumb { appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--primary-color); cursor: pointer; }
.clear-logo { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
.clear-logo:hover { color: #ef4444; }
.preview-side { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.qr-canvas { max-width: 100%; border-radius: 8px; border: 1px solid var(--border-color); background: white; }
.preview-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
.action-btn { padding: 0.5rem 0.875rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-color); font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.error-msg { color: #ef4444; font-size: 0.82rem; }
@media (max-width: 700px) { .main-layout { grid-template-columns: 1fr; } .form-row { flex-direction: column; } }
</style>
