<script setup>
import CodeFormat from '~/src/views/dev/CodeFormat.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/code-format')
</script>

<template>
  <CodeFormat />
</template>
