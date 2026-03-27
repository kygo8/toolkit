<script setup>
import { ref, computed } from 'vue'

const siteUrl = ref('')
const pages = ref([
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/about', changefreq: 'monthly', priority: '0.8' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.6' }
])
const lastmod = ref('')
const copied = ref(false)

const addPage = () => {
  pages.value.push({ loc: '/', changefreq: 'weekly', priority: '0.5' })
}

const removePage = (index) => {
  pages.value.splice(index, 1)
}

const sitemapOutput = computed(() => {
  if (!siteUrl.value) return ''
  
  const baseUrl = siteUrl.value.replace(/\/$/, '')
  let result = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  
  pages.value.forEach(page => {
    result += '  <url>\n'
    result += `    <loc>${baseUrl}${page.loc}</loc>\n`
    if (lastmod.value) {
      result += `    <lastmod>${lastmod.value}</lastmod>\n`
    }
    result += `    <changefreq>${page.changefreq}</changefreq>\n`
    result += `    <priority>${page.priority}</priority>\n`
    result += '  </url>\n'
  })
  
  result += '</urlset>'
  return result
})

const copyResult = async () => {
  if (!sitemapOutput.value) return
  try {
    await navigator.clipboard.writeText(sitemapOutput.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const downloadSitemap = () => {
  if (!sitemapOutput.value) return
  const blob = new Blob([sitemapOutput.value], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sitemap.xml'
  a.click()
  URL.revokeObjectURL(url)
}

const clearAll = () => {
  siteUrl.value = ''
  pages.value = []
  lastmod.value = ''
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🗺️ Sitemap 生成器</h1>
    
    <div class="card">
      <div class="form-section">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">网站URL</label>
            <input 
              type="url" 
              v-model="siteUrl"
              class="form-input"
              placeholder="https://example.com"
            />
          </div>
          <div class="form-group">
            <label class="form-label">最后更新日期</label>
            <input 
              type="date" 
              v-model="lastmod"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <div class="pages-section">
        <div class="pages-header">
          <span class="pages-title">页面列表</span>
          <button class="add-btn" @click="addPage">+ 添加页面</button>
        </div>

        <div class="pages-list">
          <div 
            v-for="(page, index) in pages" 
            :key="index"
            class="page-item"
          >
            <input 
              type="text" 
              v-model="page.loc"
              class="page-path"
              placeholder="/page-path"
            />
            <select v-model="page.changefreq" class="page-freq">
              <option value="always">always</option>
              <option value="hourly">hourly</option>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
              <option value="yearly">yearly</option>
              <option value="never">never</option>
            </select>
            <select v-model="page.priority" class="page-priority">
              <option value="1.0">1.0</option>
              <option value="0.9">0.9</option>
              <option value="0.8">0.8</option>
              <option value="0.7">0.7</option>
              <option value="0.6">0.6</option>
              <option value="0.5">0.5</option>
              <option value="0.4">0.4</option>
              <option value="0.3">0.3</option>
              <option value="0.2">0.2</option>
              <option value="0.1">0.1</option>
            </select>
            <button class="remove-btn" @click="removePage(index)">✕</button>
          </div>
        </div>
      </div>

      <div class="output-section">
        <div class="output-header">
          <span class="output-title">生成结果</span>
          <div class="output-actions">
            <button class="action-btn" @click="clearAll">清空</button>
            <button class="action-btn" @click="downloadSitemap" :disabled="!sitemapOutput">
              📥 下载
            </button>
            <button class="action-btn primary" @click="copyResult" :disabled="!sitemapOutput">
              {{ copied ? '✓ 已复制' : '📋 复制' }}
            </button>
          </div>
        </div>
        <pre class="output-code">{{ sitemapOutput || '请填写网站URL' }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-family: var(--font-mono);
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
}

.form-input {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  font-size: 0.9rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
}

.pages-section {
  margin-bottom: 1.5rem;
}

.pages-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.pages-title {
  font-weight: 600;
  color: var(--text-color);
}

.add-btn {
  padding: 0.375rem 0.75rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
}

.add-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.pages-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.page-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.page-path {
  flex: 2;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  color: var(--text-color);
  font-size: 0.85rem;
}

.page-freq,
.page-priority {
  flex: 1;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem;
  color: var(--text-color);
  font-size: 0.8rem;
}

.page-item input:focus,
.page-item select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.remove-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

.remove-btn:hover {
  color: #ef4444;
}

.output-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1.25rem;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.output-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;
}

.output-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-btn.primary {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--bg-color);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.output-code {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--primary-color);
  white-space: pre-wrap;
  margin: 0;
  max-height: 250px;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .page-item {
    flex-wrap: wrap;
  }
  
  .page-path {
    flex: 1 1 100%;
  }
}
</style>
