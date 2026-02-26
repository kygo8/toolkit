<script setup>
import { ref, computed, watch } from 'vue'

const length = ref(16)
const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSpecial = ref(true)

const password = ref('')
const copied = ref(false)

const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
const numberChars = '0123456789'
const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

const generatePassword = () => {
  let chars = ''
  if (includeUppercase.value) chars += uppercaseChars
  if (includeLowercase.value) chars += lowercaseChars
  if (includeNumbers.value) chars += numberChars
  if (includeSpecial.value) chars += specialChars
  
  if (!chars) {
    chars = lowercaseChars
    includeLowercase.value = true
  }
  
  let result = ''
  for (let i = 0; i < length.value; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password.value = result
}

const strength = computed(() => {
  if (!password.value) return { level: 0, label: '无', color: '#666' }
  
  let score = 0
  const p = password.value
  
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (p.length >= 16) score++
  if (/[a-z]/.test(p)) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^a-zA-Z0-9]/.test(p)) score++
  
  if (score <= 2) return { level: 1, label: '弱', color: '#ef4444' }
  if (score <= 4) return { level: 2, label: '中', color: '#f59e0b' }
  return { level: 3, label: '强', color: '#10b981' }
})

const strengthPercent = computed(() => {
  return (strength.value.level / 3) * 100
})

const copyPassword = async () => {
  if (!password.value) return
  try {
    await navigator.clipboard.writeText(password.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

watch([length, includeUppercase, includeLowercase, includeNumbers, includeSpecial], () => {
  generatePassword()
}, { immediate: true })
</script>

<template>
  <div class="tool-page">
    <h1 class="page-title">🔑 随机密码生成</h1>
    
    <div class="card">
      <div class="result-section">
        <div class="password-display">
          <input 
            type="text" 
            :value="password" 
            readonly 
            class="password-input"
            placeholder="点击生成密码"
          />
          <button class="copy-btn" @click="copyPassword" :class="{ copied }">
            {{ copied ? '✓ 已复制' : '📋 复制' }}
          </button>
        </div>
        
        <div class="strength-bar">
          <div class="strength-track">
            <div 
              class="strength-fill"
              :style="{ 
                width: strengthPercent + '%',
                backgroundColor: strength.color
              }"
            ></div>
          </div>
          <span class="strength-label" :style="{ color: strength.color }">
            {{ strength.label }}
          </span>
        </div>
      </div>

      <div class="options-section">
        <div class="option-group">
          <label class="option-label">密码长度: {{ length }}</label>
          <input 
            type="range" 
            v-model.number="length" 
            min="8" 
            max="64" 
            class="slider"
          />
          <div class="slider-labels">
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        <div class="checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="includeUppercase" />
            <span class="checkbox-custom"></span>
            大写字母 (A-Z)
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="includeLowercase" />
            <span class="checkbox-custom"></span>
            小写字母 (a-z)
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="includeNumbers" />
            <span class="checkbox-custom"></span>
            数字 (0-9)
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="includeSpecial" />
            <span class="checkbox-custom"></span>
            特殊字符 (!@#$%...)
          </label>
        </div>

        <button class="generate-btn" @click="generatePassword">
          🔄 重新生成
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-page {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-family: var(--font-mono);
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
}

.result-section {
  margin-bottom: 1.5rem;
}

.password-display {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.password-input {
  flex: 1;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 1.125rem;
  color: var(--primary-color);
  letter-spacing: 2px;
}

.password-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
}

.copy-btn {
  padding: 1rem 1.25rem;
  background: var(--primary-color);
  color: var(--bg-color);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.copy-btn:hover {
  filter: brightness(1.1);
}

.copy-btn.copied {
  background: #10b981;
}

.strength-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.strength-track {
  flex: 1;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.strength-label {
  font-weight: 600;
  font-size: 0.875rem;
  min-width: 40px;
}

.options-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-label {
  font-weight: 500;
  color: var(--text-color);
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: var(--border-color);
  appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 0.75rem;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.9rem;
}

.checkbox-label input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-label input:checked + .checkbox-custom {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: '✓';
  color: var(--bg-color);
  font-size: 12px;
  font-weight: bold;
}

.generate-btn {
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 217, 255, 0.4);
}

@media (max-width: 480px) {
  .checkbox-group {
    grid-template-columns: 1fr;
  }
  
  .password-display {
    flex-direction: column;
  }
  
  .copy-btn {
    width: 100%;
  }
}
</style>
