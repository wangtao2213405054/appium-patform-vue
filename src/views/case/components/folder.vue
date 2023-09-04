<script setup lang="ts">
import { ref, onMounted, reactive } from "vue"
import { ElDialog, ElForm, FormInstance, FormRules } from "element-plus"
import { MoreFilled, Plus, FolderAdd, FolderDelete, Delete } from "@element-plus/icons-vue"
import svgIcon from "@/components/SvgIcon/index.vue"
import { apiEditFolderInfo, apiGetFolderList } from "@/api/business"

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
const addForm = reactive({
  nodeId: 0,
  id: null,
  name: "",
  type: "folder",
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

// 提交表单
const submitForm = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      const folder = (await apiEditFolderInfo(addForm)).data
      console.log(folder, "222")
      dialogVisible.value = false
      await getData()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

const getData = async () => {
  data.value = (await apiGetFolderList({ projectId })).data
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div>
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
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
      <el-input placeholder="Please enter keyword" />
      <el-button :icon="Plus" type="success" @click="addFolder">添加</el-button>
    </div>
    <el-scrollbar>
      <el-tree ref="treeRef" node-key="id" :data="data" :props="props" class="box-height">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span style="font-size: 14px">
              <svg-icon :name="node.expanded ? 'folder-open' : 'folder'" style="margin-right: 5px" />
              <span>{{ node.label }}</span>
            </span>
            <span style="visibility: hidden" class="button">
              <el-dropdown class="more" placement="bottom-start">
                <el-icon><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <svg-icon name="case-add" class="tree-icon" />
                      添加用例
                    </el-dropdown-item>
                    <el-dropdown-item divided>
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
                    <el-dropdown-item divided>
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
  align-items: center;
  .el-button {
    margin-left: 5px;
  }
}
.box-height {
  height: calc(100vh - var(--v3-header-height) - 60px);
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
</style>
