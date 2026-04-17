<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const seoTools = [
  {
    path: '/seo/batch-url',
    icon: '🌐',
    title: '批量域名工具',
    desc: '批量提取主域名和打开URL',
    color: '#8b5cf6'
  },
  {
    path: '/seo/site-crawler',
    icon: '🕷️',
    title: '全站链接爬取',
    desc: '爬取全站链接并检查状态码，发现死链和404页面',
    color: '#06b6d4'
  },
  {
    path: '/seo/meta',
    icon: '📝',
    title: 'Meta标签生成器',
    desc: '生成网页 title、description、keywords 等Meta标签',
    color: '#00d9ff'
  },
  {
    path: '/seo/keyword-density',
    icon: '📊',
    title: '关键词密度分析',
    desc: '分析网页内容中关键词的出现频率和密度',
    color: '#7c3aed'
  },
  {
    path: '/seo/sitemap',
    icon: '🗺️',
    title: 'Sitemap生成',
    desc: '生成 XML 网站地图',
    color: '#ec4899'
  },
  {
    path: '/seo/404-checker',
    icon: '🔍',
    title: '404页面检查',
    desc: '批量检查URL是否返回404状态码',
    color: '#f43f5e'
  },
  {
    path: '/seo/dead-link',
    icon: '🔗',
    title: '死链检测',
    desc: '检测网页中的死链和无效链接',
    color: '#f59e0b'
  },
  {
    path: '/seo/robots',
    icon: '🤖',
    title: 'Robots.txt生成',
    desc: '生成符合标准的 robots.txt 文件',
    color: '#ef4444'
  },
  {
    path: '/seo/htag',
    icon: '#',
    title: 'H标签检查',
    desc: '检查网页H1-H6标签结构是否合理',
    color: '#14b8a6'
  },
  {
    path: '/seo/character-counter',
    icon: '🔢',
    title: '字符计数器',
    desc: '统计标题、描述等字符长度是否符合SEO标准',
    color: '#10b981'
  }
]

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">📊 SEO工具集</h1>
    
    <div class="tools-grid">
      <div 
        v-for="tool in seoTools" 
        :key="tool.path"
        class="tool-card"
        @click="navigateTo(tool.path)"
      >
        <div class="tool-icon" :style="{ '--tool-color': tool.color }">
          {{ tool.icon }}
        </div>
        <h3 class="tool-title">{{ tool.title }}</h3>
        <p class="tool-desc">{{ tool.desc }}</p>
        <div class="tool-arrow">→</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page {
  padding: 1rem 0;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-family: var(--font-mono);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.tool-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--tool-color, var(--primary-color));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tool-card:hover {
  border-color: var(--tool-color, var(--primary-color));
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 217, 255, 0.1);
}

.tool-card:hover::before {
  transform: scaleX(1);
}

.tool-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.tool-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.tool-desc {
  color: var(--text-muted);
  font-size: 0.85rem;
  line-height: 1.5;
}

.tool-arrow {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.tool-card:hover .tool-arrow {
  color: var(--primary-color);
  transform: translateX(4px);
}
</style>
