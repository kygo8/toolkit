<script setup>
import RobotsTxt from '~/src/views/seo/RobotsTxt.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/robots')
</script>

<template>
  <RobotsTxt />
</template>
