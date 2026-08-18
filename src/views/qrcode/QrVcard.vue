<script setup>
import { computed, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { buildVcard } from '~/src/utils/vcard.js'

const firstName = ref('')
const lastName = ref('')
const org = ref('')
const title = ref('')
const phone = ref('')
const email = ref('')
const url = ref('')
const street = ref('')
const city = ref('')
const region = ref('')
const postalCode = ref('')
const country = ref('')
const note = ref('')
const size = ref(280)
const dataUrl = ref('')
const error = ref('')
const copied = ref(false)

const payload = computed(() => buildVcard({
  firstName: firstName.value,
  lastName: lastName.value,
  org: org.value,
  title: title.value,
  phone: phone.value,
  email: email.value,
  url: url.value,
  street: street.value,
  city: city.value,
  region: region.value,
  postalCode: postalCode.value,
  country: country.value,
  note: note.value
}))

const hasContent = computed(() => (
  [firstName, lastName, org, title, phone, email, url, street, city, region, postalCode, country, note]
    .some((field) => field.value.trim())
))

const generate = async () => {
  if (!hasContent.value) {
    dataUrl.value = ''
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
  a.download = `vcard-qr-${Date.now()}.png`
  a.click()
}

const copyPayload = async () => {
  try {
    await navigator.clipboard.writeText(payload.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

watch([
  firstName, lastName, org, title, phone, email, url,
  street, city, region, postalCode, country, note, size
], generate)
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">👤 名片二维码</h1>
    <div class="card">
      <div class="main-layout">
        <div class="config-side">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">名</label>
              <input v-model="firstName" class="form-input" placeholder="First name" />
            </div>
            <div class="form-group">
              <label class="form-label">姓</label>
              <input v-model="lastName" class="form-input" placeholder="Last name" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">公司</label>
              <input v-model="org" class="form-input" placeholder="Organization" />
            </div>
            <div class="form-group">
              <label class="form-label">职位</label>
              <input v-model="title" class="form-input" placeholder="Title" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">电话</label>
              <input v-model="phone" class="form-input" placeholder="+1 555 0100" />
            </div>
            <div class="form-group">
              <label class="form-label">邮箱</label>
              <input v-model="email" class="form-input" placeholder="name@example.com" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">网址</label>
            <input v-model="url" class="form-input" placeholder="https://example.com" />
          </div>
          <div class="form-group">
            <label class="form-label">街道</label>
            <input v-model="street" class="form-input" placeholder="Street" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">城市</label>
              <input v-model="city" class="form-input" placeholder="City" />
            </div>
            <div class="form-group">
              <label class="form-label">省/州</label>
              <input v-model="region" class="form-input" placeholder="Region" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">邮编</label>
              <input v-model="postalCode" class="form-input" placeholder="Postal code" />
            </div>
            <div class="form-group">
              <label class="form-label">国家</label>
              <input v-model="country" class="form-input" placeholder="Country" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">备注</label>
            <textarea v-model="note" class="form-textarea" rows="2" placeholder="Note" />
          </div>
        </div>

        <div class="preview-side">
          <div v-if="error" class="error-msg">{{ error }}</div>
          <div v-else-if="dataUrl" class="preview-area">
            <img :src="dataUrl" alt="vCard QR Code" class="qr-image" />
            <div class="preview-actions">
              <button class="action-btn" @click="download">📥 下载 PNG</button>
              <button class="action-btn" @click="copyPayload">{{ copied ? '✓ 已复制' : '📋 复制 vCard' }}</button>
            </div>
          </div>
          <div v-else class="placeholder">填写名片信息后自动生成</div>
          <pre class="payload">{{ hasContent ? payload : 'vCard 3.0 将显示在这里' }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 960px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.main-layout { display: grid; grid-template-columns: 1fr 300px; gap: 1.5rem; }
.config-side { display: flex; flex-direction: column; gap: 0.85rem; }
.form-group { display: flex; flex-direction: column; gap: 0.375rem; }
.form-label { font-weight: 500; color: var(--text-color); font-size: 0.85rem; }
.form-row { display: flex; gap: 0.75rem; }
.form-row .form-group { flex: 1; }
.form-input, .form-textarea { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.65rem 0.8rem; color: var(--text-color); }
.form-input:focus, .form-textarea:focus { outline: none; border-color: var(--primary-color); }
.form-textarea { resize: vertical; font-family: inherit; }
.preview-side { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.preview-area { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.qr-image { max-width: 100%; border-radius: 8px; border: 1px solid var(--border-color); background: white; padding: 8px; }
.preview-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
.action-btn { padding: 0.625rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); font-size: 0.85rem; cursor: pointer; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.placeholder { color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 2.5rem 1rem; background: var(--bg-color); border: 1px dashed var(--border-color); border-radius: 8px; width: 100%; }
.payload { width: 100%; margin: 0; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; color: var(--primary-color); white-space: pre-wrap; word-break: break-all; font-family: var(--font-mono); font-size: 0.75rem; }
.error-msg { color: #ef4444; font-size: 0.85rem; }
@media (max-width: 700px) { .main-layout { grid-template-columns: 1fr; } .form-row { flex-direction: column; } }
</style>
