<script setup lang="ts">
import { ref } from "vue"
import { ElTreeV2 } from "element-plus"
import { Plus } from "@element-plus/icons-vue"
import type { TreeNode } from "element-plus/es/components/tree-v2/src/types"
import svgIcon from "@/components/SvgIcon/index.vue"

interface Tree {
  id: string
  label: string
  children?: Tree[]
}

const getKey = (prefix: string, id: number) => {
  return `${prefix}-${id}`
}

const createData = (maxDeep: number, maxChildren: number, minNodesNumber: number, deep = 1, key = "node"): Tree[] => {
  let id = 0
  return Array.from({ length: minNodesNumber })
    .fill(deep)
    .map(() => {
      const childrenNumber = deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
      const nodeKey = getKey(key, ++id)
      return {
        id: nodeKey,
        label: nodeKey,
        children: childrenNumber ? createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey) : undefined
      }
    })
}

const query = ref("")
const treeRef = ref<InstanceType<typeof ElTreeV2>>()
const data = createData(4, 30, 5)
const props = {
  value: "id",
  label: "label",
  children: "children"
}

const onQueryChanged = (query: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  treeRef.value!.filter(query)
}
const filterMethod = (query: string, node: TreeNode) => {
  return node.label!.includes(query)
}

const test = (node, data) => {
  console.log(node, data, "22")
}
</script>

<template>
  <div>
    <div class="container">
      <el-input v-model="query" placeholder="Please enter keyword" @input="onQueryChanged" />
      <el-button :icon="Plus" type="success">添加</el-button>
    </div>
    <el-tree-v2 ref="treeRef" :data="data" :props="props" :filter-method="filterMethod" :height="1600">
      <template #default="{ node, data }">
        <svg-icon name="folder" style="margin-right: 5px" />
        <span @click="test(node, data)">{{ node.label }}</span>
      </template>
    </el-tree-v2>
    <el-tree
      ref="tree"
      class="folderTree"
      :data="modulesList"
      accordion
      :props="defaultProps"
      highlight-current
      node-key="id"
      :indent="12"
      :load="loadNode"
      lazy
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @node-click="queryModuleApi"
    >
      <template #default="{ node, data }">
        <div @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
          <span>
            <svg-icon :name="node.expanded ? 'coke-icon-folder-open' : 'coke-icon-folder'" style="margin-right: 5px" />
            <span style="color: #606266">{{ data.name }}</span>
          </span>
          <span v-show="data['show']">
            <el-tooltip
              v-if="node.level < 2"
              content="添加子分组"
              :open-delay="200"
              :enterable="false"
              placement="top-start"
            >
              <el-button
                link
                size="small"
                icon="el-icon-plus"
                circle
                class="round"
                style="color: #606266"
                @click.stop="createModule(data.id)"
              />
            </el-tooltip>
            <el-dropdown placement="bottom-start">
              <el-button
                link
                size="small"
                icon="el-icon-more"
                circle
                class="round"
                style="color: #606266"
                @click.stop
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit" style="color: #409eff" @click.prevent="updateModule(data)"
                  >编辑</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="node.level < 2"
                  icon="el-icon-folder-add"
                  divided
                  style="color: #67c23a"
                  @click.prevent="createModule(data.id)"
                  >添加子分组</el-dropdown-item
                >
                <el-dropdown-item
                  icon="el-icon-delete"
                  divided
                  style="color: #f56c6c"
                  @click.prevent="deleteModuleInfo(data.id)"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex; /* 使用Flexbox布局 */
  justify-content: space-between; /* 元素之间平均分布空间，使它们左右分布 */
  margin-bottom: 5px;
  .el-button {
    margin-left: 5px;
  }
}
.box-height {
  height: calc(100vh - var(--v3-header-height));
}
</style>
