<script setup>
import ImageCompressor from '~/src/views/image/ImageCompressor.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/image/compress')
</script>

<template>
  <ImageCompressor />
</template>
