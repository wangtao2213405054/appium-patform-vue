<script setup lang="ts">
import Folder from "./components/folder.vue"
import { ref } from 'vue'

let tabIndex = 2
const editableTabsValue = ref('Config')
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
  },
])

const addTab = (targetName: string) => {
  const newTabName = `${++tabIndex}`
  editableTabs.value.push({
    title: 'New Tab',
    name: newTabName,
    content: 'New Tab content',
  })
  editableTabsValue.value = newTabName
}
const removeTab = (targetName: string) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
</script>

<template>
  <div>
    <el-row>
      <el-col class="box-height" :span="6" :xs="24">
        <folder />
      </el-col>
      <el-col class="box-height" :span="18" :xs="24">
        <el-tabs
            v-model="editableTabsValue"
            type="border-card"
            class="demo-tabs"
            @tab-remove="removeTab"
        >
          <el-tab-pane label="Config" name="Config" stretch>
            <div style="margin-bottom: 20px">
              <el-button size="small" @click="addTab(editableTabsValue)">
                add tab
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane
              v-for="item in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
              closable
          >
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
  border-right: 1px solid var(--el-menu-border-color)
}
.el-tabs--border-card {
  border: none;
}
</style>
