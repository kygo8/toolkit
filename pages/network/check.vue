<script setup>
import NetworkCheck from '~/src/views/network/NetworkCheck.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/network/check')
</script>

<template>
  <NetworkCheck />
</template>
