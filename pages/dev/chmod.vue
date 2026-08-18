<script setup>
import ChmodCalc from '~/src/views/dev/ChmodCalc.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/chmod')
</script>

<template>
  <ChmodCalc />
</template>
