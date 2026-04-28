<script setup>
import TextDiff from '~/src/views/dev/TextDiff.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/text-diff')
</script>

<template>
  <TextDiff />
</template>
