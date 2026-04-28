<script setup>
import JwtDecoder from '~/src/views/codec/JwtDecoder.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/codec/jwt')
</script>

<template>
  <JwtDecoder />
</template>
