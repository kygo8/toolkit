<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categoryCatalog, navItems, routeKeyByPath, toolCatalog } from './src/i18n/catalog.js'
import { useI18n } from './src/i18n/useI18n.js'

const route = useRoute()
const router = useRouter()
const theme = ref('dark')
const recentToolKeys = ref(['json', 'password'])
const { locale, locales, initLocale, setLocale, t } = useI18n()
const recentToolsStorageKey = 'toolx-recent-tools'

const themeLabel = computed(() => theme.value === 'dark' ? t('common.themeLight') : t('common.themeDark'))
const themeIcon = computed(() => theme.value === 'dark' ? '☀️' : '🌙')
const activeNavItem = computed(() => {
  if (route.path === '/') return navItems[0]
  return navItems.find((item) => item.path !== '/' && route.path.startsWith(item.path)) || navItems[0]
})
const recentTools = computed(() => recentToolKeys.value.map((key) => ({ key, ...toolCatalog[key] })).filter((tool) => tool.path))
const activeToolCount = computed(() => categoryCatalog[activeNavItem.value.key]?.tools?.length || recentTools.value.length)

const normalizeRecentToolKeys = (keys) => (
  [...new Set(keys)].filter((key) => toolCatalog[key]).slice(0, 10)
)

const loadRecentToolKeys = () => {
  try {
    const savedKeys = JSON.parse(localStorage.getItem(recentToolsStorageKey) || '[]')
    return Array.isArray(savedKeys) ? savedKeys : []
  } catch {
    return []
  }
}

const saveRecentTool = (path) => {
  if (!process.client) return

  const routeMeta = routeKeyByPath[path]
  if (routeMeta?.type !== 'tool') return

  const nextKeys = normalizeRecentToolKeys([routeMeta.key, ...recentToolKeys.value])
  recentToolKeys.value = nextKeys
  localStorage.setItem(recentToolsStorageKey, JSON.stringify(nextKeys))
}

const openRecentTool = (path) => {
  if (path) router.push(path)
}

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
  const savedRecentTools = loadRecentToolKeys()

  recentToolKeys.value = normalizeRecentToolKeys(savedRecentTools.length ? savedRecentTools : recentToolKeys.value)
  setTheme(savedTheme || (prefersLight ? 'light' : 'dark'))
  saveRecentTool(route.path)
})

watch(() => route.path, (path) => {
  saveRecentTool(path)
})
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <NuxtLink to="/" class="logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-copy">
            <span class="logo-text">ToolX</span>
            <span class="logo-tagline">{{ t('home.eyebrow') }}</span>
          </span>
        </NuxtLink>

        <div class="header-center" aria-live="polite">
          <span class="section-pill">{{ t(`nav.${activeNavItem.key}`) }}</span>
          <span class="tool-count">{{ t('common.toolCount', { count: activeToolCount }) }}</span>
        </div>

        <div class="header-actions">
          <label class="recent-tools">
            <span>{{ t('common.recentTools') }}</span>
            <select
              :value="recentTools[0]?.path || ''"
              :title="recentTools[0] ? t(`tools.${recentTools[0].key}.title`) : t('common.recentTools')"
              @change="openRecentTool($event.target.value)"
            >
              <option
                v-for="item in recentTools"
                :key="item.path"
                :value="item.path"
                :title="t(`tools.${item.key}.title`)"
              >
                {{ t(`tools.${item.key}.title`) }}
              </option>
            </select>
          </label>
          <label class="language-picker">
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
      </div>

      <nav class="nav-strip" aria-label="Tool categories">
        <div class="nav-scroll">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: route.path === item.path }"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ t(`nav.${item.key}`) }}</span>
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main class="main">
      <NuxtPage />
    </main>

    <footer class="footer">
      <p>© 2026 {{ t('common.footerText') }}</p>
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
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-family: var(--font-mono);
  min-width: 0;
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

.logo-copy {
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
  line-height: 1.05;
}

.logo-tagline {
  max-width: 12rem;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.header-center {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  margin-inline: auto;
}

.section-pill {
  display: inline-flex;
  align-items: center;
  max-width: 11rem;
  padding: 0.48rem 0.75rem;
  border: 1px solid rgba(0, 217, 255, 0.28);
  border-radius: 999px;
  background: rgba(0, 217, 255, 0.08);
  color: var(--primary-color);
  font-size: 0.78rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tool-count {
  color: var(--text-muted);
  font-size: 0.74rem;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
  min-width: 0;
}

.recent-tools {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-muted);
  min-width: 0;
}

.recent-tools span {
  font-size: 0.72rem;
  white-space: nowrap;
}

.recent-tools select {
  max-width: 8.2rem;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: color-mix(in srgb, var(--card-bg) 78%, transparent);
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.recent-tools select:hover,
.recent-tools select:focus {
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: 0 6px 18px var(--shadow-color);
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
  white-space: nowrap;
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

.nav-strip {
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.05), transparent);
}

.nav-scroll {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1.5rem 0.6rem;
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
  -webkit-overflow-scrolling: touch;
}

.nav-scroll::-webkit-scrollbar {
  height: 6px;
}

.nav-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.nav-scroll::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 999px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  flex: 0 0 auto;
  padding: 0.58rem 0.85rem;
  border-radius: 999px;
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.82rem;
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
  flex: 0 0 auto;
  font-size: 1rem;
}

.nav-label {
  white-space: nowrap;
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

.language-picker {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--text-muted);
  min-width: 0;
}

.language-picker select {
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  max-width: 9.5rem;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.language-picker select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--shadow-color);
}

@media (max-width: 640px) {
  .header-center,
  .recent-tools,
  .logo-tagline {
    display: none;
  }

  .language-picker select {
    max-width: 6.8rem;
  }
}

@media (max-width: 520px) {
  .header-content {
    padding-inline: 1rem;
  }

  .logo-text,
  .theme-label {
    display: none;
  }

  .theme-toggle {
    padding-inline: 0.65rem;
  }

  .nav-scroll {
    padding-inline: 1rem;
  }
}
</style>
