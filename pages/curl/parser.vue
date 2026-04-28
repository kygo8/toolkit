<script setup>
import CurlParser from '~/src/views/curl/CurlParser.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/curl/parser')
</script>

<template>
  <CurlParser />
</template>
