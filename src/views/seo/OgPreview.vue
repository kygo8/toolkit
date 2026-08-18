<script setup>
import { computed, ref, watch } from 'vue'

const title = ref('')
const description = ref('')
const image = ref('')
const url = ref('')
const type = ref('website')
const twitterCard = ref('summary_large_image')
const imageBroken = ref(false)
const copied = ref(false)

const escapeAttr = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;')

watch(image, () => {
  imageBroken.value = false
})

const hostname = computed(() => {
  try {
    return url.value ? new URL(url.value).hostname.replace(/^www\./, '') : 'example.com'
  } catch {
    return url.value || 'example.com'
  }
})

const metaOutput = computed(() => {
  const lines = [
    `<meta property="og:title" content="${escapeAttr(title.value)}">`,
    `<meta property="og:description" content="${escapeAttr(description.value)}">`,
    `<meta property="og:type" content="${escapeAttr(type.value)}">`
  ]
  if (url.value) lines.push(`<meta property="og:url" content="${escapeAttr(url.value)}">`)
  if (image.value) lines.push(`<meta property="og:image" content="${escapeAttr(image.value)}">`)
  lines.push(`<meta name="twitter:card" content="${escapeAttr(twitterCard.value)}">`)
  if (title.value) lines.push(`<meta name="twitter:title" content="${escapeAttr(title.value)}">`)
  if (description.value) lines.push(`<meta name="twitter:description" content="${escapeAttr(description.value)}">`)
  if (image.value) lines.push(`<meta name="twitter:image" content="${escapeAttr(image.value)}">`)
  return lines.join('\n')
})

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(metaOutput.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

const clearAll = () => {
  title.value = ''
  description.value = ''
  image.value = ''
  url.value = ''
  type.value = 'website'
  twitterCard.value = 'summary_large_image'
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">📰 Open Graph 预览</h1>
    <div class="card">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">标题</label>
          <input v-model="title" class="form-input" placeholder="页面标题" />
        </div>
        <div class="form-group">
          <label class="form-label">描述</label>
          <textarea v-model="description" class="form-textarea" rows="3" placeholder="分享描述" />
        </div>
        <div class="form-group">
          <label class="form-label">图片 URL</label>
          <input v-model="image" class="form-input" placeholder="https://example.com/og.png" />
        </div>
        <div class="form-group">
          <label class="form-label">页面 URL</label>
          <input v-model="url" class="form-input" placeholder="https://example.com/page" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">og:type</label>
            <select v-model="type" class="form-select">
              <option value="website">website</option>
              <option value="article">article</option>
              <option value="product">product</option>
              <option value="profile">profile</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Twitter Card</label>
            <select v-model="twitterCard" class="form-select">
              <option value="summary">summary</option>
              <option value="summary_large_image">summary_large_image</option>
            </select>
          </div>
        </div>
      </div>

      <div class="preview-block">
        <div class="output-title">卡片预览</div>
        <article class="og-card" :class="{ compact: twitterCard === 'summary' }">
          <div class="og-image" :class="{ empty: !image }">
            <img v-if="image && !imageBroken" :src="image" alt="Open Graph preview" @error="imageBroken = true" />
            <span v-else>图片预览</span>
          </div>
          <div class="og-body">
            <p class="og-host">{{ hostname }}</p>
            <h2>{{ title || '标题将显示在这里' }}</h2>
            <p>{{ description || '描述将显示在这里' }}</p>
          </div>
        </article>
      </div>

      <div class="output-section">
        <div class="output-header">
          <span class="output-title">生成结果</span>
          <div class="output-actions">
            <button class="action-btn" @click="clearAll">清空</button>
            <button class="action-btn primary" @click="copyResult">
              {{ copied ? '✓ 已复制' : '📋 复制代码' }}
            </button>
          </div>
        </div>
        <pre class="output-code">{{ metaOutput }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 860px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.form-grid { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.45rem; }
.form-label { font-weight: 500; color: var(--text-color); font-size: 0.9rem; }
.form-row { display: flex; gap: 0.75rem; }
.form-row .form-group { flex: 1; }
.form-input, .form-textarea, .form-select { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; color: var(--text-color); }
.form-input:focus, .form-textarea:focus, .form-select:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.form-textarea { resize: vertical; min-height: 80px; }
.preview-block { margin-bottom: 1.25rem; }
.og-card { overflow: hidden; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-color); }
.og-card.compact { display: grid; grid-template-columns: 120px 1fr; }
.og-image { min-height: 180px; background: #111827; display: flex; align-items: center; justify-content: center; color: var(--text-muted); overflow: hidden; }
.og-card.compact .og-image { min-height: 120px; }
.og-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.og-body { padding: 0.9rem 1rem 1rem; }
.og-host { margin: 0 0 0.3rem; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
.og-body h2 { margin: 0 0 0.35rem; font-size: 1.05rem; }
.og-body p { margin: 0; color: var(--text-muted); font-size: 0.88rem; }
.output-section { border-top: 1px solid var(--border-color); padding-top: 1.25rem; }
.output-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.output-title { font-weight: 600; color: var(--text-color); font-size: 0.9rem; }
.output-actions { display: flex; gap: 0.5rem; }
.action-btn { padding: 0.5rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-color); font-size: 0.8rem; cursor: pointer; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.output-code { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--primary-color); white-space: pre-wrap; word-break: break-all; margin: 0; }
@media (max-width: 640px) { .form-row, .og-card.compact { display: block; } }
</style>
