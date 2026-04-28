<script setup>
import Timestamp from '~/src/views/dev/Timestamp.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/timestamp')
</script>

<template>
  <Timestamp />
</template>
