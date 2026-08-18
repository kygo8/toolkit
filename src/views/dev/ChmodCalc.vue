<script setup>
import { computed, ref, watch } from 'vue'
import { bitsToOctal, bitsToSymbolic, emptyBits, octalToBits, parseSymbolic } from '~/src/utils/chmod.js'

const groups = [
  { key: 'u', label: 'Owner', bits: [{ key: 'ur', label: 'r' }, { key: 'uw', label: 'w' }, { key: 'ux', label: 'x' }] },
  { key: 'g', label: 'Group', bits: [{ key: 'gr', label: 'r' }, { key: 'gw', label: 'w' }, { key: 'gx', label: 'x' }] },
  { key: 'o', label: 'Other', bits: [{ key: 'or', label: 'r' }, { key: 'ow', label: 'w' }, { key: 'ox', label: 'x' }] }
]

const bits = ref({
  ...emptyBits(),
  ur: true, uw: true, ux: true,
  gr: true, gx: true,
  or: true, ox: true
})
const octal = ref('755')
const symbolic = ref('rwxr-xr-x')
const octalError = ref('')
const symbolicError = ref('')
const copied = ref('')
let syncing = false

const applyBits = (nextBits) => {
  bits.value = { ...nextBits }
  octal.value = bitsToOctal(nextBits)
  symbolic.value = bitsToSymbolic(nextBits)
  octalError.value = ''
  symbolicError.value = ''
}

watch(bits, (next) => {
  if (syncing) return
  syncing = true
  octal.value = bitsToOctal(next)
  symbolic.value = bitsToSymbolic(next)
  octalError.value = ''
  symbolicError.value = ''
  syncing = false
}, { deep: true })

const onOctalInput = () => {
  if (syncing) return
  const next = octalToBits(octal.value)
  if (!next) {
    octalError.value = '请输入有效八进制权限，例如 755'
    return
  }
  syncing = true
  applyBits(next)
  syncing = false
}

const onSymbolicInput = () => {
  if (syncing) return
  const next = parseSymbolic(symbolic.value)
  if (!next) {
    symbolicError.value = '请输入有效符号权限，例如 rwxr-xr-x'
    return
  }
  syncing = true
  applyBits(next)
  syncing = false
}

const summary = computed(() => `${octal.value}  ${symbolic.value}`)

const copyText = async (text, key) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = key
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {}
}

const reset = () => applyBits({
  ...emptyBits(),
  ur: true, uw: true, ux: true,
  gr: true, gx: true,
  or: true, ox: true
})
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔐 权限计算</h1>

    <div class="card">
      <div class="perm-grid">
        <div v-for="group in groups" :key="group.key" class="perm-group">
          <div class="group-title">{{ group.label }}</div>
          <label v-for="bit in group.bits" :key="bit.key" class="checkbox-label">
            <input type="checkbox" v-model="bits[bit.key]" />
            <span class="checkbox-custom"></span>
            {{ bit.label }}
          </label>
        </div>
      </div>

      <div class="io-grid">
        <div class="io-item">
          <label class="form-label">八进制</label>
          <input v-model="octal" class="form-input" placeholder="755" @input="onOctalInput" />
          <div v-if="octalError" class="error-msg">{{ octalError }}</div>
        </div>
        <div class="io-item">
          <label class="form-label">符号</label>
          <input v-model="symbolic" class="form-input" placeholder="rwxr-xr-x" @input="onSymbolicInput" />
          <div v-if="symbolicError" class="error-msg">{{ symbolicError }}</div>
        </div>
      </div>

      <div class="summary">
        <span class="summary-value">{{ summary }}</span>
        <button class="copy-btn-small" @click="copyText(octal, 'octal')">{{ copied === 'octal' ? '✓' : '📋' }} 八进制</button>
        <button class="copy-btn-small" @click="copyText(symbolic, 'symbolic')">{{ copied === 'symbolic' ? '✓' : '📋' }} 符号</button>
        <button class="action-btn" @click="reset">重置 755</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 760px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.perm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
.perm-group { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: 0.55rem; }
.group-title { font-weight: 600; color: var(--primary-color); font-size: 0.85rem; }
.checkbox-label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-family: var(--font-mono); color: var(--text-color); }
.checkbox-label input { display: none; }
.checkbox-custom { width: 16px; height: 16px; border: 2px solid var(--border-color); border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; }
.checkbox-label input:checked + .checkbox-custom { background: var(--primary-color); border-color: var(--primary-color); }
.checkbox-label input:checked + .checkbox-custom::after { content: '✓'; color: var(--bg-color); font-size: 10px; }
.io-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
.form-label { display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.4rem; }
.form-input { width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; color: var(--text-color); font-family: var(--font-mono); }
.form-input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.error-msg { color: #ef4444; font-size: 0.8rem; margin-top: 0.4rem; }
.summary { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.summary-value { font-family: var(--font-mono); color: var(--primary-color); font-weight: 600; margin-right: 0.5rem; }
.copy-btn-small, .action-btn { padding: 0.35rem 0.65rem; background: transparent; border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; }
.copy-btn-small:hover, .action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
@media (max-width: 640px) {
  .perm-grid, .io-grid { grid-template-columns: 1fr; }
}
</style>
