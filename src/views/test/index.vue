<script lang="ts" setup>
import { ref } from "vue"
import { MagicStick, FullScreen } from "@element-plus/icons-vue"
import { ElDialog } from "element-plus"

const input = ref("")
const dialogTableVisible = ref(false)
const root = ref([])
const clickButton = () => {
  dialogTableVisible.value = true
}
const clickReturn = (value) => {
  console.log(value)
}
</script>

<template>
  <div style="margin: 10px">
    <el-dialog v-model="dialogTableVisible" title="魔法变量" width="70%">
      <template #header>
        <div class="dialog-header">
          <el-icon><MagicStick /></el-icon>
          <span class="text">动态变量</span>
        </div>
      </template>
      <el-row>
        <el-col :span="6">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu style="height: 400px" default-active="2" unique-opened>
              <el-sub-menu index="1">
                <template #title>
                  <span>内置变量</span>
                </template>
                <el-menu-item index="1-1" @click="clickReturn">
                  <template #title>
                    <div class="container">
                      <div class="code">name</div>
                      <div>姓名</div>
                    </div>
                  </template>
                </el-menu-item>
                <el-menu-item index="1-2">item two</el-menu-item>
                <el-menu-item index="1-3">item three</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <span>动态变量</span>
                </template>
                <el-menu-item index="2-1">item one</el-menu-item>
                <el-menu-item index="2-2">item two</el-menu-item>
                <el-menu-item index="2-3">item three</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="3">
                <template #title>
                  <span>映射变量</span>
                </template>
                <el-menu-item index="3-1">item one</el-menu-item>
                <el-menu-item index="3-2">item two</el-menu-item>
                <el-menu-item index="3-3">item three</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="4">
                <template #title>
                  <span>Navigator One</span>
                </template>
                <el-menu-item index="4-1">item one</el-menu-item>
                <el-menu-item index="4-2">item two</el-menu-item>
                <el-menu-item index="4-3">item three</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-col>
        <el-col :span="9"><div class="section">Test</div></el-col>
        <el-col :span="9"><div class="section">Test</div></el-col>
      </el-row>
      <div class="expression">
        <div class="header-text">表达式</div>
        <div class="flex-grow-element">测试啊</div>
      </div>
      <div class="profile">
        <div class="header-text">预览</div>
        <div class="flex-grow-element">
          测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊试啊
        </div>
      </div>
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
.dialog-header {
  display: flex;
  align-items: center; /* 垂直居中 */
  font-size: 18px;
  font-weight: bold;
  .text {
    margin-left: 8px;
  }
}
.el-button {
  margin-left: 0;
}
:deep(.el-input__wrapper) {
  padding: 1px 3px 1px 11px;
}
.container {
  display: flex;
  justify-content: center;
  .code {
    flex: 1;
  }
}

.section {
  flex: 1;
  border-right: 1px solid var(--el-menu-border-color);
  padding: 20px;
  height: 400px;
}
.expression {
  padding: 20px;
  border-top: 1px solid var(--el-menu-border-color);
  display: flex;
  align-items: center;
  .header-text {
    width: 90px;
    font-size: 16px;
    font-weight: bold;
  }
  .flex-grow-element {
    flex-grow: 1;
    color: var(--v3-tagsview-tag-active-border-color);
  }
}
.profile {
  padding: 20px;
  border-top: 1px solid var(--el-menu-border-color);
  border-bottom: 1px solid var(--el-menu-border-color);
  display: flex;
  align-items: center;
  .header-text {
    width: 90px;
    font-weight: bold;
    font-size: 16px;
  }
  .flex-grow-element {
    flex-grow: 1;
  }
}
</style>
