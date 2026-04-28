<script setup>
import UuidGenerator from '~/src/views/dev/UuidGenerator.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/uuid')
</script>

<template>
  <UuidGenerator />
</template>
