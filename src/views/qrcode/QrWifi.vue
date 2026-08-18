<script setup>
import { computed, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { buildWifiPayload } from '~/src/utils/wifi-payload.js'

const ssid = ref('')
const password = ref('')
const encryption = ref('WPA')
const hidden = ref(false)
const size = ref(280)
const dataUrl = ref('')
const error = ref('')
const copied = ref(false)

const payload = computed(() => {
  if (!ssid.value.trim()) return ''
  try {
    return buildWifiPayload({
      ssid: ssid.value,
      password: password.value,
      encryption: encryption.value,
      hidden: hidden.value
    })
  } catch (e) {
    return ''
  }
})

const generate = async () => {
  if (!payload.value) {
    dataUrl.value = ''
    error.value = ssid.value.trim() ? '生成失败' : ''
    return
  }

  error.value = ''
  try {
    dataUrl.value = await QRCode.toDataURL(payload.value, {
      width: size.value,
      margin: 2,
      errorCorrectionLevel: 'M'
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
  a.download = `wifi-qr-${Date.now()}.png`
  a.click()
}

const copyImage = async () => {
  if (!dataUrl.value) return
  try {
    const resp = await fetch(dataUrl.value)
    const blob = await resp.blob()
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    try {
      await navigator.clipboard.writeText(payload.value)
      copied.value = true
      setTimeout(() => { copied.value = false }, 2000)
    } catch {}
  }
}

watch([ssid, password, encryption, hidden, size], generate)
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">📶 WiFi 二维码</h1>
    <div class="card">
      <div class="main-layout">
        <div class="config-side">
          <div class="form-group">
            <label class="form-label">SSID</label>
            <input v-model="ssid" class="form-input" placeholder="WiFi 名称" />
          </div>
          <div class="form-group">
            <label class="form-label">加密方式</label>
            <select v-model="encryption" class="form-select">
              <option value="WPA">WPA / WPA2 / WPA3</option>
              <option value="WEP">WEP</option>
              <option value="nopass">无密码</option>
            </select>
          </div>
          <div v-if="encryption !== 'nopass'" class="form-group">
            <label class="form-label">密码</label>
            <input v-model="password" class="form-input" placeholder="WiFi 密码" />
          </div>
          <label class="toggle">
            <input v-model="hidden" type="checkbox" />
            隐藏网络
          </label>
          <div class="form-group">
            <label class="form-label">尺寸: {{ size }}px</label>
            <input v-model.number="size" type="range" min="160" max="600" step="20" class="slider" />
          </div>
          <pre class="payload">{{ payload || '填写 SSID 后生成 WIFI: 文本' }}</pre>
        </div>

        <div class="preview-side">
          <div v-if="error" class="error-msg">{{ error }}</div>
          <div v-else-if="dataUrl" class="preview-area">
            <img :src="dataUrl" alt="WiFi QR Code" class="qr-image" />
            <div class="preview-actions">
              <button class="action-btn" @click="download">📥 下载 PNG</button>
              <button class="action-btn" @click="copyImage">{{ copied ? '✓ 已复制' : '📋 复制图片' }}</button>
            </div>
          </div>
          <div v-else class="placeholder">输入 WiFi 信息后自动生成</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 900px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.main-layout { display: grid; grid-template-columns: 1fr 300px; gap: 1.5rem; }
.config-side { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.375rem; }
.form-label { font-weight: 500; color: var(--text-color); font-size: 0.85rem; }
.form-input, .form-select { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.7rem 0.85rem; color: var(--text-color); }
.form-input:focus, .form-select:focus { outline: none; border-color: var(--primary-color); }
.toggle { display: flex; align-items: center; gap: 0.45rem; color: var(--text-muted); font-size: 0.85rem; }
.slider { width: 100%; height: 6px; border-radius: 3px; background: var(--border-color); appearance: none; cursor: pointer; }
.slider::-webkit-slider-thumb { appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--primary-color); cursor: pointer; }
.payload { margin: 0; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; color: var(--primary-color); white-space: pre-wrap; word-break: break-all; font-family: var(--font-mono); font-size: 0.8rem; }
.preview-side { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.preview-area { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.qr-image { max-width: 100%; border-radius: 8px; border: 1px solid var(--border-color); background: white; padding: 8px; }
.preview-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
.action-btn { padding: 0.625rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); font-size: 0.85rem; cursor: pointer; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.placeholder { color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 3rem 1rem; background: var(--bg-color); border: 1px dashed var(--border-color); border-radius: 8px; width: 100%; }
.error-msg { color: #ef4444; font-size: 0.85rem; }
@media (max-width: 700px) { .main-layout { grid-template-columns: 1fr; } }
</style>
