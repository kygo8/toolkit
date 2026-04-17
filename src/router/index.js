import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PasswordGenerator from '../views/PasswordGenerator.vue'
import JsonFormatter from '../views/JsonFormatter.vue'
import CodecTools from '../views/CodecTools.vue'
import Base64 from '../views/codec/Base64.vue'
import UrlCodec from '../views/codec/UrlCodec.vue'
import HtmlCodec from '../views/codec/HtmlCodec.vue'
import UnicodeCodec from '../views/codec/UnicodeCodec.vue'
import HexCodec from '../views/codec/HexCodec.vue'
import JwtDecoder from '../views/codec/JwtDecoder.vue'
import HashTool from '../views/codec/HashTool.vue'
import DevTools from '../views/DevTools.vue'
import Timestamp from '../views/dev/Timestamp.vue'
import ColorConverter from '../views/dev/ColorConverter.vue'
import RegexTester from '../views/dev/RegexTester.vue'
import NumberBase from '../views/dev/NumberBase.vue'
import UuidGenerator from '../views/dev/UuidGenerator.vue'
import TextDiff from '../views/dev/TextDiff.vue'
import SeoTools from '../views/SeoTools.vue'
import MetaGenerator from '../views/seo/MetaGenerator.vue'
import KeywordDensity from '../views/seo/KeywordDensity.vue'
import CharacterCounter from '../views/seo/CharacterCounter.vue'
import DeadLinkChecker from '../views/seo/DeadLinkChecker.vue'
import RobotsTxt from '../views/seo/RobotsTxt.vue'
import SitemapXml from '../views/seo/SitemapXml.vue'
import HTagChecker from '../views/seo/HTagChecker.vue'
import BatchUrlOpener from '../views/seo/BatchUrlOpener.vue'
import Page404Checker from '../views/seo/Page404Checker.vue'
import SiteCrawler from '../views/seo/SiteCrawler.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/password', name: 'PasswordGenerator', component: PasswordGenerator },
  { path: '/json', name: 'JsonFormatter', component: JsonFormatter },
  { path: '/codec', name: 'CodecTools', component: CodecTools },
  { path: '/codec/base64', name: 'Base64', component: Base64 },
  { path: '/codec/url', name: 'UrlCodec', component: UrlCodec },
  { path: '/codec/html', name: 'HtmlCodec', component: HtmlCodec },
  { path: '/codec/unicode', name: 'UnicodeCodec', component: UnicodeCodec },
  { path: '/codec/hex', name: 'HexCodec', component: HexCodec },
  { path: '/codec/jwt', name: 'JwtDecoder', component: JwtDecoder },
  { path: '/codec/hash', name: 'HashTool', component: HashTool },
  { path: '/dev', name: 'DevTools', component: DevTools },
  { path: '/dev/timestamp', name: 'Timestamp', component: Timestamp },
  { path: '/dev/color', name: 'ColorConverter', component: ColorConverter },
  { path: '/dev/regex', name: 'RegexTester', component: RegexTester },
  { path: '/dev/number-base', name: 'NumberBase', component: NumberBase },
  { path: '/dev/uuid', name: 'UuidGenerator', component: UuidGenerator },
  { path: '/dev/text-diff', name: 'TextDiff', component: TextDiff },
  { path: '/seo', name: 'SeoTools', component: SeoTools },
  { path: '/seo/meta', name: 'MetaGenerator', component: MetaGenerator },
  { path: '/seo/keyword-density', name: 'KeywordDensity', component: KeywordDensity },
  { path: '/seo/character-counter', name: 'CharacterCounter', component: CharacterCounter },
  { path: '/seo/dead-link', name: 'DeadLinkChecker', component: DeadLinkChecker },
  { path: '/seo/robots', name: 'RobotsTxt', component: RobotsTxt },
  { path: '/seo/sitemap', name: 'SitemapXml', component: SitemapXml },
  { path: '/seo/htag', name: 'HTagChecker', component: HTagChecker },
  { path: '/seo/batch-url', name: 'BatchUrlOpener', component: BatchUrlOpener },
  { path: '/seo/404-checker', name: 'Page404Checker', component: Page404Checker },
  { path: '/seo/site-crawler', name: 'SiteCrawler', component: SiteCrawler }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
