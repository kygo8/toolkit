<script setup>
import FakeData from '~/src/views/dev/FakeData.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/fake-data')
</script>

<template>
  <FakeData />
</template>
