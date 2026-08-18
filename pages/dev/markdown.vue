<script setup>
import MarkdownPreview from '~/src/views/dev/MarkdownPreview.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/markdown')
</script>

<template>
  <MarkdownPreview />
</template>
