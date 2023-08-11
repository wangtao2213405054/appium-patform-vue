<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from "vue"
import { apiDeletePermissionsMenuInfo, apiEditPermissionsMenuInfo, apiGetPermissionsMenuList } from "@/api/permissions"
import {
  EditPermissionsMenuRequestData,
  GetPermissionsMenuRequestData,
  PermissionsMenuInfoResponseData
} from "@/api/permissions/types/menu"
import { ElButton, ElMessage, ElMessageBox, FormInstance, ElInput, ElDialog } from "element-plus"
import { Search, Refresh, Plus, Sort, Edit, Delete } from "@element-plus/icons-vue"

const menuList = ref<PermissionsMenuInfoResponseData[]>([])
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const addFormRef = ref<FormInstance | null>(null)
const addForm: EditPermissionsMenuRequestData = reactive({
  id: null,
  name: "",
  identifier: null,
  nodeId: null
})
const addFormRules = reactive({
  name: [
    { required: true, message: "请输入正确的菜单名称", trigger: "blur" },
    { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
  ],
  identifier: [
    { required: true, message: "请输入正确的标识符", trigger: "blur" },
    { min: 2, max: 512, message: "长度在 2 到 512 个字符", trigger: "blur" }
  ]
})
const hiddenArea = ref(false)
const refreshTable = ref(true)
const requestForm: GetPermissionsMenuRequestData = reactive({
  name: "",
  identifier: ""
})

onMounted(() => {
  getPermissionsList()
})

// 新增button
const newButton = () => {
  title.value = "新增菜单"
  dialogVisible.value = true
}

// 新增菜单
async function editPermissionsInfo() {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditPermissionsMenuInfo(addForm)
      dialogVisible.value = false
      await getPermissionsList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

// 获取权限菜单
async function getPermissionsList() {
  const { data } = await apiGetPermissionsMenuList(requestForm)
  menuList.value = data
}

// 关闭钩子
function closeDialog() {
  dialogVisible.value = false
  addForm.id = null
  addForm.name = ""
  addForm.identifier = null
  addForm.nodeId = null
  addFormRef.value?.clearValidate()
}

// 新增子节点
function newNode(id: number) {
  title.value = "新增菜单"
  addForm.nodeId = id
  dialogVisible.value = true
}

// 删除节点
async function deletePermissionsInfo(id: number) {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).catch((err: any) => err)

  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }

  await apiDeletePermissionsMenuInfo({ id })
  await getPermissionsList()
}

// 修改按钮Button
function updateButton(value: EditPermissionsMenuRequestData) {
  addForm.id = value.id
  addForm.name = value.name
  addForm.nodeId = value.nodeId
  addForm.identifier = value.identifier
  title.value = "修改菜单"
  dialogVisible.value = true
}

// 重置请求信息
function refreshRequest() {
  requestForm.name = ""
  requestForm.identifier = ""
  getPermissionsList()
}

// 展开/收起
function hiddenTable() {
  refreshTable.value = false
  nextTick(() => {
    hiddenArea.value = !hiddenArea.value
    refreshTable.value = true
  })
}
</script>

<template>
  <el-card>
    <el-dialog :title="title" :model-value="dialogVisible" width="30%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" hide-required-asterisk label-width="86px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入菜单名称" clearable />
        </el-form-item>
        <el-form-item label="标识符" prop="identifier">
          <el-input v-model="addForm.identifier" placeholder="请输入标识符" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editPermissionsInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-form :model="requestForm" inline>
      <el-form-item>
        <el-input
          v-model="requestForm.name"
          placeholder="输入节点名称进行过滤"
          clearable
          @keyup.enter="getPermissionsList"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="requestForm.identifier"
          placeholder="输入标识符进行过滤"
          clearable
          @keyup.enter="getPermissionsList"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getPermissionsList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain :icon="Plus" @click="newButton">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" plain :icon="Sort" @click="hiddenTable">展开/折叠</el-button>
      </el-form-item>
    </el-form>
    <el-table v-if="refreshTable" :data="menuList" style="width: 100%" row-key="id" :default-expand-all="hiddenArea">
      <el-table-column type="index" label="编号" width="80px" align="center" />
      <el-table-column prop="name" label="名称" show-overflow-tooltip />
      <el-table-column prop="identifier" label="标识符" align="center" show-overflow-tooltip />
      <el-table-column prop="updateTime" label="修改时间" align="center" width="160px" />
      <el-table-column label="操作" align="center" width="210px">
        <template #default="scope">
          <el-button type="primary" link :icon="Edit" @click="updateButton(scope.row)">修改</el-button>
          <el-button type="success" link :icon="Plus" @click="newNode(scope.row.id)">新增</el-button>
          <el-button :icon="Delete" type="danger" link @click="deletePermissionsInfo(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped lang="scss"></style>
