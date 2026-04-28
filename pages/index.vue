<script setup>
import Home from '~/src/views/Home.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/')
</script>

<template>
  <Home />
</template>
