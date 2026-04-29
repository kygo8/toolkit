<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const featuredTools = [
  { path: '/image/convert', icon: '🖼️', title: '图片格式转换', desc: 'PNG、JPG、WebP 在线本地转换', color: '#38bdf8' },
  { path: '/network/curl/test', icon: '🚀', title: 'cURL 测试', desc: '解析 cURL 并通过代理发送请求', color: '#f97316' },
  { path: '/json', icon: '{}', title: 'JSON 格式化', desc: '格式化、压缩和校验 JSON', color: '#14b8a6' },
  { path: '/seo/meta', icon: '🏷️', title: 'Meta 标签生成', desc: '生成搜索引擎友好的标题和描述', color: '#f59e0b' },
  { path: '/image/compress', icon: '📉', title: '图片压缩', desc: '压缩图片体积，优化网页加载速度', color: '#22c55e' },
  { path: '/network/domain', icon: '🌍', title: '域名检测', desc: '查询 DNS 记录并解析域名结构', color: '#10b981' }
]

const categories = [
  { path: '/image', icon: '🖼️', title: '图片工具', desc: '图片格式转换、图片压缩、图片转 Base64', color: '#38bdf8' },
  { path: '/network', icon: '🌐', title: '网络工具', desc: '网络检测、域名检测、cURL 测试与转代码', color: '#f97316' },
  { path: '/codec', icon: '↔', title: '编码解码', desc: 'Base64、URL、HTML、Unicode、HEX、JWT、Hash', color: '#10b981' },
  { path: '/dev', icon: '🛠️', title: '开发者工具', desc: '时间戳、颜色、正则、进制、UUID、文本对比', color: '#00d9ff' },
  { path: '/qrcode', icon: '📱', title: '二维码工具', desc: '二维码生成、解码识别、自定义美化样式', color: '#ec4899' },
  { path: '/seo', icon: '📊', title: 'SEO 工具', desc: 'Meta、关键词密度、Sitemap、Robots、死链检测', color: '#f59e0b' },
  { path: '/password', icon: '🔑', title: '密码生成', desc: '生成安全随机密码并检测强度', color: '#7c3aed' },
  { path: '/json', icon: '{}', title: 'JSON 工具', desc: 'JSON 格式化、压缩、校验和语法高亮', color: '#14b8a6' }
]

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Developer & SEO Toolkit</p>
        <h1 class="hero-title">ToolX 在线工具箱</h1>
        <p class="hero-subtitle">
          ToolX 提供在线开发者工具、图片转换工具、网络检测工具和 SEO 工具，覆盖 JSON 格式化、图片压缩、图片转 Base64、cURL 测试、域名检测、编码解码、二维码生成等高频场景。
        </p>
      </div>
      <div class="hero-panel">
        <span class="panel-label">快速入口</span>
        <strong>35+</strong>
        <p>无需安装，浏览器直接使用。图片处理在本地完成，文本工具支持 SSR 页面结构，便于搜索引擎收录。</p>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>常用工具</h2>
        <p>把最高频的工具放在首页第一屏，减少点击路径。</p>
      </div>
      <div class="featured-grid">
        <button
          v-for="tool in featuredTools"
          :key="tool.path"
          class="featured-card"
          :style="{ '--tool-color': tool.color }"
          @click="navigateTo(tool.path)"
        >
          <span class="tool-icon">{{ tool.icon }}</span>
          <span class="tool-content">
            <strong>{{ tool.title }}</strong>
            <small>{{ tool.desc }}</small>
          </span>
          <span class="tool-arrow">→</span>
        </button>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>全部工具分类</h2>
        <p>按图片、网络、编码、开发、二维码和 SEO 场景整理，页面标题和描述均可被搜索引擎读取。</p>
      </div>
      <div class="tools-grid">
        <article
          v-for="category in categories"
          :key="category.path"
          class="tool-card"
          :style="{ '--tool-color': category.color }"
          @click="navigateTo(category.path)"
        >
          <div class="category-top">
            <div class="category-icon">{{ category.icon }}</div>
            <div class="tool-arrow">→</div>
          </div>
          <h3 class="tool-title">{{ category.title }}</h3>
          <p class="tool-desc">{{ category.desc }}</p>
        </article>
      </div>
    </section>

    <section class="seo-copy">
      <h2>为什么选择 ToolX 在线工具？</h2>
      <p>
        ToolX 面向开发者、站长和内容运营人员，提供常用在线工具集合。你可以使用图片格式转换工具把 PNG、JPG、WebP 互转，用图片压缩工具降低网页图片体积，用网络检测和域名检测工具排查连接问题，用 SEO 工具生成 Meta 标签、检查关键词密度、生成 Sitemap 和 Robots.txt。
      </p>
    </section>
  </div>
</template>

<style scoped>
.home { padding: 1rem 0 2rem; }
.hero { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 1.5rem; align-items: stretch; margin-bottom: 2rem; }
.hero-copy, .hero-panel, .seo-copy { border: 1px solid var(--border-color); border-radius: 22px; background: radial-gradient(circle at top left, rgba(0, 217, 255, 0.2), transparent 34%), var(--card-bg); }
.hero-copy { padding: 2.25rem; }
.eyebrow { color: var(--primary-color); font-family: var(--font-mono); font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 0.85rem; }
.hero-title { font-size: clamp(2.2rem, 6vw, 4.5rem); line-height: 0.95; font-weight: 900; margin-bottom: 1rem; font-family: var(--font-mono); background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-subtitle { color: var(--text-muted); max-width: 820px; line-height: 1.85; font-size: 1rem; }
.hero-panel { padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; }
.panel-label { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.5rem; }
.hero-panel strong { color: var(--primary-color); font-size: 4rem; line-height: 1; font-family: var(--font-mono); }
.hero-panel p { color: var(--text-muted); line-height: 1.65; margin-top: 1rem; }
.section { margin-top: 2rem; }
.section-header { display: flex; justify-content: space-between; gap: 1rem; align-items: end; margin-bottom: 1rem; }
.section-header h2, .seo-copy h2 { font-size: 1.35rem; font-weight: 800; }
.section-header p, .seo-copy p { color: var(--text-muted); line-height: 1.75; }
.featured-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.9rem; }
.featured-card { display: grid; grid-template-columns: auto 1fr auto; gap: 0.8rem; align-items: center; text-align: left; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; padding: 1rem; color: var(--text-color); cursor: pointer; transition: all 0.25s ease; }
.featured-card:hover { border-color: var(--tool-color); transform: translateY(-2px); box-shadow: 0 8px 26px rgba(0, 217, 255, 0.12); }
.tool-icon, .category-icon { font-size: 1.8rem; filter: drop-shadow(0 0 8px var(--tool-color)); }
.tool-content { display: grid; gap: 0.25rem; }
.tool-content strong { font-size: 0.98rem; }
.tool-content small, .tool-desc { color: var(--text-muted); line-height: 1.5; }
.tool-arrow { color: var(--text-muted); transition: all 0.25s ease; }
.featured-card:hover .tool-arrow, .tool-card:hover .tool-arrow { color: var(--tool-color); transform: translateX(4px); }
.tools-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(245px, 1fr)); gap: 1rem; }
.tool-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.35rem; cursor: pointer; transition: all 0.25s ease; position: relative; overflow: hidden; }
.tool-card::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 3px; background: var(--tool-color); transform: scaleX(0); transform-origin: left; transition: transform 0.25s ease; }
.tool-card:hover { border-color: var(--tool-color); transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0, 217, 255, 0.12); }
.tool-card:hover::before { transform: scaleX(1); }
.category-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.tool-title { font-size: 1.12rem; font-weight: 700; margin-bottom: 0.45rem; }
.seo-copy { margin-top: 2rem; padding: 1.5rem; }
@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; }
  .featured-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .section-header { display: block; }
  .section-header h2 { margin-bottom: 0.35rem; }
}
@media (max-width: 560px) {
  .hero-copy { padding: 1.4rem; }
  .featured-grid { grid-template-columns: 1fr; }
}
</style>
