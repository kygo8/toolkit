<script setup>
import { ref, computed, watch } from 'vue'

const hex = ref('#00d9ff')
const rgb = ref({ r: 0, g: 217, b: 255 })
const hsl = ref({ h: 190, s: 100, l: 50 })
const copied = ref('')

const isValidHex = (v) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)

const hexToRgb = (h) => {
  h = h.replace('#', '')
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2]
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) }
}

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r,g,b), min = Math.min(r,g,b)
  let h, s, l = (max+min)/2
  if (max === min) { h = s = 0 } else {
    const d = max - min
    s = l > 0.5 ? d/(2-max-min) : d/(max+min)
    switch(max) {
      case r: h = ((g-b)/d + (g<b?6:0))/6; break
      case g: h = ((b-r)/d+2)/6; break
      case b: h = ((r-g)/d+4)/6; break
    }
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) }
}

const hslToRgb = (h, s, l) => {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) { r = g = b = l } else {
    const hue2rgb = (p, q, t) => { if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p }
    const q = l<0.5 ? l*(1+s) : l+s-l*s
    const p = 2*l-q
    r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3)
  }
  return { r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255) }
}

const rgbToHex = (r, g, b) => '#' + [r,g,b].map(v => Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('')

const colorString = computed(() => {
  const {r,g,b} = rgb.value
  return `rgb(${r}, ${g}, ${b})`
})

const hslString = computed(() => {
  const {h,s,l} = hsl.value
  return `hsl(${h}, ${s}%, ${l}%)`
})

watch(hex, (v) => {
  if (!isValidHex(v)) return
  const c = hexToRgb(v)
  rgb.value = c
  hsl.value = rgbToHsl(c.r, c.g, c.b)
})

watch(rgb, (v) => {
  const h = rgbToHex(v.r, v.g, v.b)
  if (h !== hex.value) hex.value = h
  hsl.value = rgbToHsl(v.r, v.g, v.b)
}, { deep: true })

watch(hsl, (v) => {
  const c = hslToRgb(v.h, v.s, v.l)
  rgb.value = c
  const h = rgbToHex(c.r, c.g, c.b)
  if (h !== hex.value) hex.value = h
}, { deep: true })

const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = label
    setTimeout(() => copied.value = '', 2000)
  } catch {}
}

const formats = computed(() => [
  { label: 'HEX', value: hex.value },
  { label: 'RGB', value: colorString.value },
  { label: 'HSL', value: hslString.value },
  { label: 'RGBA', value: `rgba(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b}, 1)` },
  { label: 'CSS', value: hex.value }
])
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🎨 颜色转换</h1>

    <div class="card">
      <div class="preview-area">
        <div class="color-preview" :style="{ backgroundColor: hex }"></div>
        <div class="format-list">
          <div v-for="f in formats" :key="f.label" class="format-item">
            <span class="format-label">{{ f.label }}</span>
            <span class="format-value">{{ f.value }}</span>
            <button class="copy-btn-small" @click="copyText(f.value, f.label)">
              {{ copied === f.label ? '✓' : '📋' }}
            </button>
          </div>
        </div>
      </div>

      <div class="controls">
        <div class="control-group">
          <label class="control-label">HEX</label>
          <input type="color" v-model="hex" class="color-picker" />
          <input type="text" v-model="hex" class="form-input" />
        </div>

        <div class="control-group">
          <label class="control-label">RGB</label>
          <div class="rgb-inputs">
            <label class="channel">R<input type="number" v-model.number="rgb.r" min="0" max="255" class="num-input" /></label>
            <label class="channel">G<input type="number" v-model.number="rgb.g" min="0" max="255" class="num-input" /></label>
            <label class="channel">B<input type="number" v-model.number="rgb.b" min="0" max="255" class="num-input" /></label>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label">HSL</label>
          <div class="rgb-inputs">
            <label class="channel">H<input type="number" v-model.number="hsl.h" min="0" max="360" class="num-input" /></label>
            <label class="channel">S<input type="number" v-model.number="hsl.s" min="0" max="100" class="num-input" /></label>
            <label class="channel">L<input type="number" v-model.number="hsl.l" min="0" max="100" class="num-input" /></label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 800px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.preview-area { display: flex; gap: 1.25rem; margin-bottom: 1.5rem; align-items: flex-start; }
.color-preview { width: 120px; height: 120px; border-radius: 12px; border: 2px solid var(--border-color); flex-shrink: 0; }
.format-list { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.format-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.625rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; }
.format-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; min-width: 36px; font-family: var(--font-mono); }
.format-value { flex: 1; font-size: 0.82rem; color: var(--text-color); font-family: var(--font-mono); }
.copy-btn-small { padding: 0.15rem 0.35rem; background: transparent; border: 1px solid var(--border-color); border-radius: 3px; color: var(--text-muted); font-size: 0.65rem; cursor: pointer; }
.copy-btn-small:hover { border-color: var(--primary-color); color: var(--primary-color); }
.controls { display: flex; flex-direction: column; gap: 1.25rem; }
.control-group { display: flex; align-items: center; gap: 0.75rem; }
.control-label { font-weight: 600; font-size: 0.85rem; color: var(--text-color); min-width: 36px; font-family: var(--font-mono); }
.color-picker { width: 48px; height: 36px; border: 1px solid var(--border-color); border-radius: 6px; background: none; cursor: pointer; padding: 2px; }
.form-input { flex: 1; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.5rem 0.75rem; color: var(--text-color); font-size: 0.85rem; font-family: var(--font-mono); }
.form-input:focus { outline: none; border-color: var(--primary-color); }
.rgb-inputs { display: flex; gap: 0.5rem; flex: 1; }
.channel { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono); }
.num-input { width: 70px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.4rem 0.5rem; color: var(--text-color); font-size: 0.85rem; font-family: var(--font-mono); }
.num-input:focus { outline: none; border-color: var(--primary-color); }
@media (max-width: 600px) { .preview-area { flex-direction: column; } .color-preview { width: 100%; height: 80px; } }
</style>
