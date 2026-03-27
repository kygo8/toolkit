<script setup>
import { ref, computed } from 'vue'

const userAgent = ref('*')
const sitemapUrl = ref('')
const rules = ref([
  { type: 'disallow', path: '/admin/', enabled: true },
  { type: 'disallow', path: '/private/', enabled: true },
  { type: 'disallow', path: '/*.php$', enabled: false },
  { type: 'disallow', path: '/cgi-bin/', enabled: false }
])
const copied = ref(false)

const addRule = (type) => {
  rules.value.push({ type, path: '', enabled: true })
}

const removeRule = (index) => {
  rules.value.splice(index, 1)
}

const robotsOutput = computed(() => {
  let result = `User-agent: ${userAgent.value}\n`
  
  rules.value.filter(r => r.enabled && r.path).forEach(rule => {
    result += `${rule.type === 'disallow' ? 'Disallow' : 'Allow'}: ${rule.path}\n`
  })
  
  if (sitemapUrl.value) {
    result += `\nSitemap: ${sitemapUrl.value}`
  }
  
  return result.trim()
})

const copyResult = async () => {
  if (!robotsOutput.value) return
  try {
    await navigator.clipboard.writeText(robotsOutput.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const clearAll = () => {
  userAgent.value = '*'
  sitemapUrl.value = ''
  rules.value = []
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🤖 Robots.txt 生成器</h1>
    
    <div class="card">
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">User-agent</label>
          <select v-model="userAgent" class="form-select">
            <option value="*">* (所有搜索引擎)</option>
            <option value="Googlebot">Googlebot</option>
            <option value="Googlebot-Image">Googlebot-Image</option>
            <option value="Bingbot">Bingbot</option>
            <option value="Baiduspider">Baiduspider</option>
            <option value="Sogou web spider">Sogou web spider</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Sitemap URL</label>
          <input 
            type="url" 
            v-model="sitemapUrl"
            class="form-input"
            placeholder="https://example.com/sitemap.xml"
          />
        </div>
      </div>

      <div class="rules-section">
        <div class="rules-header">
          <span class="rules-title">访问规则</span>
          <div class="rules-actions">
            <button class="add-btn" @click="addRule('disallow')">+ 禁止</button>
            <button class="add-btn" @click="addRule('allow')">+ 允许</button>
          </div>
        </div>

        <div class="rules-list">
          <div 
            v-for="(rule, index) in rules" 
            :key="index"
            class="rule-item"
          >
            <label class="rule-checkbox">
              <input type="checkbox" v-model="rule.enabled" />
              <span class="checkbox-custom"></span>
            </label>
            <select v-model="rule.type" class="rule-type">
              <option value="disallow">Disallow</option>
              <option value="allow">Allow</option>
            </select>
            <input 
              type="text" 
              v-model="rule.path"
              class="rule-path"
              placeholder="/path/"
            />
            <button class="remove-btn" @click="removeRule(index)">✕</button>
          </div>
        </div>
      </div>

      <div class="output-section">
        <div class="output-header">
          <span class="output-title">生成结果</span>
          <div class="output-actions">
            <button class="action-btn" @click="clearAll">清空</button>
            <button class="action-btn primary" @click="copyResult">
              {{ copied ? '✓ 已复制' : '📋 复制' }}
            </button>
          </div>
        </div>
        <pre class="output-code">{{ robotsOutput || '请添加规则' }}</pre>
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

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

.rules-section {
  margin-bottom: 1.5rem;
}

.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.rules-title {
  font-weight: 600;
  color: var(--text-color);
}

.rules-actions {
  display: flex;
  gap: 0.5rem;
}

.add-btn {
  padding: 0.375rem 0.75rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rule-checkbox input {
  display: none;
}

.rule-checkbox .checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.rule-checkbox input:checked + .checkbox-custom {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.rule-checkbox input:checked + .checkbox-custom::after {
  content: '✓';
  color: var(--bg-color);
  font-size: 12px;
}

.rule-type {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem;
  color: var(--text-color);
  font-size: 0.85rem;
}

.rule-path {
  flex: 1;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  color: var(--text-color);
  font-size: 0.85rem;
}

.rule-path:focus {
  outline: none;
  border-color: var(--primary-color);
}

.remove-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s ease;
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

.output-code {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--primary-color);
  white-space: pre-wrap;
  margin: 0;
  min-height: 100px;
}
</style>
