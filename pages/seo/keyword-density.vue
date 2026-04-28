<script setup>
import KeywordDensity from '~/src/views/seo/KeywordDensity.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/keyword-density')
</script>

<template>
  <KeywordDensity />
</template>
