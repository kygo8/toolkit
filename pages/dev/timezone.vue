<script setup>
import Timezone from '~/src/views/dev/Timezone.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/timezone')
</script>

<template>
  <Timezone />
</template>
