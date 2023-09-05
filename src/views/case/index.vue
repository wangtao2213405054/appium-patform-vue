<script setup lang="ts">
import Folder from "./components/folder.vue"
import { ref } from "vue"

interface TabContent {
  title: string
  name: number
  content: any
}

const editableTabsValue = ref<number>(0)
const editableTabs = ref<TabContent[]>([])

/** 添加 Tab */
const addTab = (title: string, id: number, content: any = null) => {
  for (let i = 0; i < editableTabs.value.length; i++) {
    if (id === editableTabs.value[i].name) {
      editableTabsValue.value = id
      return
    }
  }
  editableTabs.value.push({
    title: title,
    name: id,
    content: content
  })
  editableTabsValue.value = id
}
/** 删除 Tab */
const removeTab = (targetName: number) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        } else {
          activeName = 0
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
/** 添加测试用例的钩子 */
const addTestcase = (id: number) => {
  console.log(id, 222)
  addTab("新建用例", -1)
}
</script>

<template>
  <div>
    <el-row>
      <el-col class="box-height" :span="6" :xs="24">
        <folder @testcase="addTestcase" />
      </el-col>
      <el-col class="box-height" :span="18" :xs="24">
        <el-tabs v-model="editableTabsValue" type="border-card" class="demo-tabs" @tab-remove="removeTab">
          <el-tab-pane label="Config" :name="0" stretch>
            <div>Test</div>
          </el-tab-pane>
          <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name" closable>
            {{ item.content }}
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.box-height {
  background-color: var(--el-bg-color-overlay);
  height: calc(100vh - var(--v3-header-height));
  border-right: 1px solid var(--el-menu-border-color);
}
.el-tabs--border-card {
  border: none;
}
</style>
