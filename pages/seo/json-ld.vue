<script setup>
import JsonLd from '~/src/views/seo/JsonLd.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/json-ld')
</script>

<template>
  <JsonLd />
</template>
