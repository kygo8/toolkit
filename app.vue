<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { navItems } from './src/i18n/catalog.js'
import { useI18n } from './src/i18n/useI18n.js'

const route = useRoute()
const isMenuOpen = ref(false)
const theme = ref('dark')
const { locale, locales, initLocale, setLocale, t } = useI18n()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const themeLabel = computed(() => theme.value === 'dark' ? t('common.themeLight') : t('common.themeDark'))
const themeIcon = computed(() => theme.value === 'dark' ? '☀️' : '🌙')

const applyTheme = (value) => {
  if (!process.client) return
  document.documentElement.setAttribute('data-theme', value)
  document.documentElement.style.colorScheme = value
}

const setTheme = (value) => {
  theme.value = value
  applyTheme(value)
  if (process.client) {
    localStorage.setItem('toolx-theme', value)
  }
}

const toggleTheme = () => {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}

onMounted(() => {
  initLocale()
  const savedTheme = localStorage.getItem('toolx-theme')
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches
  setTheme(savedTheme || (prefersLight ? 'light' : 'dark'))
})
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <NuxtLink to="/" class="logo" @click="closeMenu">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">ToolX</span>
        </NuxtLink>

        <div class="header-actions">
          <button class="menu-toggle" type="button" @click="toggleMenu" :aria-label="t('common.menuToggle')">
            <span class="hamburger" :class="{ open: isMenuOpen }"></span>
          </button>

          <nav class="nav" :class="{ open: isMenuOpen }">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="nav-link"
              :class="{ active: route.path === item.path }"
              @click="closeMenu"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ t(`nav.${item.key}`) }}</span>
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="main">
      <NuxtPage />
    </main>

    <footer class="footer">
      <p>© 2026 {{ t('common.footerText') }}</p>
      <div class="footer-actions">
        <label class="language-picker">
          <span>{{ t('common.language') }}</span>
          <select :value="locale" @change="setLocale($event.target.value)">
            <option v-for="item in locales" :key="item.code" :value="item.code">
              {{ item.nativeName }}
            </option>
          </select>
        </label>
        <button class="theme-toggle" type="button" :aria-label="themeLabel" @click="toggleTheme">
          <span>{{ themeIcon }}</span>
          <span class="theme-label">{{ themeLabel }}</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-family: var(--font-mono);
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  padding: 0.54rem 0.78rem;
  transition: all 0.25s ease;
}

.theme-toggle:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: 0 6px 18px var(--shadow-color);
}

.theme-label {
  font-size: 0.8rem;
  white-space: nowrap;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-color);
  position: relative;
  transition: background 0.3s;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: var(--text-color);
  left: 0;
  transition: transform 0.3s;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.hamburger.open {
  background: transparent;
}

.hamburger.open::before {
  transform: rotate(45deg) translate(5px, 6px);
}

.hamburger.open::after {
  transform: rotate(-45deg) translate(5px, -6px);
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.82rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.86rem;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.nav-link:hover {
  background: rgba(0, 217, 255, 0.1);
  border-color: rgba(0, 217, 255, 0.3);
}

.nav-link.active {
  background: rgba(0, 217, 255, 0.15);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.nav-icon {
  font-size: 1rem;
}

.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  border-top: 1px solid var(--border-color);
}

.footer-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.language-picker {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--text-muted);
}

.language-picker select {
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.language-picker select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--shadow-color);
}

@media (max-width: 900px) {
  .menu-toggle {
    display: block;
  }

  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--header-bg);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem;
    gap: 0.5rem;
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .nav.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav-link {
    justify-content: center;
  }
}

@media (max-width: 520px) {
  .theme-label,
  .language-picker span {
    display: none;
  }
}
</style>
