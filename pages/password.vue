<script setup>
import PasswordGenerator from '~/src/views/PasswordGenerator.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/password')
</script>

<template>
  <PasswordGenerator />
</template>
