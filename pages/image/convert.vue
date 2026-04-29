<script setup>
import ImageConverter from '~/src/views/image/ImageConverter.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/image/convert')
</script>

<template>
  <ImageConverter />
</template>
