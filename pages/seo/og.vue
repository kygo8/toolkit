<script setup>
import OgPreview from '~/src/views/seo/OgPreview.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/og')
</script>

<template>
  <OgPreview />
</template>
