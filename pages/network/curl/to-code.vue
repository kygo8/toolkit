<script setup>
import CurlToCode from '~/src/views/curl/CurlToCode.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/network/curl/to-code')
</script>

<template>
  <CurlToCode />
</template>
