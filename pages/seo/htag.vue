<script setup>
import HTagChecker from '~/src/views/seo/HTagChecker.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/htag')
</script>

<template>
  <HTagChecker />
</template>
