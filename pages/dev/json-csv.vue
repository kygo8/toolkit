<script setup>
import JsonCsv from '~/src/views/dev/JsonCsv.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/json-csv')
</script>

<template>
  <JsonCsv />
</template>
