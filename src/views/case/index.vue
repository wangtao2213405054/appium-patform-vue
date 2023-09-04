<script setup lang="ts">
import Folder from "./components/folder.vue"
</script>

<template>
  <el-card class="box-height">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <folder />
      </el-col>
      <el-col :span="18" :xs="24">
        <div style="background-color: #2c323c">xxx</div>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped lang="scss">
.box-height {
  height: calc(100vh - var(--v3-header-height));
}
</style>
