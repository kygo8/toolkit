<script setup>
import { ref } from 'vue'

const input = ref('')
const results = ref({})
const error = ref('')
const copied = ref({})

const computeHash = async () => {
  if (!input.value) {
    results.value = {}
    return
  }

  error.value = ''

  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(input.value)

    const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
    const newResults = {}

    for (const algo of algos) {
      const hashBuffer = await crypto.subtle.digest(algo, data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      newResults[algo] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }

    const md5Result = computeMd5(input.value)
    newResults['MD5'] = md5Result

    results.value = newResults
  } catch (e) {
    error.value = '计算失败: ' + e.message
  }
}

const computeMd5 = (str) => {
  const md5cycle = (x, k) => {
    let a = x[0], b = x[1], c = x[2], d = x[3]
    a = ff(a, b, c, d, k[0], 7, -680876936)
    d = ff(d, a, b, c, k[1], 12, -389564586)
    c = ff(c, d, a, b, k[2], 17, 606105819)
    b = ff(b, c, d, a, k[3], 22, -1044525330)
    a = ff(a, b, c, d, k[4], 7, -176418897)
    d = ff(d, a, b, c, k[5], 12, 1200080426)
    c = ff(c, d, a, b, k[6], 17, -1473231341)
    b = ff(b, c, d, a, k[7], 22, -45705983)
    a = ff(a, b, c, d, k[8], 7, 1770035416)
    d = ff(d, a, b, c, k[9], 12, -1958414417)
    c = ff(c, d, a, b, k[10], 17, -42063)
    b = ff(b, c, d, a, k[11], 22, -1990404162)
    a = ff(a, b, c, d, k[12], 7, 1804603682)
    d = ff(d, a, b, c, k[13], 12, -40341101)
    c = ff(c, d, a, b, k[14], 17, -1502002290)
    b = ff(b, c, d, a, k[15], 22, 1236535329)
    a = gg(a, b, c, d, k[1], 5, -165796510)
    d = gg(d, a, b, c, k[6], 9, -1069501632)
    c = gg(c, d, a, b, k[11], 14, 643717713)
    b = gg(b, c, d, a, k[0], 20, -373897302)
    a = gg(a, b, c, d, k[5], 5, -701558691)
    d = gg(d, a, b, c, k[10], 9, 38016083)
    c = gg(c, d, a, b, k[15], 14, -660478335)
    b = gg(b, c, d, a, k[4], 20, -405537848)
    a = gg(a, b, c, d, k[9], 5, 568446438)
    d = gg(d, a, b, c, k[14], 9, -1019803690)
    c = gg(c, d, a, b, k[3], 14, -187363961)
    b = gg(b, c, d, a, k[8], 20, 1163531501)
    a = gg(a, b, c, d, k[13], 5, -1444681467)
    d = gg(d, a, b, c, k[2], 9, -51403784)
    c = gg(c, d, a, b, k[7], 14, 1735328473)
    b = gg(b, c, d, a, k[12], 20, -1926607734)
    a = hh(a, b, c, d, k[5], 4, -378558)
    d = hh(d, a, b, c, k[8], 11, -2022574463)
    c = hh(c, d, a, b, k[11], 16, 1839030562)
    b = hh(b, c, d, a, k[14], 23, -35309556)
    a = hh(a, b, c, d, k[1], 4, -1530992060)
    d = hh(d, a, b, c, k[4], 11, 1272893353)
    c = hh(c, d, a, b, k[7], 16, -155497632)
    b = hh(b, c, d, a, k[10], 23, -1094730640)
    a = hh(a, b, c, d, k[13], 4, 681279174)
    d = hh(d, a, b, c, k[0], 11, -358537222)
    c = hh(c, d, a, b, k[3], 16, -722521979)
    b = hh(b, c, d, a, k[6], 23, 76029189)
    a = hh(a, b, c, d, k[9], 4, -640364487)
    d = hh(d, a, b, c, k[12], 11, -421815835)
    c = hh(c, d, a, b, k[15], 16, 530742520)
    b = hh(b, c, d, a, k[2], 23, -995338651)
    a = ii(a, b, c, d, k[0], 6, -198630844)
    d = ii(d, a, b, c, k[7], 10, 1126891415)
    c = ii(c, d, a, b, k[14], 15, -1416354905)
    b = ii(b, c, d, a, k[5], 21, -57434055)
    a = ii(a, b, c, d, k[12], 6, 1700485571)
    d = ii(d, a, b, c, k[3], 10, -1894986606)
    c = ii(c, d, a, b, k[10], 15, -1051523)
    b = ii(b, c, d, a, k[1], 21, -2054922799)
    a = ii(a, b, c, d, k[8], 6, 1873313359)
    d = ii(d, a, b, c, k[15], 10, -30611744)
    c = ii(c, d, a, b, k[6], 15, -1560198380)
    b = ii(b, c, d, a, k[13], 21, 1309151649)
    a = ii(a, b, c, d, k[4], 6, -145523070)
    d = ii(d, a, b, c, k[11], 10, -1120210379)
    c = ii(c, d, a, b, k[2], 15, 718787259)
    b = ii(b, c, d, a, k[9], 21, -343485551)
    x[0] = add32(a, x[0])
    x[1] = add32(b, x[1])
    x[2] = add32(c, x[2])
    x[3] = add32(d, x[3])
  }

  const cmn = (q, a, b, x, s, t) => {
    a = add32(add32(a, q), add32(x, t))
    return add32((a << s) | (a >>> (32 - s)), b)
  }
  const ff = (a, b, c, d, x, s, t) => cmn((b & c) | ((~b) & d), a, b, x, s, t)
  const gg = (a, b, c, d, x, s, t) => cmn((b & d) | (c & (~d)), a, b, x, s, t)
  const hh = (a, b, c, d, x, s, t) => cmn(b ^ c ^ d, a, b, x, s, t)
  const ii = (a, b, c, d, x, s, t) => cmn(c ^ (b | (~d)), a, b, x, s, t)

  const add32 = (a, b) => (a + b) & 0xFFFFFFFF

  const md5blk = (s) => {
    const md5blks = []
    for (let i = 0; i < 64; i += 4)
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24)
    return md5blks
  }

  let n = str.length
  let state = [1732584193, -271733879, -1732584194, 271733878]
  let i
  for (i = 64; i <= n; i += 64)
    md5cycle(state, md5blk(str.substring(i - 64, i)))
  str = str.substring(i - 64)
  const tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  for (i = 0; i < str.length; i++)
    tail[i >> 2] |= str.charCodeAt(i) << ((i % 4) << 3)
  tail[i >> 2] |= 0x80 << ((i % 4) << 3)
  if (i > 55) {
    md5cycle(state, tail)
    for (i = 0; i < 16; i++) tail[i] = 0
  }
  tail[14] = n * 8
  md5cycle(state, tail)
  return hex(state)
}

const hex = (x) => {
  let s = ''
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < 4; j++)
      s += ((x[i] >> (j * 8 + 4)) & 0x0F).toString(16) + ((x[i] >> (j * 8)) & 0x0F).toString(16)
  }
  return s
}

const copyHash = async (algo) => {
  if (!results.value[algo]) return
  try {
    await navigator.clipboard.writeText(results.value[algo])
    copied.value[algo] = true
    setTimeout(() => copied.value[algo] = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const clearAll = () => {
  input.value = ''
  results.value = {}
}
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title"># MD5 / Hash</h1>

    <div class="card">
      <div class="input-section">
        <label class="form-label">输入文本</label>
        <textarea
          v-model="input"
          class="form-textarea"
          placeholder="输入要计算哈希值的文本..."
          @input="computeHash"
        ></textarea>
      </div>

      <div v-if="Object.keys(results).length > 0" class="results-section">
        <div
          v-for="(hash, algo) in results"
          :key="algo"
          class="hash-item"
        >
          <div class="hash-header">
            <span class="hash-algo">{{ algo }}</span>
            <button class="copy-btn-small" @click="copyHash(algo)">
              {{ copied[algo] ? '✓ 已复制' : '📋 复制' }}
            </button>
          </div>
          <div class="hash-value">{{ hash }}</div>
        </div>
      </div>

      <div class="clear-section">
        <button class="clear-btn" @click="clearAll">✕ 清空</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 800px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.input-section { margin-bottom: 1.25rem; }
.form-label { display: block; font-weight: 500; color: var(--text-color); font-size: 0.9rem; margin-bottom: 0.5rem; }
.form-textarea { width: 100%; min-height: 100px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.875rem; color: var(--text-color); resize: vertical; line-height: 1.6; }
.form-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.results-section { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; }
.hash-item { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
.hash-header { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; border-bottom: 1px solid var(--border-color); background: rgba(0, 217, 255, 0.05); }
.hash-algo { font-weight: 600; font-size: 0.85rem; color: var(--primary-color); font-family: var(--font-mono); }
.copy-btn-small { padding: 0.25rem 0.5rem; background: transparent; border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; transition: all 0.2s ease; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
.hash-value { padding: 0.75rem 1rem; font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-color); word-break: break-all; line-height: 1.5; }
.clear-section { text-align: center; }
.clear-btn { padding: 0.5rem 1.25rem; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; transition: all 0.3s ease; }
.clear-btn:hover { border-color: #ef4444; color: #ef4444; }
</style>
