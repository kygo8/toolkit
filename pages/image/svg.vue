<script setup>
import SvgConvert from '~/src/views/image/SvgConvert.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/image/svg')
</script>

<template>
  <SvgConvert />
</template>
