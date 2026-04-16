import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PasswordGenerator from '../views/PasswordGenerator.vue'
import JsonFormatter from '../views/JsonFormatter.vue'
import Base64 from '../views/Base64.vue'
import UrlCodec from '../views/UrlCodec.vue'
import SeoTools from '../views/SeoTools.vue'
import MetaGenerator from '../views/seo/MetaGenerator.vue'
import KeywordDensity from '../views/seo/KeywordDensity.vue'
import CharacterCounter from '../views/seo/CharacterCounter.vue'
import DeadLinkChecker from '../views/seo/DeadLinkChecker.vue'
import RobotsTxt from '../views/seo/RobotsTxt.vue'
import SitemapXml from '../views/seo/SitemapXml.vue'
import HTagChecker from '../views/seo/HTagChecker.vue'
import BatchUrlOpener from '../views/seo/BatchUrlOpener.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/password', name: 'PasswordGenerator', component: PasswordGenerator },
  { path: '/json', name: 'JsonFormatter', component: JsonFormatter },
  { path: '/base64', name: 'Base64', component: Base64 },
  { path: '/url', name: 'UrlCodec', component: UrlCodec },
  { path: '/seo', name: 'SeoTools', component: SeoTools },
  { path: '/seo/meta', name: 'MetaGenerator', component: MetaGenerator },
  { path: '/seo/keyword-density', name: 'KeywordDensity', component: KeywordDensity },
  { path: '/seo/character-counter', name: 'CharacterCounter', component: CharacterCounter },
  { path: '/seo/dead-link', name: 'DeadLinkChecker', component: DeadLinkChecker },
  { path: '/seo/robots', name: 'RobotsTxt', component: RobotsTxt },
  { path: '/seo/sitemap', name: 'SitemapXml', component: SitemapXml },
  { path: '/seo/htag', name: 'HTagChecker', component: HTagChecker },
  { path: '/seo/batch-url', name: 'BatchUrlOpener', component: BatchUrlOpener }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
