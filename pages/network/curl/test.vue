<script setup>
import CurlParser from '~/src/views/curl/CurlParser.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/network/curl/test')
</script>

<template>
  <CurlParser />
</template>
