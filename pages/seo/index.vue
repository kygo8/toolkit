<script setup>
import SeoTools from '~/src/views/SeoTools.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo')
</script>

<template>
  <SeoTools />
</template>
