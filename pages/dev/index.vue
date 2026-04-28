<script setup>
import DevTools from '~/src/views/DevTools.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev')
</script>

<template>
  <DevTools />
</template>
