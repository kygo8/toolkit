<script setup>
import CronParser from '~/src/views/dev/CronParser.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/cron')
</script>

<template>
  <CronParser />
</template>
