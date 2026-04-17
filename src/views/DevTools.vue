<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const devTools = [
  {
    path: '/dev/timestamp',
    icon: '🕐',
    title: '时间戳转换',
    desc: 'Unix 时间戳与日期时间互转',
    color: '#00d9ff'
  },
  {
    path: '/dev/color',
    icon: '🎨',
    title: '颜色转换',
    desc: 'HEX、RGB、HSL 颜色格式互转',
    color: '#7c3aed'
  },
  {
    path: '/dev/regex',
    icon: '🔍',
    title: '正则测试',
    desc: '正则表达式在线测试与匹配',
    color: '#10b981'
  },
  {
    path: '/dev/number-base',
    icon: '🔢',
    title: '进制转换',
    desc: '二进制、八进制、十进制、十六进制互转',
    color: '#f59e0b'
  },
  {
    path: '/dev/uuid',
    icon: '🆔',
    title: 'UUID 生成',
    desc: '批量生成 UUID v4',
    color: '#ec4899'
  },
  {
    path: '/dev/text-diff',
    icon: '📄',
    title: '文本对比',
    desc: '对比两段文本的差异',
    color: '#14b8a6'
  }
]

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🛠️ 开发者工具</h1>

    <div class="tools-grid">
      <div
        v-for="tool in devTools"
        :key="tool.path"
        class="tool-card"
        @click="navigateTo(tool.path)"
      >
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
