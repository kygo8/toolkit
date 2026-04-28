<script setup>
import BatchUrlOpener from '~/src/views/seo/BatchUrlOpener.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/batch-url')
</script>

<template>
  <BatchUrlOpener />
</template>
