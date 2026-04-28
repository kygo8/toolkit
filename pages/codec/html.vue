<script setup>
import HtmlCodec from '~/src/views/codec/HtmlCodec.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/codec/html')
</script>

<template>
  <HtmlCodec />
</template>
