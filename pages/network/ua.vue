<script setup>
import UserAgent from '~/src/views/network/UserAgent.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/network/ua')
</script>

<template>
  <UserAgent />
</template>
