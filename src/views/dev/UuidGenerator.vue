<script setup>
import { ref } from 'vue'

const count = ref(5)
const uppercase = ref(false)
const uuids = ref([])
const copied = ref('')

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const generate = () => {
  uuids.value = []
  for (let i = 0; i < count.value; i++) {
    let uuid = generateUUID()
    if (uppercase.value) uuid = uuid.toUpperCase()
    uuids.value.push(uuid)
  }
}

const copyOne = async (uuid, index) => {
  try {
    await navigator.clipboard.writeText(uuid)
    copied.value = String(index)
    setTimeout(() => copied.value = '', 2000)
  } catch {}
}

const copyAll = async () => {
  if (uuids.value.length === 0) return
  try {
    await navigator.clipboard.writeText(uuids.value.join('\n'))
    copied.value = 'all'
    setTimeout(() => copied.value = '', 2000)
  } catch {}
}

const clearAll = () => { uuids.value = [] }

generate()
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🆔 UUID 生成</h1>

    <div class="card">
      <div class="config-row">
        <div class="config-item">
          <label class="config-label">数量</label>
          <select v-model.number="count" class="form-select-sm">
            <option :value="1">1</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
        <label class="checkbox-label">
          <input type="checkbox" v-model="uppercase" />
          <span class="checkbox-custom"></span>
          大写
        </label>
        <button class="action-btn primary" @click="generate">🔄 生成</button>
        <button v-if="uuids.length > 1" class="action-btn" @click="copyAll">{{ copied === 'all' ? '✓ 已复制' : '📋 复制全部' }}</button>
        <button class="action-btn" @click="clearAll">✕ 清空</button>
      </div>

      <div v-if="uuids.length > 0" class="uuid-list">
        <div v-for="(uuid, index) in uuids" :key="index" class="uuid-item">
          <span class="uuid-index">{{ index + 1 }}</span>
          <span class="uuid-value">{{ uuid }}</span>
          <button class="copy-btn-small" @click="copyOne(uuid, index)">{{ copied === String(index) ? '✓' : '📋' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 700px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.config-row { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.25rem; }
.config-item { display: flex; align-items: center; gap: 0.375rem; }
.config-label { font-size: 0.85rem; color: var(--text-muted); }
.form-select-sm { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.4rem; color: var(--text-color); font-size: 0.85rem; }
.checkbox-label { display: flex; align-items: center; gap: 0.375rem; cursor: pointer; font-size: 0.85rem; color: var(--text-color); }
.checkbox-label input { display: none; }
.checkbox-custom { width: 16px; height: 16px; border: 2px solid var(--border-color); border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; }
.checkbox-label input:checked + .checkbox-custom { background: var(--primary-color); border-color: var(--primary-color); }
.checkbox-label input:checked + .checkbox-custom::after { content: '✓'; color: var(--bg-color); font-size: 10px; }
.action-btn { padding: 0.5rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-color); font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.uuid-list { display: flex; flex-direction: column; gap: 0.375rem; }
.uuid-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; }
.uuid-index { color: var(--text-muted); font-size: 0.75rem; min-width: 20px; text-align: right; font-family: var(--font-mono); }
.uuid-value { flex: 1; font-family: var(--font-mono); font-size: 0.9rem; color: var(--primary-color); word-break: break-all; }
.copy-btn-small { padding: 0.15rem 0.4rem; background: transparent; border: 1px solid var(--border-color); border-radius: 3px; color: var(--text-muted); font-size: 0.65rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
</style>
