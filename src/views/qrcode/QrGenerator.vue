<script setup>
import { ref, watch } from 'vue'
import QRCode from 'qrcode'

const text = ref('')
const size = ref(300)
const margin = ref(2)
const errorLevel = ref('M')
const darkColor = ref('#000000')
const lightColor = ref('#ffffff')
const dataUrl = ref('')
const error = ref('')
const copied = ref(false)

const generate = async () => {
  if (!text.value.trim()) {
    dataUrl.value = ''
    return
  }

  error.value = ''
  try {
    dataUrl.value = await QRCode.toDataURL(text.value, {
      width: size.value,
      margin: margin.value,
      errorCorrectionLevel: errorLevel.value,
      color: {
        dark: darkColor.value,
        light: lightColor.value
      }
    })
  } catch (e) {
    error.value = '生成失败: ' + e.message
    dataUrl.value = ''
  }
}

const download = () => {
  if (!dataUrl.value) return
  const a = document.createElement('a')
  a.href = dataUrl.value
  a.download = `qrcode-${Date.now()}.png`
  a.click()
}

const copyImage = async () => {
  if (!dataUrl.value) return
  try {
    const resp = await fetch(dataUrl.value)
    const blob = await resp.blob()
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {
    try {
      await navigator.clipboard.writeText(text.value)
      copied.value = true
      setTimeout(() => copied.value = false, 2000)
    } catch {}
  }
}

watch([text, size, margin, errorLevel, darkColor, lightColor], generate, { immediate: false })

const presets = [
  { label: 'URL', value: 'https://example.com' },
  { label: '邮箱', value: 'mailto:user@example.com' },
  { label: '电话', value: 'tel:+8613800138000' },
  { label: 'WiFi', value: 'WIFI:T:WPA;S:MyWiFi;P:password123;;' },
  { label: '文本', value: 'Hello World!' },
  { label: '名片', value: 'BEGIN:VCARD\nVERSION:3.0\nN:张三\nTEL:+8613800138000\nEMAIL:zhangsan@example.com\nEND:VCARD' }
]

const usePreset = (v) => { text.value = v }
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">📱 二维码生成</h1>

    <div class="card">
      <div class="main-layout">
        <div class="config-side">
          <div class="form-group">
            <label class="form-label">内容</label>
            <textarea v-model="text" class="form-textarea" placeholder="输入文本、URL、WiFi信息等..." rows="4"></textarea>
          </div>

          <div class="presets">
            <span class="presets-label">快速填入:</span>
            <button v-for="p in presets" :key="p.label" class="preset-btn" @click="usePreset(p.value)">{{ p.label }}</button>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">尺寸: {{ size }}px</label>
              <input type="range" v-model.number="size" min="100" max="1000" step="50" class="slider" />
            </div>
            <div class="form-group">
              <label class="form-label">边距: {{ margin }}</label>
              <input type="range" v-model.number="margin" min="0" max="10" step="1" class="slider" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">容错等级</label>
              <select v-model="errorLevel" class="form-select">
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">前景色</label>
              <div class="color-input-wrap">
                <input type="color" v-model="darkColor" class="color-picker" />
                <input type="text" v-model="darkColor" class="form-input-sm" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">背景色</label>
              <div class="color-input-wrap">
                <input type="color" v-model="lightColor" class="color-picker" />
                <input type="text" v-model="lightColor" class="form-input-sm" />
              </div>
            </div>
          </div>

          <button class="action-btn primary" @click="generate" :disabled="!text.trim()">生成二维码</button>
        </div>

        <div class="preview-side">
          <div v-if="error" class="error-msg">{{ error }}</div>
          <div v-else-if="dataUrl" class="preview-area">
            <img :src="dataUrl" alt="QR Code" class="qr-image" />
            <div class="preview-actions">
              <button class="action-btn" @click="download">📥 下载 PNG</button>
              <button class="action-btn" @click="copyImage">{{ copied ? '✓ 已复制' : '📋 复制图片' }}</button>
            </div>
          </div>
          <div v-else class="placeholder">输入内容后点击生成</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 900px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.main-layout { display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem; }
.config-side { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.375rem; }
.form-label { font-weight: 500; color: var(--text-color); font-size: 0.85rem; }
.form-textarea { width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; color: var(--text-color); font-size: 0.85rem; font-family: var(--font-mono); resize: vertical; line-height: 1.5; }
.form-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.presets { display: flex; gap: 0.375rem; flex-wrap: wrap; align-items: center; }
.presets-label { font-size: 0.8rem; color: var(--text-muted); }
.preset-btn { padding: 0.25rem 0.625rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.preset-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.form-row { display: flex; gap: 0.75rem; }
.form-row .form-group { flex: 1; }
.slider { width: 100%; height: 6px; border-radius: 3px; background: var(--border-color); appearance: none; cursor: pointer; margin-top: 0.25rem; }
.slider::-webkit-slider-thumb { appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--primary-color); cursor: pointer; }
.form-select { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.5rem; color: var(--text-color); font-size: 0.85rem; }
.color-input-wrap { display: flex; gap: 0.375rem; align-items: center; }
.color-picker { width: 32px; height: 32px; border: 1px solid var(--border-color); border-radius: 4px; padding: 2px; cursor: pointer; background: none; }
.form-input-sm { flex: 1; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 4px; padding: 0.375rem 0.5rem; color: var(--text-color); font-size: 0.8rem; font-family: var(--font-mono); }
.action-btn { padding: 0.625rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; }
.action-btn:hover:not(:disabled) { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.preview-side { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.preview-area { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.qr-image { max-width: 100%; border-radius: 8px; border: 1px solid var(--border-color); background: white; padding: 8px; }
.preview-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
.placeholder { color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 3rem 1rem; background: var(--bg-color); border: 1px dashed var(--border-color); border-radius: 8px; width: 100%; }
.error-msg { color: #ef4444; font-size: 0.85rem; }
@media (max-width: 700px) { .main-layout { grid-template-columns: 1fr; } .form-row { flex-direction: column; } }
</style>
