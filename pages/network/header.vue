<script setup>
import HttpHeader from '~/src/views/network/HttpHeader.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/network/header')
</script>

<template>
  <HttpHeader />
</template>
