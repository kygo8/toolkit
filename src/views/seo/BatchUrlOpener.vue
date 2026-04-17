<script setup>
import { ref } from 'vue'

const urls = ref('')
const extractedDomains = ref([])
const notification = ref('')

const extractMainDomain = () => {
  const rawInput = urls.value.replace(/,/g, '\n')
  const urlList = rawInput.split('\n').map(u => u.trim()).filter(u => u)
  const domainSet = new Set()
  
  urlList.forEach(url => {
    try {
      let hostname = url
      if (!hostname.startsWith('http://') && !hostname.startsWith('https://')) {
        hostname = 'https://' + hostname
      }
      const urlObj = new URL(hostname)
      let mainDomain = urlObj.hostname
      const parts = mainDomain.split('.')
      if (parts.length > 2) {
        const tlds = ['com', 'net', 'org', 'co', 'io', 'ai', 'me', 'tv', 'cc', 'biz', 'info', 'name', 'mobi', 'us', 'cn', 'com.cn', 'net.cn', 'org.cn', 'gov.cn']
        const lastPart = parts[parts.length - 1]
        const secondLastPart = parts[parts.length - 2]
        if (tlds.includes(secondLastPart + '.' + lastPart) && parts.length > 3) {
          mainDomain = parts.slice(-3).join('.')
        } else if (tlds.includes(lastPart)) {
          mainDomain = parts.slice(-2).join('.')
        }
      }
      domainSet.add(mainDomain)
    } catch {
      if (url.includes('.')) {
        let domain = url.replace(/^https?:\/\//, '').split('/')[0]
        const parts = domain.split('.')
        if (parts.length > 2) {
          const tlds = ['com', 'net', 'org', 'co', 'io', 'ai', 'me', 'tv', 'cc', 'biz', 'info', 'name', 'mobi', 'us', 'cn', 'com.cn', 'net.cn', 'org.cn', 'gov.cn']
          const lastPart = parts[parts.length - 1]
          const secondLastPart = parts[parts.length - 2]
          if (tlds.includes(secondLastPart + '.' + lastPart) && parts.length > 3) {
            domain = parts.slice(-3).join('.')
          } else if (tlds.includes(lastPart)) {
            domain = parts.slice(-2).join('.')
          }
        }
        domainSet.add(domain)
      }
    }
  })
  
  extractedDomains.value = Array.from(domainSet)
}

const openAllUrls = () => {
  const rawInput = urls.value.replace(/,/g, '\n')
  const urlList = rawInput.split('\n').map(u => u.trim()).filter(u => u)
  urlList.forEach(url => {
    let targetUrl = url
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl
    }
    window.open(targetUrl, '_blank')
  })
}

const openDomains = () => {
  if (extractedDomains.value.length === 0) return
  notification.value = `正在打开 ${extractedDomains.value.length} 个域名，请注意允许弹出窗口...`
  extractedDomains.value.forEach((domain, index) => {
    setTimeout(() => {
      window.open('https://' + domain, '_blank')
    }, index * 100)
  })
  setTimeout(() => {
    notification.value = ''
  }, 3000)
}

const openDomain = (domain) => {
  window.open('https://' + domain, '_blank')
}

const copyDomains = async () => {
  if (extractedDomains.value.length === 0) return
  try {
    await navigator.clipboard.writeText(extractedDomains.value.join('\n'))
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const clearAll = () => {
  urls.value = ''
  extractedDomains.value = []
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🌐 批量域名工具</h1>
    
    <div class="card">
      <div class="input-section">
        <label class="form-label">输入URL或域名（每行一个）</label>
        <textarea 
          v-model="urls"
          class="form-textarea"
          placeholder="https://www.example.com/page1
example.com/product
http://test.cn/path"
        ></textarea>
      </div>

      <div class="actions">
        <button 
          class="action-btn primary" 
          @click="extractMainDomain"
          :disabled="!urls.trim()"
        >
          🎯 提取主域名
        </button>
        <button 
          class="action-btn success" 
          @click="openAllUrls"
          :disabled="!urls.trim()"
        >
          🔗 批量打开URL
        </button>
        <button class="action-btn" @click="clearAll">清空</button>
      </div>

      <div v-if="notification" class="notification">
        {{ notification }}
      </div>

      <div v-if="extractedDomains.length > 0" class="results-section">
        <div class="results-header">
          <span class="results-title">提取到 {{ extractedDomains.length }} 个主域名</span>
          <div class="results-actions">
            <button class="small-btn" @click="copyDomains">复制</button>
            <button class="small-btn success" @click="openDomains">全部打开</button>
          </div>
        </div>
        
        <div class="results-list">
          <div 
            v-for="(domain, index) in extractedDomains" 
            :key="index"
            class="result-item"
            @click="openDomain(domain)"
          >
            <span class="result-domain">{{ domain }}</span>
            <span class="result-open">打开 ↗</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page {
  max-width: 800px;
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

.input-section {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.form-textarea {
  width: 100%;
  min-height: 150px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  color: var(--text-color);
  font-size: 0.85rem;
  font-family: var(--font-mono);
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.notification {
  padding: 0.75rem 1rem;
  background: rgba(0, 217, 255, 0.1);
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  color: var(--primary-color);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
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

.action-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-btn.primary {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--bg-color);
}

.action-btn.primary:hover {
  background: #00c4e6;
  border-color: #00c4e6;
}

.action-btn.success {
  background: #10b981;
  border-color: #10b981;
  color: #fff;
}

.action-btn.success:hover {
  background: #0d9668;
  border-color: #0d9668;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.results-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1.25rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.results-title {
  font-weight: 600;
  color: var(--text-color);
}

.results-actions {
  display: flex;
  gap: 0.5rem;
}

.small-btn {
  padding: 0.4rem 0.8rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.small-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.small-btn.success {
  background: #10b981;
  border-color: #10b981;
  color: #fff;
}

.small-btn.success:hover {
  background: #0d9668;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.result-item:hover {
  border-color: var(--primary-color);
  background: rgba(0, 217, 255, 0.05);
}

.result-domain {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--text-color);
}

.result-open {
  font-size: 0.8rem;
  color: var(--primary-color);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.result-item:hover .result-open {
  opacity: 1;
}
</style>
