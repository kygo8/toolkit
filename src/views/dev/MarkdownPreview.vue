<script setup>
import { computed, ref } from 'vue'
import { renderMarkdown } from '~/src/utils/markdown.js'

const source = ref('# Hello ToolX\n\n在这里编写 **Markdown**，右侧会实时预览。\n\n- 支持列表\n- 支持 `code`\n- 支持 [链接](https://toolx.app)\n')
const copied = ref(false)

const html = computed(() => renderMarkdown(source.value))

const copyHtml = async () => {
  if (!html.value) return
  try {
    await navigator.clipboard.writeText(html.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

const clearAll = () => { source.value = '' }
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">📝 Markdown 预览</h1>

    <div class="card">
      <div class="toolbar">
        <button class="action-btn primary" @click="copyHtml">{{ copied ? '✓ 已复制' : '📋 复制 HTML' }}</button>
        <button class="action-btn" @click="clearAll">✕ 清空</button>
      </div>

      <div class="split">
        <div class="panel">
          <label class="panel-label">Markdown</label>
          <textarea v-model="source" class="panel-textarea" placeholder="输入 Markdown..."></textarea>
        </div>
        <div class="panel">
          <label class="panel-label">预览</label>
          <div class="preview" v-html="html"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 1100px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.toolbar { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.action-btn { padding: 0.5rem 1rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-color); font-size: 0.85rem; cursor: pointer; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.panel { display: flex; flex-direction: column; min-height: 420px; }
.panel-label { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.panel-textarea { flex: 1; width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-color); resize: vertical; line-height: 1.6; }
.panel-textarea:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1); }
.preview { flex: 1; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem 1.25rem; color: var(--text-color); overflow: auto; line-height: 1.7; }
.preview :deep(h1), .preview :deep(h2), .preview :deep(h3) { margin: 0.4em 0 0.6em; }
.preview :deep(pre), .preview :deep(code) { font-family: var(--font-mono); background: rgba(0, 217, 255, 0.08); border-radius: 4px; }
.preview :deep(pre) { padding: 0.75rem; overflow: auto; }
.preview :deep(code) { padding: 0.1rem 0.3rem; }
.preview :deep(a) { color: var(--primary-color); }
.preview :deep(ul), .preview :deep(ol) { padding-left: 1.25rem; }
@media (max-width: 800px) { .split { grid-template-columns: 1fr; } }
</style>
