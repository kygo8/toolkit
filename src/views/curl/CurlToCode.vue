<script setup>
import { ref, computed } from 'vue'

const curlInput = ref('')
const targetLang = ref('python')
const copied = ref(false)

const parseCurl = (cmd) => {
  const result = { method: 'GET', url: '', headers: {}, data: '', form: {} }
  const tokens = []
  let current = '', inQuote = false, quoteChar = ''
  const cleaned = cmd.replace(/\\\n/g, ' ').replace(/\r/g, '').trim()
  const str = cleaned.replace(/^curl\s+/, '')
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (inQuote) { if (ch === quoteChar) inQuote = false; else current += ch }
    else if (ch === '"' || ch === "'") { inQuote = true; quoteChar = ch }
    else if (ch === ' ' || ch === '\t') { if (current) { tokens.push(current); current = '' } }
    else { current += ch }
  }
  if (current) tokens.push(current)
  let i = 0
  while (i < tokens.length) {
    const t = tokens[i]
    if (t === '-X' || t === '--request') { result.method = tokens[++i] || 'GET' }
    else if (t === '-H' || t === '--header') { const h = tokens[++i] || ''; const idx = h.indexOf(':'); if (idx > 0) result.headers[h.slice(0,idx).trim()] = h.slice(idx+1).trim() }
    else if (t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-binary') { result.data = tokens[++i] || ''; if (result.method === 'GET') result.method = 'POST' }
    else if (t === '-F' || t === '--form') { const f = tokens[++i] || ''; const idx = f.indexOf('='); if (idx > 0) result.form[f.slice(0,idx)] = f.slice(idx+1); if (result.method === 'GET') result.method = 'POST' }
    else if (t === '-u' || t === '--user') { result.headers['Authorization'] = 'Basic ' + btoa(tokens[++i] || '') }
    else if (t === '-b' || t === '--cookie') { result.headers['Cookie'] = tokens[++i] || '' }
    else if (t === '-A' || t === '--user-agent') { result.headers['User-Agent'] = tokens[++i] || '' }
    else if (t === '-o' || t === '--output' || t === '-s' || t === '-S' || t === '-L' || t === '-k' || t === '-v' || t === '-i' || t === '-N' || t === '-g' || t === '--compressed' || t === '--silent' || t === '--show-error' || t === '--location' || t === '--insecure' || t === '--verbose' || t === '--include' || t === '--no-buffer' || t === '--globoff') { /* skip */ }
    else if (!t.startsWith('-') && !result.url) { result.url = t.replace(/^['"]|['"]$/g, '') }
    i++
  }
  return result
}

const generateCode = (parsed, lang) => {
  const { method, url, headers, data } = parsed
  const h = Object.entries(headers)
  const safeData = (d) => d.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"')
  let bodyStr = data
  try { bodyStr = JSON.stringify(JSON.parse(data), null, 2) } catch { /* keep raw */ }

  const langs = {
    python: () => {
      let code = 'import requests\n\n'
      code += `url = "${safeData(url)}"\n`
      if (h.length) { code += 'headers = {\n'; h.forEach(([k,v]) => { code += `    "${safeData(k)}": "${safeData(v)}",\n` }); code += '}\n' }
      if (data) {
        let isJson = false; try { JSON.parse(data); isJson = true } catch {}
        if (isJson) {
          code += `json_data = ${bodyStr}\n\n`
          code += `response = requests.${method.toLowerCase()}(url`
          if (h.length) code += ', headers=headers'
          code += ', json=json_data'
        } else {
          code += `data = "${safeData(data)}"\n\n`
          code += `response = requests.${method.toLowerCase()}(url`
          if (h.length) code += ', headers=headers'
          code += ', data=data'
        }
      } else {
        code += `\nresponse = requests.${method.toLowerCase()}(url`
        if (h.length) code += ', headers=headers'
      }
      code += ')\n\nprint(response.status_code)\nprint(response.text)'
      return code
    },
    javascript: () => {
      let code = 'const response = await fetch(\n'
      code += `  "${safeData(url)}",\n  {\n`
      code += `    method: "${method}",\n`
      if (h.length) {
        code += '    headers: {\n'
        h.forEach(([k,v]) => { code += `      "${safeData(k)}": "${safeData(v)}",\n` })
        code += '    },\n'
      }
      if (data) {
        let isJson = false; try { JSON.parse(data); isJson = true } catch {}
        code += isJson ? `    body: JSON.stringify(${bodyStr}),\n` : `    body: "${safeData(data)}",\n`
      }
      code += '  }\n);\n\nconst data = await response.json();\nconsole.log(data);'
      return code
    },
    axios: () => {
      let code = 'const axios = require("axios");\n\n'
      code += `const response = await axios({\n  method: "${method.toLowerCase()}",\n  url: "${safeData(url)}",\n`
      if (h.length) { code += '  headers: {\n'; h.forEach(([k,v]) => { code += `    "${safeData(k)}": "${safeData(v)}",\n` }); code += '  },\n' }
      if (data) {
        let isJson = false; try { JSON.parse(data); isJson = true } catch {}
        code += isJson ? `  data: ${bodyStr},\n` : `  data: "${safeData(data)}",\n`
      }
      code += '});\n\nconsole.log(response.data);'
      return code
    },
    go: () => {
      let code = 'package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n'
      if (data) code += '\t"strings"\n'
      code += ')\n\nfunc main() {\n'
      if (data) {
        code += `\tbody := strings.NewReader(\`${data}\`)\n`
        code += `\treq, _ := http.NewRequest("${method}", "${safeData(url)}", body)\n`
      } else {
        code += `\treq, _ := http.NewRequest("${method}", "${safeData(url)}", nil)\n`
      }
      h.forEach(([k,v]) => { code += `\treq.Header.Set("${safeData(k)}", "${safeData(v)}")\n` })
      code += '\tclient := &http.Client{}\n\tresp, _ := client.Do(req)\n\tdefer resp.Body.Close()\n\tbody, _ := io.ReadAll(resp.Body)\n\tfmt.Println(string(body))\n}'
      return code
    },
    php: () => {
      let code = '<?php\n\n$ch = curl_init();\n\n'
      code += `curl_setopt($ch, CURLOPT_URL, "${safeData(url)}");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");\n`
      if (h.length) {
        code += 'curl_setopt($ch, CURLOPT_HTTPHEADER, [\n'
        h.forEach(([k,v]) => { code += `    "${safeData(k)}: ${safeData(v)}",\n` })
        code += ']);\n'
      }
      if (data) code += `curl_setopt($ch, CURLOPT_POSTFIELDS, '${safeData(data)}');\n`
      code += '\n$response = curl_exec($ch);\ncurl_close($ch);\n\necho $response;\n'
      return code
    },
    java: () => {
      let code = 'import java.net.http.*;\nimport java.net.URI;\nimport java.net.http.HttpRequest.BodyPublishers;\n\n'
      let bodyArg = data ? `BodyPublishers.ofString("${safeData(data)}")` : 'HttpRequest.BodyPublishers.noBody()'
      let builderLines = ''
      h.forEach(([k,v]) => { builderLines += `\n    .header("${safeData(k)}", "${safeData(v)}")` })
      code += `HttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("${safeData(url)}"))\n    .method("${method}", ${bodyArg})${builderLines}\n    .build();\n\n`
      code += 'HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());'
      return code
    }
  }

  return (langs[lang] || langs.python)()
}

const output = computed(() => {
  if (!curlInput.value.trim()) return ''
  try {
    const parsed = parseCurl(curlInput.value)
    return generateCode(parsed, targetLang.value)
  } catch { return '解析失败，请检查 cURL 命令格式' }
})

const copyResult = async () => {
  if (!output.value) return
  try { await navigator.clipboard.writeText(output.value); copied.value = true; setTimeout(() => copied.value = false, 2000) } catch {}
}

const langOptions = [
  { value: 'python', label: 'Python (requests)' },
  { value: 'javascript', label: 'JavaScript (fetch)' },
  { value: 'axios', label: 'Node.js (axios)' },
  { value: 'go', label: 'Go' },
  { value: 'php', label: 'PHP (cURL)' },
  { value: 'java', label: 'Java (HttpClient)' }
]
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔄 cURL 转代码</h1>
    <div class="card">
      <div class="form-group">
        <label class="form-label">输入 cURL 命令</label>
        <textarea v-model="curlInput" class="form-textarea" placeholder='curl https://api.example.com/users -H "Authorization: Bearer token" -X POST -d "{\"name\":\"test\"}"' rows="5"></textarea>
      </div>

      <div class="lang-bar">
        <button v-for="l in langOptions" :key="l.value" class="lang-btn" :class="{ active: targetLang === l.value }" @click="targetLang = l.value">{{ l.label }}</button>
      </div>

      <div v-if="output" class="output-section">
        <div class="output-header">
          <span class="output-title">{{ langOptions.find(l => l.value === targetLang)?.label }}</span>
          <button class="action-btn small" @click="copyResult">{{ copied ? '✓ 已复制' : '📋 复制代码' }}</button>
        </div>
        <pre class="code-output">{{ output }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page { max-width: 900px; margin: 0 auto; }
.page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; font-family: var(--font-mono); }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; }
.form-group { margin-bottom: 1rem; }
.form-label { display: block; font-weight: 500; color: var(--text-color); font-size: 0.9rem; margin-bottom: 0.375rem; }
.form-textarea { width: 100%; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; color: var(--text-color); font-family: var(--font-mono); font-size: 0.85rem; resize: vertical; line-height: 1.5; }
.form-textarea:focus { outline: none; border-color: var(--primary-color); }
.lang-bar { display: flex; gap: 0.375rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
.lang-btn { padding: 0.4rem 0.75rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
.lang-btn.active { background: var(--primary-color); border-color: var(--primary-color); color: var(--bg-color); }
.lang-btn:not(.active):hover { border-color: var(--primary-color); color: var(--primary-color); }
.output-section { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; }
.output-header { display: flex; justify-content: space-between; align-items: center; padding: 0.625rem 1rem; border-bottom: 1px solid var(--border-color); }
.output-title { font-size: 0.82rem; font-weight: 600; color: var(--primary-color); }
.action-btn { padding: 0.4rem 0.75rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-color); font-size: 0.78rem; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.action-btn.small { font-size: 0.75rem; }
.code-output { padding: 1rem; margin: 0; font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-color); white-space: pre-wrap; word-break: break-all; line-height: 1.6; max-height: 400px; overflow-y: auto; }
</style>
