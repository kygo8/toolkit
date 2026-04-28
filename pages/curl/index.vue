<script setup>
import CurlTools from '~/src/views/CurlTools.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/curl')
</script>

<template>
  <CurlTools />
</template>
