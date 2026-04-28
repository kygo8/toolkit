<script setup>
import QrGenerator from '~/src/views/qrcode/QrGenerator.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/qrcode/generate')
</script>

<template>
  <QrGenerator />
</template>
