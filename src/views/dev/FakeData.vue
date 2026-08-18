<script setup>
import { ref } from 'vue'
import { generateFakeData } from '~/src/utils/fakeData.js'

const locale = ref('zh-CN')
const count = ref(5)
const fields = ref({
  name: true,
  email: true,
  phone: true,
  address: true,
  uuid: true,
  lorem: false
})
const rows = ref([])
const copied = ref('')

const fieldList = [
  { key: 'name', label: '姓名' },
  { key: 'email', label: '邮箱' },
  { key: 'phone', label: '电话' },
  { key: 'address', label: '地址' },
  { key: 'uuid', label: 'UUID' },
  { key: 'lorem', label: 'Lorem' }
]

const generate = () => {
  rows.value = generateFakeData({ locale: locale.value, count: count.value })
}

const visibleKeys = () => fieldList.filter((field) => fields.value[field.key]).map((field) => field.key)

const rowText = (row) => visibleKeys().map((key) => row[key]).join('\t')

const copyOne = async (row, index) => {
  try {
    await navigator.clipboard.writeText(rowText(row))
    copied.value = String(index)
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {}
}

const copyAll = async () => {
  if (!rows.value.length) return
  const keys = visibleKeys()
  const header = keys.join('\t')
  const body = rows.value.map((row) => keys.map((key) => row[key]).join('\t')).join('\n')
  try {
    await navigator.clipboard.writeText(`${header}\n${body}`)
    copied.value = 'all'
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {}
}

const copyJson = async () => {
  if (!rows.value.length) return
  const keys = visibleKeys()
  const payload = rows.value.map((row) => Object.fromEntries(keys.map((key) => [key, row[key]])))
  try {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    copied.value = 'json'
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {}
}

generate()
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🎲 假数据生成</h1>

    <div class="card">
      <div class="config-row">
        <div class="config-item">
          <label class="config-label">语言</label>
          <select v-model="locale" class="form-select-sm">
            <option value="zh-CN">中文</option>
            <option value="en">English</option>
          </select>
        </div>
        <div class="config-item">
          <label class="config-label">数量</label>
          <select v-model.number="count" class="form-select-sm">
            <option :value="1">1</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </div>
        <label v-for="field in fieldList" :key="field.key" class="checkbox-label">
          <input type="checkbox" v-model="fields[field.key]" />
          <span class="checkbox-custom"></span>
          {{ field.label }}
        </label>
        <button class="action-btn primary" @click="generate">🔄 生成</button>
        <button class="action-btn" @click="copyAll">{{ copied === 'all' ? '✓ 已复制' : '📋 复制全部' }}</button>
        <button class="action-btn" @click="copyJson">{{ copied === 'json' ? '✓ 已复制' : '📋 复制 JSON' }}</button>
      </div>

      <div v-if="rows.length" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th v-for="field in fieldList" v-show="fields[field.key]" :key="field.key">{{ field.label }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="index">
              <td>{{ index + 1 }}</td>
              <td v-for="field in fieldList" v-show="fields[field.key]" :key="field.key">{{ row[field.key] }}</td>
              <td>
                <button class="copy-btn-small" @click="copyOne(row, index)">{{ copied === String(index) ? '✓' : '📋' }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 1100px; margin: 0 auto; }
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
.action-btn { padding: 0.5rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-color); font-size: 0.85rem; cursor: pointer; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.table-wrap { overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.data-table th, .data-table td { border-bottom: 1px solid var(--border-color); padding: 0.55rem 0.5rem; text-align: left; vertical-align: top; }
.data-table th { color: var(--text-muted); font-weight: 600; }
.data-table td { color: var(--text-color); font-family: var(--font-mono); word-break: break-all; }
.copy-btn-small { padding: 0.15rem 0.4rem; background: transparent; border: 1px solid var(--border-color); border-radius: 3px; color: var(--text-muted); font-size: 0.65rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
</style>
