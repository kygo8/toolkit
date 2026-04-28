<script setup>
import QrcodeTools from '~/src/views/QrcodeTools.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/qrcode')
</script>

<template>
  <QrcodeTools />
</template>
