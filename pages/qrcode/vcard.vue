<script setup>
import QrVcard from '~/src/views/qrcode/QrVcard.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/qrcode/vcard')
</script>

<template>
  <QrVcard />
</template>
