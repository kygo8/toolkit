<script setup>
import RegexTester from '~/src/views/dev/RegexTester.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/dev/regex')
</script>

<template>
  <RegexTester />
</template>
