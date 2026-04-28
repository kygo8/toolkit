<script setup>
import ColorConverter from '~/src/views/dev/ColorConverter.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/color')
</script>

<template>
  <ColorConverter />
</template>
