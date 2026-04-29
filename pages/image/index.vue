<script setup>
import ImageTools from '~/src/views/ImageTools.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/image')
</script>

<template>
  <ImageTools />
</template>
