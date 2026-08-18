<script setup>
import { computed, ref } from 'vue'

const schemaType = ref('WebSite')
const copied = ref(false)

const website = ref({
  name: '',
  url: '',
  description: '',
  searchUrl: ''
})

const article = ref({
  headline: '',
  description: '',
  image: '',
  author: '',
  publisher: '',
  publisherLogo: '',
  datePublished: '',
  dateModified: '',
  url: ''
})

const organization = ref({
  name: '',
  url: '',
  logo: '',
  description: '',
  sameAs: ''
})

const crumbs = ref([
  { name: 'Home', item: 'https://example.com' },
  { name: 'Blog', item: 'https://example.com/blog' }
])

const addCrumb = () => {
  crumbs.value.push({ name: '', item: '' })
}

const removeCrumb = (index) => {
  crumbs.value.splice(index, 1)
}

const jsonLd = computed(() => {
  if (schemaType.value === 'WebSite') {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: website.value.name,
      url: website.value.url,
      description: website.value.description
    }
    if (website.value.searchUrl) {
      data.potentialAction = {
        '@type': 'SearchAction',
        target: `${website.value.searchUrl}{search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
    return data
  }

  if (schemaType.value === 'Article') {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.value.headline,
      description: article.value.description,
      image: article.value.image,
      datePublished: article.value.datePublished,
      dateModified: article.value.dateModified || article.value.datePublished
    }
    if (article.value.author) {
      data.author = { '@type': 'Person', name: article.value.author }
    }
    if (article.value.publisher) {
      data.publisher = {
        '@type': 'Organization',
        name: article.value.publisher,
        ...(article.value.publisherLogo
          ? { logo: { '@type': 'ImageObject', url: article.value.publisherLogo } }
          : {})
      }
    }
    if (article.value.url) {
      data.mainEntityOfPage = { '@type': 'WebPage', '@id': article.value.url }
    }
    return data
  }

  if (schemaType.value === 'Organization') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: organization.value.name,
      url: organization.value.url,
      logo: organization.value.logo,
      description: organization.value.description,
      sameAs: organization.value.sameAs
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.value
      .filter((crumb) => crumb.name.trim())
      .map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name.trim(),
        item: crumb.item.trim()
      }))
  }
})

const scriptOutput = computed(() => (
  ['<script type="application/ld+json">', JSON.stringify(jsonLd.value, null, 2), '</' + 'script>'].join('\n')
))

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(scriptOutput.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🧩 JSON-LD 生成</h1>
    <div class="card">
      <div class="mode-tabs">
        <button
          v-for="item in ['WebSite', 'Article', 'Organization', 'BreadcrumbList']"
          :key="item"
          class="mode-tab"
          :class="{ active: schemaType === item }"
          @click="schemaType = item"
        >
          {{ item }}
        </button>
      </div>

      <div v-if="schemaType === 'WebSite'" class="form-grid">
        <div class="form-group">
          <label class="form-label">网站名称</label>
          <input v-model="website.name" class="form-input" placeholder="ToolX" />
        </div>
        <div class="form-group">
          <label class="form-label">网站 URL</label>
          <input v-model="website.url" class="form-input" placeholder="https://toolx.app" />
        </div>
        <div class="form-group">
          <label class="form-label">描述</label>
          <textarea v-model="website.description" class="form-textarea" rows="2" placeholder="网站简介" />
        </div>
        <div class="form-group">
          <label class="form-label">站内搜索 URL 前缀</label>
          <input v-model="website.searchUrl" class="form-input" placeholder="https://example.com/search?q=" />
        </div>
      </div>

      <div v-else-if="schemaType === 'Article'" class="form-grid">
        <div class="form-group">
          <label class="form-label">标题</label>
          <input v-model="article.headline" class="form-input" placeholder="Article headline" />
        </div>
        <div class="form-group">
          <label class="form-label">描述</label>
          <textarea v-model="article.description" class="form-textarea" rows="2" placeholder="Article description" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">作者</label>
            <input v-model="article.author" class="form-input" placeholder="Author" />
          </div>
          <div class="form-group">
            <label class="form-label">发布方</label>
            <input v-model="article.publisher" class="form-input" placeholder="Publisher" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">发布日期</label>
            <input v-model="article.datePublished" class="form-input" type="date" />
          </div>
          <div class="form-group">
            <label class="form-label">修改日期</label>
            <input v-model="article.dateModified" class="form-input" type="date" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">封面图</label>
          <input v-model="article.image" class="form-input" placeholder="https://example.com/cover.jpg" />
        </div>
        <div class="form-group">
          <label class="form-label">文章 URL</label>
          <input v-model="article.url" class="form-input" placeholder="https://example.com/blog/post" />
        </div>
        <div class="form-group">
          <label class="form-label">发布方 Logo</label>
          <input v-model="article.publisherLogo" class="form-input" placeholder="https://example.com/logo.png" />
        </div>
      </div>

      <div v-else-if="schemaType === 'Organization'" class="form-grid">
        <div class="form-group">
          <label class="form-label">组织名称</label>
          <input v-model="organization.name" class="form-input" placeholder="Organization" />
        </div>
        <div class="form-group">
          <label class="form-label">官网</label>
          <input v-model="organization.url" class="form-input" placeholder="https://example.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Logo</label>
          <input v-model="organization.logo" class="form-input" placeholder="https://example.com/logo.png" />
        </div>
        <div class="form-group">
          <label class="form-label">描述</label>
          <textarea v-model="organization.description" class="form-textarea" rows="2" placeholder="Organization description" />
        </div>
        <div class="form-group">
          <label class="form-label">社交链接 (每行一个)</label>
          <textarea v-model="organization.sameAs" class="form-textarea" rows="3" placeholder="https://x.com/example" />
        </div>
      </div>

      <div v-else class="form-grid">
        <div v-for="(crumb, index) in crumbs" :key="index" class="crumb-row">
          <input v-model="crumb.name" class="form-input" placeholder="名称" />
          <input v-model="crumb.item" class="form-input" placeholder="https://example.com/path" />
          <button class="remove-btn" @click="removeCrumb(index)">✕</button>
        </div>
        <button class="action-btn" @click="addCrumb">+ 添加页面</button>
      </div>

      <div class="output-section">
        <div class="output-header">
          <span class="output-title">生成结果</span>
          <button class="action-btn primary" @click="copyResult">
            {{ copied ? '✓ 已复制' : '📋 复制代码' }}
          </button>
        </div>
        <pre class="output-code">{{ scriptOutput }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 860px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.mode-tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
.mode-tab { padding: 0.45rem 0.8rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 999px; color: var(--text-muted); cursor: pointer; font-size: 0.82rem; }
.mode-tab.active { border-color: var(--primary-color); color: var(--primary-color); }
.form-grid { display: flex; flex-direction: column; gap: 0.9rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-label { font-weight: 500; color: var(--text-color); font-size: 0.9rem; }
.form-row { display: flex; gap: 0.75rem; }
.form-row .form-group { flex: 1; }
.form-input, .form-textarea { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.7rem 0.9rem; color: var(--text-color); }
.form-input:focus, .form-textarea:focus { outline: none; border-color: var(--primary-color); }
.crumb-row { display: grid; grid-template-columns: 1fr 1.4fr auto; gap: 0.5rem; }
.remove-btn { background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; }
.output-section { border-top: 1px solid var(--border-color); margin-top: 1.25rem; padding-top: 1.25rem; }
.output-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.output-title { font-weight: 600; font-size: 0.9rem; }
.action-btn { padding: 0.5rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-color); font-size: 0.8rem; cursor: pointer; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.output-code { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.82rem; color: var(--primary-color); white-space: pre-wrap; word-break: break-all; margin: 0; }
@media (max-width: 640px) { .form-row, .crumb-row { display: flex; flex-direction: column; } }
</style>
