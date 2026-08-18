<script setup>
import TomlJson from '~/src/views/dev/TomlJson.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/toml')
</script>

<template>
  <TomlJson />
</template>
