<script setup>
import { useRouter } from 'vue-router'
import { useCategoryTools } from '../i18n/useToolList.js'

const router = useRouter()
const { categoryInfo, tools } = useCategoryTools('qrcode')

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">{{ categoryInfo.icon }} {{ categoryInfo.title }}</h1>
    <div class="tools-grid">
      <div v-for="tool in tools" :key="tool.path" class="tool-card" @click="navigateTo(tool.path)">
        <div class="tool-icon" :style="{ '--tool-color': tool.color }">{{ tool.icon }}</div>
        <h3 class="tool-title">{{ tool.title }}</h3>
        <p class="tool-desc">{{ tool.desc }}</p>
        <div class="tool-arrow">→</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { padding: 1rem 0; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
.tool-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; cursor: pointer; transition: all 0.3s ease; position: relative; }
.tool-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--tool-color, var(--primary-color)); transform: scaleX(0); transition: transform 0.3s ease; }
.tool-card:hover { border-color: var(--tool-color, var(--primary-color)); transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0, 217, 255, 0.1); }
.tool-card:hover::before { transform: scaleX(1); }
.tool-icon { font-size: 2rem; margin-bottom: 0.75rem; }
.tool-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-color); }
.tool-desc { color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; }
.tool-arrow { position: absolute; bottom: 1rem; right: 1rem; color: var(--text-muted); transition: all 0.3s ease; }
.tool-card:hover .tool-arrow { color: var(--primary-color); transform: translateX(4px); }
</style>
