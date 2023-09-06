<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue"
import { ElDialog, ElForm, FormInstance, FormRules, ElTree, ElMessageBox, ElMessage } from "element-plus"
import { MoreFilled, Plus } from "@element-plus/icons-vue"
import svgIcon from "@/components/SvgIcon/index.vue"
import {apiDeleteFolderInfo, apiEditFolderInfo, apiGetFolderList, apiMoveFolderInfo} from "@/api/business"
import type Node from "element-plus/es/components/tree/src/model/node"
import type { AllowDropType } from "element-plus/es/components/tree/src/tree.type"

const props = {
  value: "id",
  label: "name",
  children: "children"
}

const dialogVisible = ref<boolean>(false)
const title = ref<string>("")

const projectId = JSON.parse(localStorage.getItem("projectId") || "0")
const data = ref([])
const addFormRef = ref<FormInstance | null>(null)
const treeRef = ref<InstanceType<typeof ElTree>>()
const addForm = reactive({
  nodeId: 0,
  id: null,
  name: "",
  projectId: projectId
})
const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入模块名称", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
  ]
}

/** 添加文件夹 */
const addFolder = () => {
  title.value = "添加模块"
  dialogVisible.value = true
}

/** 添加子节点文件夹 */
const addChildFolder = (id: number) => {
  addForm.nodeId = id
  title.value = "添加模块"
  dialogVisible.value = true
}

/** 重命名 */
const rename = (id: number, parent: number, name: string) => {
  addForm.id = id
  addForm.nodeId = parent
  addForm.name = name
  title.value = "重命名"
  dialogVisible.value = true
}

/** 关闭弹窗 */
const closeDialog = () => {
  addForm.id = null
  addForm.name = ""
  addForm.nodeId = 0
  addFormRef.value?.clearValidate()
}

/** 提交表单 */
const submitForm = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      const folder = (await apiEditFolderInfo(addForm)).data
      // 新增文件夹
      if (!addForm.id) {
        // 新增时添加一个节点, 如果存在父节点则展开这个节点
        const node = treeRef.value?.getNode(addForm.nodeId)
        treeRef.value?.append(folder, node)
        if (node) {
          node.expanded = true
        }
      } else {
        // 修改文件夹
        const node = treeRef.value?.getNode(addForm.id)
        node.data.name = folder.name
      }

      dialogVisible.value = false
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

/** 删除文件夹节点信息 */
const deleteTreeNode = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该文件夹, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).catch((err) => err)

  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }

  await apiDeleteFolderInfo({ id })
  treeRef.value?.remove(id)
}

/** 数据过滤 */
const filterText = ref<string>("")
watch(filterText, (value: string) => {
  treeRef.value!.filter(value)
})

const filterNode = (value: string, data) => {
  if (!value) return true
  return data.name.includes(value)
}

/** 获取文件数 */
const getFolderTree = async () => {
  data.value = (await apiGetFolderList({ projectId })).data
}

onMounted(() => {
  getFolderTree()
})

const emit = defineEmits(["testcase"])

const addCase = (id: number) => {
  emit("testcase", id)
}

/** 拖动时的钩子, 测试用例不能拖动至层级1中 */
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  const isInsertType = type === "inner"
  const isFolderType = draggingNode.data.type === "folder"

  // 获取适用的节点数组
  let nodesToCheck
  if (isInsertType) {
    nodesToCheck = dropNode.data.children || []
  } else {
    if (dropNode.level === 1) {
      // 当文件类型非文件夹时，不能放置在根目录
      if (!isFolderType) return false
      nodesToCheck = dropNode.parent?.data || []
    } else {
      nodesToCheck = dropNode.parent?.data.children || []
    }
  }

  // 检查是否存在相同名称和类型的节点
  return !nodesToCheck.some(node =>
      draggingNode.data.id !== node.id &&
      draggingNode.data.name === node.name &&
      draggingNode.data.type === node.type
  )
}

/** 拖拽成功后通知服务器变更文件位置 */
const dropToServer = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  apiMoveFolderInfo({ id: draggingNode.data.id, nodeId: dropNode.data.id, position: type })
}
</script>

<template>
  <div>
    <el-dialog v-model="dialogVisible" :title="title" width="30%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入模块名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="container">
      <el-input v-model="filterText" placeholder="输入关键字过滤" />
      <el-button :icon="Plus" type="success" @click="addFolder">添加</el-button>
    </div>
    <el-scrollbar>
      <el-tree
        ref="treeRef"
        class="box-height"
        node-key="id"
        draggable
        :data="data"
        :props="props"
        :filter-node-method="filterNode"
        :allow-drop="allowDrop"
        @node-drop="dropToServer"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span class="tree-text">
              <svg-icon :name="node.expanded ? 'folder-open' : 'folder'" style="margin-right: 5px" />
              <span>{{ node.label }}</span>
            </span>
            <span style="visibility: hidden" class="button">
              <el-dropdown class="more" placement="bottom-start">
                <el-icon @click.stop><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click.prevent="addCase(data.id)">
                      <svg-icon name="case-add" class="tree-icon" />
                      添加用例
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.prevent="rename(data.id, data.nodeId, data.name)">
                      <svg-icon name="rename" class="tree-icon" />
                      重命名
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <svg-icon name="move" class="tree-icon" />
                      移动到
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.prevent="addChildFolder(data.id)">
                      <svg-icon name="folder-add" class="tree-icon" />
                      添加子目录
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.prevent="deleteTreeNode(data.id)">
                      <svg-icon name="folder-delete" class="tree-icon" />
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </span>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex; /* 使用Flexbox布局 */
  justify-content: space-between; /* 元素之间平均分布空间，使它们左右分布 */
  margin-bottom: 5px;
  padding: 6px;
  align-items: center;
  .el-button {
    margin-left: 5px;
  }
}
.box-height {
  height: calc(100vh - var(--v3-header-height) - 55px);
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tree-icon {
  margin-right: 10px;
  font-size: 18px;
}
:deep(.el-tree) {
  .el-tree-node__content:hover {
    .button {
      visibility: visible !important;
    }
  }
}
.more {
  padding: 4px;
}
.more:hover {
  background-color: var(--el-text-color-disabled);
  border-radius: 4px;
}
.tree-text {
  display: flex; /* 使用Flexbox布局 */
  justify-content: flex-start; /* 元素之间平均分布空间，使它们左右分布 */
  align-items: center;
}
</style>
