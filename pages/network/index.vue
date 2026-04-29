<script setup>
import NetworkTools from '~/src/views/NetworkTools.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/network')
</script>

<template>
  <NetworkTools />
</template>
