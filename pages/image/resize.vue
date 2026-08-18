<script setup>
import ImageResize from '~/src/views/image/ImageResize.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/image/resize')
</script>

<template>
  <ImageResize />
</template>
