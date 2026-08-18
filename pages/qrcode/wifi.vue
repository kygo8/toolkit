<script setup>
import QrWifi from '~/src/views/qrcode/QrWifi.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/qrcode/wifi')
</script>

<template>
  <QrWifi />
</template>
