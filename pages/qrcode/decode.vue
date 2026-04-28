<script setup>
import QrDecoder from '~/src/views/qrcode/QrDecoder.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/qrcode/decode')
</script>

<template>
  <QrDecoder />
</template>
