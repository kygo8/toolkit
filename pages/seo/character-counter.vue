<script setup>
import CharacterCounter from '~/src/views/seo/CharacterCounter.vue'
import { useToolSeo } from '~/src/seo/useToolSeo.js'

useToolSeo('/seo/character-counter')
</script>

<template>
  <CharacterCounter />
</template>
