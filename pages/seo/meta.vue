<script setup>
import MetaGenerator from '~/src/views/seo/MetaGenerator.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/meta')
</script>

<template>
  <MetaGenerator />
</template>
