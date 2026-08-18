<script setup>
import ImageExif from '~/src/views/image/ImageExif.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/image/exif')
</script>

<template>
  <ImageExif />
</template>
