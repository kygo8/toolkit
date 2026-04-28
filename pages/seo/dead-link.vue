<script setup>
import DeadLinkChecker from '~/src/views/seo/DeadLinkChecker.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/dead-link')
</script>

<template>
  <DeadLinkChecker />
</template>
