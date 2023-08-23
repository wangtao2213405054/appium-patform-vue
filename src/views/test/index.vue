<script lang="ts" setup>
import { ref } from "vue"
import { MagicStick, FullScreen } from "@element-plus/icons-vue"
import { ElDialog } from "element-plus"
import {Sidebar} from "@/layouts/components";

const input = ref("")
const dialogTableVisible = ref(false)
const clickButton = () => {
  dialogTableVisible.value = true
}
</script>

<template>
  <div style="margin: 10px">
    <el-dialog v-model="dialogTableVisible" title="魔法变量" width="70%">
      <el-row>
        <el-col :span="8">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <Sidebar style="height: 200px" class="sidebar-container" />
          </el-scrollbar>
        </el-col>
        <el-col :span="8"><div class="section">Test</div></el-col>
        <el-col :span="8"><div class="section">Test</div></el-col>
      </el-row>
    </el-dialog>
    <el-input v-model="input" class="w-50 m-2" style="width: 150px" placeholder="Pick a date">
      <template #suffix>
        <el-button link :icon="MagicStick" @click="clickButton" />
        <el-button link :icon="FullScreen" @click="clickButton" />
      </template>
    </el-input>
  </div>
</template>

<style scoped lang="scss">
.el-button {
  margin-left: 0;
}
:deep(.el-input__wrapper) {
  padding: 1px 3px 1px 11px;
}
.container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.section {
  flex: 1;
  border: 1px solid #000;
  padding: 20px;
}

</style>
