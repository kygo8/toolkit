<script setup>
import JsonYaml from '~/src/views/dev/JsonYaml.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/json-yaml')
</script>

<template>
  <JsonYaml />
</template>
