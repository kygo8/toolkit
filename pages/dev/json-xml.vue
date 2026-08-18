<script setup>
import JsonXml from '~/src/views/dev/JsonXml.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/json-xml')
</script>

<template>
  <JsonXml />
</template>
