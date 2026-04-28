<script setup>
import UrlCodec from '~/src/views/codec/UrlCodec.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/codec/url')
</script>

<template>
  <UrlCodec />
</template>
