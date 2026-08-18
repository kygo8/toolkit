<script setup>
import CidrCalc from '~/src/views/network/CidrCalc.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/network/cidr')
</script>

<template>
  <CidrCalc />
</template>
