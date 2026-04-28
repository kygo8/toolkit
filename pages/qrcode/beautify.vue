<script setup>
import QrBeautify from '~/src/views/qrcode/QrBeautify.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/qrcode/beautify')
</script>

<template>
  <QrBeautify />
</template>
