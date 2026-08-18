<script setup>
import SqlFormat from '~/src/views/dev/SqlFormat.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/sql')
</script>

<template>
  <SqlFormat />
</template>
