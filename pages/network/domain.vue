<script setup>
import DomainCheck from '~/src/views/network/DomainCheck.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/network/domain')
</script>

<template>
  <DomainCheck />
</template>
