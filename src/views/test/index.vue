<script lang="ts" setup>
import MagicVariable from "@/components/MagicVariable/index.vue"
import { ref } from "vue"

const test = ref("")
</script>

<template>
  <div>
    <magic-variable v-model="test" placeholder="测试一下啦" />
  </div>
</template>

<style scoped lang="scss"></style>
