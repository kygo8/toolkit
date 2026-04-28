<script setup>
import CurlBuilder from '~/src/views/curl/CurlBuilder.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/curl/builder')
</script>

<template>
  <CurlBuilder />
</template>
