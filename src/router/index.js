import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PasswordGenerator from '../views/PasswordGenerator.vue'
import JsonFormatter from '../views/JsonFormatter.vue'
import Base64 from '../views/Base64.vue'
import UrlCodec from '../views/UrlCodec.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/password', name: 'PasswordGenerator', component: PasswordGenerator },
  { path: '/json', name: 'JsonFormatter', component: JsonFormatter },
  { path: '/base64', name: 'Base64', component: Base64 },
  { path: '/url', name: 'UrlCodec', component: UrlCodec }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
