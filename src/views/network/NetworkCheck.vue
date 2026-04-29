<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const isOnline = ref(true)
const checkedAt = ref('')
const latency = ref(null)
const statusText = ref('尚未检测')
const isChecking = ref(false)
const errorText = ref('')
const connectionInfo = ref({
  effectiveType: '未知',
  downlink: '未知',
  rtt: '未知',
  saveData: false
})

const onlineLabel = computed(() => isOnline.value ? '在线' : '离线')

const refreshConnection = () => {
  if (!process.client) return
  isOnline.value = navigator.onLine
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  connectionInfo.value = {
    effectiveType: connection?.effectiveType || '未知',
    downlink: connection?.downlink ? `${connection.downlink} Mbps` : '未知',
    rtt: connection?.rtt ? `${connection.rtt} ms` : '未知',
    saveData: Boolean(connection?.saveData)
  }
}

const runCheck = async () => {
  if (!process.client) return
  isChecking.value = true
  errorText.value = ''
  statusText.value = '检测中...'
  checkedAt.value = new Date().toLocaleString()
  refreshConnection()

  const started = performance.now()
  try {
    const response = await fetch('/robots.txt', {
      method: 'GET',
      cache: 'no-store'
    })
    latency.value = Math.round(performance.now() - started)
    statusText.value = response.ok ? `本站连通正常 (HTTP ${response.status})` : `本站响应异常 (HTTP ${response.status})`
  } catch (error) {
    latency.value = null
    statusText.value = '检测失败'
    errorText.value = error.message
  } finally {
    isChecking.value = false
  }
}

onMounted(() => {
  refreshConnection()
  runCheck()
  window.addEventListener('online', refreshConnection)
  window.addEventListener('offline', refreshConnection)
})

onUnmounted(() => {
  if (!process.client) return
  window.removeEventListener('online', refreshConnection)
  window.removeEventListener('offline', refreshConnection)
})
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">📡 网络检测</h1>
    <div class="dashboard">
      <div class="metric-card status" :class="{ offline: !isOnline }">
        <span class="metric-label">浏览器联网状态</span>
        <strong>{{ onlineLabel }}</strong>
        <p>{{ checkedAt || '等待检测' }}</p>
      </div>
      <div class="metric-card">
        <span class="metric-label">本站连通性</span>
        <strong>{{ statusText }}</strong>
        <p v-if="latency !== null">响应延迟 {{ latency }} ms</p>
        <p v-else>暂无延迟数据</p>
      </div>
      <div class="metric-card">
        <span class="metric-label">网络类型</span>
        <strong>{{ connectionInfo.effectiveType }}</strong>
        <p>下行 {{ connectionInfo.downlink }} · RTT {{ connectionInfo.rtt }}</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <h2>连接详情</h2>
          <p>浏览器可见的网络信息会因设备和浏览器而异。</p>
        </div>
        <button class="action-btn primary" @click="runCheck" :disabled="isChecking">
          {{ isChecking ? '检测中...' : '重新检测' }}
        </button>
      </div>

      <div class="detail-grid">
        <div class="detail-item">
          <span>省流量模式</span>
          <strong>{{ connectionInfo.saveData ? '已开启' : '未开启 / 未知' }}</strong>
        </div>
        <div class="detail-item">
          <span>检测目标</span>
          <strong>/robots.txt</strong>
        </div>
        <div class="detail-item">
          <span>检测方式</span>
          <strong>浏览器 Fetch</strong>
        </div>
      </div>

      <div v-if="errorText" class="error-msg">检测失败：{{ errorText }}</div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 900px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem; }
.metric-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; padding: 1.25rem; }
.metric-card.status { border-color: rgba(16, 185, 129, 0.45); }
.metric-card.status.offline { border-color: rgba(239, 68, 68, 0.55); }
.metric-label { display: block; color: var(--text-muted); font-size: 0.78rem; margin-bottom: 0.5rem; }
.metric-card strong { display: block; color: var(--primary-color); font-size: 1.25rem; margin-bottom: 0.4rem; }
.metric-card p { color: var(--text-muted); font-size: 0.85rem; }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 14px; padding: 1.5rem; }
.card-header { display: flex; justify-content: space-between; gap: 1rem; align-items: center; margin-bottom: 1rem; }
.card-header h2 { font-size: 1.1rem; margin-bottom: 0.25rem; }
.card-header p { color: var(--text-muted); font-size: 0.88rem; }
.action-btn { padding: 0.55rem 1rem; border: 1px solid var(--border-color); border-radius: 8px; background: transparent; color: var(--text-color); cursor: pointer; }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); font-weight: 700; }
.action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; }
.detail-item { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.85rem; }
.detail-item span { display: block; color: var(--text-muted); font-size: 0.76rem; margin-bottom: 0.3rem; }
.detail-item strong { color: var(--text-color); font-size: 0.9rem; }
.error-msg { margin-top: 1rem; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 8px; padding: 0.75rem; }
@media (max-width: 640px) { .card-header { flex-direction: column; align-items: stretch; } }
</style>
