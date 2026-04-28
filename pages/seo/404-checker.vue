<script setup>
import Page404Checker from '~/src/views/seo/Page404Checker.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/404-checker')
</script>

<template>
  <Page404Checker />
</template>
