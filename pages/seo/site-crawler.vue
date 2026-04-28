<script setup>
import SiteCrawler from '~/src/views/seo/SiteCrawler.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/site-crawler')
</script>

<template>
  <SiteCrawler />
</template>
