<script setup>
import JsonFormatter from '~/src/views/JsonFormatter.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/json')
</script>

<template>
  <JsonFormatter />
</template>
