<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const tools = [
  {
    path: '/codec',
    icon: '↔',
    title: '编码/解码工具',
    desc: 'Base64、URL、HTML、Unicode、HEX、JWT、MD5/Hash',
    color: '#10b981'
  },
  {
    path: '/dev',
    icon: '🛠️',
    title: '开发者工具',
    desc: '时间戳转换、颜色转换、正则测试、进制转换、UUID生成、文本对比',
    color: '#00d9ff'
  },
  {
    path: '/qrcode',
    icon: '📱',
    title: '二维码工具',
    desc: '二维码生成、解码识别、自定义美化样式',
    color: '#ec4899'
  },
  {
    path: '/curl',
    icon: '🌐',
    title: 'cURL 工具',
    desc: 'cURL 转代码、可视化构建、命令解析',
    color: '#f97316'
  },
  {
    path: '/seo',
    icon: '📊',
    title: 'SEO工具集',
    desc: '全站爬取、Meta生成、关键词分析、Sitemap等',
    color: '#f59e0b'
  },
  {
    path: '/password',
    icon: '🔑',
    title: '随机密码生成',
    desc: '生成安全随机密码，支持自定义长度和字符类型',
    color: '#7c3aed'
  },
  {
    path: '/json',
    icon: '{}',
    title: 'JSON格式化',
    desc: '格式化、压缩JSON，支持语法高亮',
    color: '#14b8a6'
  }
]

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1 class="hero-title">
        <span class="gradient-text">ToolX</span>
      </h1>
      <p class="hero-subtitle">高效的在线工具集合</p>
    </section>

    <section class="tools-grid">
      <div 
        v-for="tool in tools" 
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
    </section>
  </div>
</template>

<style scoped>
.home {
  padding: 1rem 0;
}

.hero {
  text-align: center;
  padding: 3rem 0;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  font-family: var(--font-mono);
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 1.125rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.tool-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
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
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 217, 255, 0.15);
}

.tool-card:hover::before {
  transform: scaleX(1);
}

.tool-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 8px var(--tool-color, var(--primary-color)));
}

.tool-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.tool-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

.tool-arrow {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  font-size: 1.25rem;
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.tool-card:hover .tool-arrow {
  color: var(--primary-color);
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 1.75rem;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
