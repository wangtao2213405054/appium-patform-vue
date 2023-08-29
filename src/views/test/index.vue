<script lang="ts" setup>
import MagicVariable from "@/components/MagicVariable/index.vue"
import { ref } from "vue"

const test = ref("")
</script>

<template>
  <div>
    <magic-variable v-model="test" />
  </div>
</template>

<style scoped lang="scss"></style>
