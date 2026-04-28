<script setup>
import SitemapXml from '~/src/views/seo/SitemapXml.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/sitemap')
</script>

<template>
  <SitemapXml />
</template>
