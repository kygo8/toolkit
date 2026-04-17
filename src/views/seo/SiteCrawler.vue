<script setup>
import { ref, computed } from 'vue'

const startUrl = ref('')
const maxDepth = ref(2)
const maxPages = ref(100)
const useProxy = ref(true)
const proxyUrl = ref('https://corsproxy.io/?')
const results = ref([])
const isCrawling = ref(false)
const stopRequested = ref(false)
const crawledCount = ref(0)
const queueCount = ref(0)
const currentPage = ref('')
const crawled = ref(new Set())
const queue = ref([])
const logs = ref([])

const proxyOptions = [
  { label: 'CORS Proxy', value: 'https://corsproxy.io/?' },
  { label: 'AllOrigins', value: 'https://api.allorigins.win/raw?url=' },
  { label: 'CodeTabs', value: 'https://api.codetabs.com/v1/proxy?quest=' }
]

const addLog = (msg, type = 'info') => {
  logs.value.push({ msg, type, time: new Date().toLocaleTimeString() })
  if (logs.value.length > 200) logs.value.shift()
}

const normalizeUrl = (baseUrl, href) => {
  if (!href) return null
  href = href.trim()
  if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return null
  if (href.startsWith('//')) href = 'https:' + href

  try {
    const base = new URL(baseUrl)
    const target = new URL(href, baseUrl)
    return target.href.split('#')[0]
  } catch {
    return null
  }
}

const isInternalUrl = (targetUrl, domain) => {
  try {
    const target = new URL(targetUrl)
    return target.hostname === domain
  } catch {
    return false
  }
}

const extractLinks = (html, baseUrl, domain) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const links = []

  const anchors = doc.querySelectorAll('a[href]')
  anchors.forEach(a => {
    const href = a.getAttribute('href')
    const url = normalizeUrl(baseUrl, href)
    if (url && isInternalUrl(url, domain)) {
      links.push(url)
    }
  })

  return [...new Set(links)]
}

const fetchPage = async (url) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20000)

  const fetchUrl = useProxy.value ? proxyUrl.value + encodeURIComponent(url) : url

  try {
    const response = await fetch(fetchUrl, {
      method: 'GET',
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    const html = await response.text()

    if (useProxy.value) {
      const isValidHtml = html.trim().toLowerCase().startsWith('<') || html.includes('</') || html.includes('<!doctype')
      if (!isValidHtml) {
        return {
          status: response.status,
          ok: false,
          html: '',
          is404: false,
          error: '非HTML响应(代理模式)'
        }
      }
    }

    return {
      status: response.status,
      ok: response.ok || (useProxy.value && response.status === 200),
      html,
      is404: response.status === 404,
      error: null
    }
  } catch (error) {
    clearTimeout(timeoutId)
    return {
      status: 0,
      ok: false,
      html: '',
      is404: false,
      error: error.name === 'AbortError' ? '超时' : error.message
    }
  }
}

const startCrawl = async () => {
  if (!startUrl.value.trim()) return

  let url = startUrl.value.trim()
  if (!url.startsWith('http')) url = 'https://' + url
  startUrl.value = url

  isCrawling.value = true
  stopRequested.value = false
  results.value = []
  crawled.value = new Set()
  queue.value = []
  logs.value = []
  crawledCount.value = 0

  try {
    const domain = new URL(url).hostname
    addLog(`开始爬取: ${url}`, 'info')
    addLog(`域名: ${domain}, 最大深度: ${maxDepth.value}, 最大页面: ${maxPages.value}`, 'info')
    addLog(`CORS代理: ${useProxy.value ? '已开启' : '已关闭'}`, useProxy.value ? 'info' : 'warning')

    queue.value.push({ url, depth: 0 })
    queueCount.value = queue.value.length

    while (queue.value.length > 0 && !stopRequested.value) {
      if (crawledCount.value >= maxPages.value) {
        addLog(`已达到最大页面数 ${maxPages.value}，停止爬取`, 'warning')
        break
      }

      const item = queue.value.shift()
      queueCount.value = queue.value.length

      if (crawled.value.has(item.url)) continue
      if (item.depth > maxDepth.value) continue

      const urlObj = new URL(item.url)
      if (urlObj.pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js|ico|woff|woff2|ttf|eot|mp4|mp3|pdf|zip|rar)(\?|$)/i)) {
        continue
      }

      crawled.value.add(item.url)
      crawledCount.value = crawled.value.size
      currentPage.value = item.url

      addLog(`[${item.depth}] 检查: ${item.url}`, 'info')

      const page = await fetchPage(item.url)

      results.value.push({
        url: item.url,
        status: page.status,
        ok: page.ok,
        is404: page.is404,
        error: page.error || null,
        depth: item.depth,
        linksFound: 0
      })

      if (!page.ok) {
        const logType = page.is404 ? 'error' : 'warning'
        addLog(`  ✕ ${page.status || page.error} - ${item.url}`, logType)
      } else {
        addLog(`  ✓ ${page.status} - ${item.url}`, 'success')
      }

      if (page.ok && page.html && item.depth < maxDepth.value) {
        const links = extractLinks(page.html, item.url, domain)
        const lastResult = results.value[results.value.length - 1]
        lastResult.linksFound = links.length

        let newCount = 0
        for (const link of links) {
          if (!crawled.value.has(link) && !queue.value.some(q => q.url === link)) {
            queue.value.push({ url: link, depth: item.depth + 1 })
            newCount++
          }
        }
        queueCount.value = queue.value.length

        if (newCount > 0) {
          addLog(`  发现 ${newCount} 个新链接 (共 ${links.length} 个)`, 'info')
        }
      }

      await new Promise(r => setTimeout(r, 300))
    }

    if (stopRequested.value) {
      addLog('用户已停止爬取', 'warning')
    }
  } catch (e) {
    addLog(`错误: ${e.message}`, 'error')
  }

  isCrawling.value = false
  currentPage.value = ''
  addLog(`爬取完成，共检查 ${results.value.length} 个页面`, 'info')
}

const stopCrawl = () => {
  stopRequested.value = true
  addLog('正在停止...', 'warning')
}

const clearAll = () => {
  results.value = []
  logs.value = []
  crawled.value = new Set()
  queue.value = []
  crawledCount.value = 0
  queueCount.value = 0
}

const stats = computed(() => ({
  total: results.value.length,
  ok: results.value.filter(r => r.ok).length,
  notFound: results.value.filter(r => r.is404).length,
  errors: results.value.filter(r => !r.ok && !r.is404).length
}))

const exportResults = () => {
  if (results.value.length === 0) return

  const lines = ['URL,状态码,结果,深度,错误信息']
  results.value.forEach(r => {
    const tag = r.is404 ? '404死链' : r.ok ? '正常' : '错误'
    lines.push(`"${r.url}",${r.status || '-'},${tag},${r.depth},"${r.error || ''}"`)
  })

  lines.push('')
  lines.push(`统计: 总计 ${stats.value.total}, 正常 ${stats.value.ok}, 404 ${stats.value.notFound}, 其他错误 ${stats.value.errors}`)

  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `crawl-report-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🕷️ 全站链接爬取检查</h1>

    <div class="card">
      <div class="config-section">
        <div class="form-row">
          <div class="form-group flex-1">
            <label class="form-label">起始URL</label>
            <input
              type="url"
              v-model="startUrl"
              class="form-input"
              placeholder="https://example.com"
              :disabled="isCrawling"
            />
          </div>
          <div class="form-group">
            <label class="form-label">爬取深度</label>
            <select v-model.number="maxDepth" class="form-select" :disabled="isCrawling">
              <option :value="1">1 层</option>
              <option :value="2">2 层</option>
              <option :value="3">3 层</option>
              <option :value="5">5 层</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">最大页面数</label>
            <select v-model.number="maxPages" class="form-select" :disabled="isCrawling">
              <option :value="50">50</option>
              <option :value="100">100</option>
              <option :value="200">200</option>
              <option :value="500">500</option>
            </select>
          </div>
        </div>
        <div class="form-row" style="margin-top: 0.75rem;">
          <div class="form-group">
            <label class="form-label proxy-label">
              <input type="checkbox" v-model="useProxy" :disabled="isCrawling" />
              <span class="checkbox-custom"></span>
              CORS代理 (解决跨域问题)
            </label>
          </div>
          <div class="form-group" v-if="useProxy">
            <select v-model="proxyUrl" class="form-select" :disabled="isCrawling">
              <option v-for="p in proxyOptions" :key="p.value" :value="p.value">{{ p.label }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="actions">
        <button
          v-if="!isCrawling"
          class="action-btn primary"
          @click="startCrawl"
          :disabled="!startUrl.trim()"
        >
          🕷️ 开始爬取
        </button>
        <button
          v-else
          class="action-btn stop"
          @click="stopCrawl"
        >
          ⏹ 停止
        </button>
        <button class="action-btn" @click="clearAll" :disabled="isCrawling">清空</button>
      </div>

      <div v-if="isCrawling || currentPage" class="progress-section">
        <div class="progress-info">
          <span>已爬取: {{ crawledCount }} 页</span>
          <span>队列中: {{ queueCount }} 页</span>
          <span v-if="currentPage" class="current-page">正在处理: {{ currentPage }}</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: Math.min((crawledCount / maxPages) * 100, 100) + '%' }"
          ></div>
        </div>
      </div>

      <div v-if="stats.total > 0" class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">总计</div>
          </div>
          <div class="stat-card success">
            <div class="stat-value">{{ stats.ok }}</div>
            <div class="stat-label">正常</div>
          </div>
          <div class="stat-card error">
            <div class="stat-value">{{ stats.notFound }}</div>
            <div class="stat-label">404</div>
          </div>
          <div class="stat-card warning">
            <div class="stat-value">{{ stats.errors }}</div>
            <div class="stat-label">其他错误</div>
          </div>
        </div>
      </div>

      <div v-if="results.length > 0" class="results-section">
        <div class="results-header">
          <span class="results-title">检查结果</span>
          <button class="action-btn small" @click="exportResults">📥 导出CSV</button>
        </div>

        <div class="filter-bar">
          <button class="filter-btn" :class="{ active: true }" @click="">全部 ({{ stats.total }})</button>
        </div>

        <div class="results-list">
          <div
            v-for="(result, index) in results"
            :key="index"
            class="result-item"
            :class="{ error: result.is404, warning: !result.ok && !result.is404 }"
          >
            <span class="result-depth">D{{ result.depth }}</span>
            <span class="result-code" :class="{ success: result.ok, error: result.is404, warning: !result.ok && !result.is404 }">
              {{ result.status || result.error || 'ERR' }}
            </span>
            <span class="result-url">{{ result.url }}</span>
            <span class="result-links" v-if="result.linksFound > 0">{{ result.linksFound }}链接</span>
            <span class="result-badge" :class="{ success: result.ok, error: result.is404, warning: !result.ok && !result.is404 }">
              {{ result.is404 ? '✕ 404' : result.ok ? '✓' : '⚠' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="logs.length > 0" class="log-section">
      <div class="log-header">
        <span>爬取日志</span>
        <button class="log-clear" @click="logs = []">清空</button>
      </div>
      <div class="log-list" ref="logList">
        <div
          v-for="(log, index) in logs"
          :key="index"
          class="log-item"
          :class="log.type"
        >
          <span class="log-time">{{ log.time }}</span>
          <span class="log-msg">{{ log.msg }}</span>
        </div>
      </div>
    </div>

    <div class="notice">
      <p>⚠️ 默认开启 CORS 代理来绕过浏览器跨域限制。如遇问题可尝试切换不同代理。部分网站可能屏蔽代理请求。</p>
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

.config-section {
  margin-bottom: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.flex-1 {
  flex: 1;
}

.form-label {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
}

.form-input,
.form-select {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  font-size: 0.9rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
}

.form-input:disabled,
.form-select:disabled {
  opacity: 0.6;
}

.proxy-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
}

.proxy-label input {
  display: none;
}

.proxy-label .checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.proxy-label input:checked + .checkbox-custom {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.proxy-label input:checked + .checkbox-custom::after {
  content: '✓';
  color: var(--bg-color);
  font-size: 12px;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-btn.primary {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--bg-color);
}

.action-btn.stop {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.small {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.progress-section {
  margin-bottom: 1.25rem;
}

.progress-info {
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.current-page {
  color: var(--primary-color);
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-bar {
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 3px;
  transition: width 0.3s ease;
}

.stats-section {
  margin-bottom: 1.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.stat-card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
}

.stat-card.success {
  border-color: #10b981;
}

.stat-card.error {
  border-color: #ef4444;
}

.stat-card.warning {
  border-color: #f59e0b;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  font-family: var(--font-mono);
}

.stat-card.success .stat-value { color: #10b981; }
.stat-card.error .stat-value { color: #ef4444; }
.stat-card.warning .stat-value { color: #f59e0b; }

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.results-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1.25rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.results-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.82rem;
}

.result-item.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.result-item.warning {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
}

.result-depth {
  color: var(--text-muted);
  font-size: 0.7rem;
  font-family: var(--font-mono);
  min-width: 24px;
}

.result-code {
  min-width: 42px;
  text-align: center;
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--font-mono);
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.result-code.error {
  background: #ef4444;
  color: white;
}

.result-code.warning {
  background: #f59e0b;
  color: white;
}

.result-url {
  flex: 1;
  color: var(--text-color);
  font-family: var(--font-mono);
  word-break: break-all;
  line-height: 1.4;
}

.result-links {
  color: var(--text-muted);
  font-size: 0.7rem;
  white-space: nowrap;
}

.result-badge {
  font-weight: 600;
  white-space: nowrap;
}

.result-badge.success { color: #10b981; }
.result-badge.error { color: #ef4444; }
.result-badge.warning { color: #f59e0b; }

.log-section {
  margin-top: 1.25rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-color);
}

.log-clear {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
}

.log-clear:hover {
  color: var(--primary-color);
}

.log-list {
  max-height: 250px;
  overflow-y: auto;
  padding: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
}

.log-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  color: var(--text-muted);
}

.log-item.info { color: var(--text-muted); }
.log-item.success { color: #10b981; }
.log-item.warning { color: #f59e0b; }
.log-item.error { color: #ef4444; background: rgba(239, 68, 68, 0.05); }

.log-time {
  color: var(--text-muted);
  opacity: 0.6;
  white-space: nowrap;
}

.log-msg {
  word-break: break-all;
}

.notice {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid #f59e0b;
  border-radius: 8px;
}

.notice p {
  font-size: 0.85rem;
  color: #f59e0b;
  margin: 0;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
