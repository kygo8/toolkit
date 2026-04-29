<script setup>
import ImageWatermark from '~/src/views/image/ImageWatermark.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/image/watermark')
</script>

<template>
  <ImageWatermark />
</template>
