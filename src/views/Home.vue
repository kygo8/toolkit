<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { categoryCatalog, featuredToolKeys } from '../i18n/catalog.js'
import { useI18n } from '../i18n/useI18n.js'

const router = useRouter()
const { t, tool, category } = useI18n()

const featuredTools = computed(() => featuredToolKeys.map((key) => tool(key)))

const categories = computed(() => (
  ['image', 'network', 'codec', 'dev', 'qrcode', 'seo', 'other'].map((key) => ({
    ...categoryCatalog[key],
    ...category(key)
  }))
))

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">{{ t('home.eyebrow') }}</p>
        <h1 class="hero-title">{{ t('home.title') }}</h1>
        <p class="hero-subtitle">
          {{ t('home.subtitle') }}
        </p>
      </div>
      <div class="hero-panel">
        <span class="panel-label">{{ t('home.panelLabel') }}</span>
        <strong>35+</strong>
        <p>{{ t('home.panelBody') }}</p>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>{{ t('home.featuredTitle') }}</h2>
        <p>{{ t('home.featuredDesc') }}</p>
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
        <h2>{{ t('home.categoriesTitle') }}</h2>
        <p>{{ t('home.categoriesDesc') }}</p>
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
      <h2>{{ t('home.seoTitle') }}</h2>
      <p>
        {{ t('home.seoBody') }}
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
