<script setup lang="ts">
import { Edit, Delete, Plus, Refresh, Search } from "@element-plus/icons-vue"
import { onMounted, reactive, ref } from "vue"
import { EditPermissionsRoleRequestData, GetPermissionsRoleRequestData } from "@/api/permissions/types/role"
import { ElDialog, ElMessage, ElMessageBox, ElTree, FormInstance } from "element-plus"
import { PermissionsMenuInfoResponseData } from "@/api/permissions/types/menu"
import {
  apiDeletePermissionsRoleInfo,
  apiEditPermissionsRoleInfo,
  apiGetPermissionsMenuList,
  apiGetPermissionsRoleList
} from "@/api/permissions"

const requestForm: GetPermissionsRoleRequestData = reactive({
  keyword: "",
  total: 0,
  page: 1,
  pageSize: 20
})
const addForm: EditPermissionsRoleRequestData = reactive({
  id: null,
  name: "",
  identifier: "",
  permissionsApi: []
})
const addFormRef = ref<FormInstance | null>(null)
const treeRef = ref<InstanceType<typeof ElTree>>()
const addFormRules = reactive({
  name: [
    { required: true, message: "请输入正确的角色名称", trigger: "blur" },
    { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
  ],
  identifier: [
    { required: true, message: "请输入正确的标识符", trigger: "blur" },
    { min: 2, max: 512, message: "长度在 2 到 512 个字符", trigger: "blur" }
  ],
  permissionsApi: [{ required: true, message: "请选择相关权限", trigger: "blur" }]
})

const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const defaultProps = reactive({
  children: "children",
  label: "name"
})
const menuList = ref<PermissionsMenuInfoResponseData[]>([])
const roleList = ref<PermissionsMenuInfoResponseData[]>([])
const strictly = ref<boolean>(false)
const expand = ref<any>(false)
const checked = ref<boolean>(false)
const roleLoading = ref<boolean>(true)

onMounted(() => {
  getRoleList()
})

// 新增按钮
function newButton() {
  title.value = "新增角色"
  dialogVisible.value = true
}

// 获取菜单列表
async function getPermissionsList() {
  menuList.value = (await apiGetPermissionsMenuList({ keyword: "" })).data
}

// 新增/修改 角色信息
function editRoleInfo() {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditPermissionsRoleInfo(addForm)
      dialogVisible.value = false
      await getRoleList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

// tree 发生变化时的钩子
function handleCheckChange() {
  addForm.permissionsApi = treeRef.value!.getCheckedKeys().concat(treeRef.value!.getHalfCheckedKeys())
}

// 获取角色列表
async function getRoleList() {
  roleLoading.value = true
  const { items, total } = (await apiGetPermissionsRoleList(requestForm)).data
  roleList.value = items
  requestForm.total = total
  roleLoading.value = false
}

// 页码改变
function handleCurrentChange(newPage: number) {
  requestForm.page = newPage
  getRoleList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

// 查询角色列表
function queryRoleList() {
  requestForm.page = 1
  getRoleList()
}

// 更新按钮
function updateButton(value: EditPermissionsRoleRequestData) {
  dialogVisible.value = true
  addForm.id = value.id
  addForm.name = value.name
  addForm.identifier = value.identifier
  addForm.permissionsApi = value.permissionsApi
  title.value = "编辑角色"
}

// 关闭对话框的钩子
function closeDialog() {
  addForm.id = null
  addForm.name = ""
  addForm.identifier = ""
  addForm.permissionsApi = []
  addFormRef.value?.clearValidate()
  dialogVisible.value = false
  treeRef.value!.setCheckedKeys([])
}

// 重置查询框
function refreshRequest() {
  requestForm.keyword = ""
  requestForm.page = 1
  requestForm.pageSize = 20
  queryRoleList()
}

// 删除角色信息
async function deleteRoleInfo(id: number) {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该角色, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).catch((err) => err)
  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeletePermissionsRoleInfo({ id })
  await getRoleList()
}

// 递归获取tree 的所有 identifier
function getMenuNodeIdentifier(menuList: any) {
  const identifierList: any = []
  menuList.forEach((items: any) => {
    identifierList.push(items["identifier"])
    if (items["children"].length) {
      getMenuNodeIdentifier(items["children"]).forEach((item: any) => {
        identifierList.push(item)
      })
    }
  })
  return identifierList
}

// 全选/全不选事件
function checkedKeys(value: any) {
  if (value) {
    treeRef.value!.setCheckedKeys(getMenuNodeIdentifier(menuList.value))
  } else {
    treeRef.value!.setCheckedKeys([])
  }
}
</script>

<template>
  <el-card>
    <el-form ref="requestFormRef" :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.keyword" placeholder="名称/标识符进行查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryRoleList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Plus" plain @click="newButton">新增</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :title="title" :model-value="dialogVisible" width="50%" @open="getPermissionsList" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" inline label-width="80px" hide-required-asterisk>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="标识符" prop="identifier">
          <el-input v-model="addForm.identifier" placeholder="请输入标识符" clearable />
        </el-form-item>
        <el-form-item label="权限菜单" prop="permissionsApi">
          <div>
            <el-checkbox v-model="expand">展开/折叠</el-checkbox>
            <el-checkbox v-model="checked" @change="checkedKeys">全选/全不选</el-checkbox>
            <el-checkbox v-model="strictly">父子联动</el-checkbox>
            <el-tree
              :key="expand"
              ref="treeRef"
              class="tree"
              :data="menuList"
              show-checkbox
              node-key="identifier"
              :render-after-expand="false"
              :props="defaultProps"
              :default-expand-all="expand"
              :check-strictly="!strictly"
              :default-checked-keys="addForm.permissionsApi"
              @check-change="handleCheckChange"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-table v-loading="roleLoading" :data="roleList" style="width: 100%" header-row-class-name="table-header-style">
      <el-table-column type="index" label="编号" align="center" width="80px" />
      <el-table-column prop="name" label="角色名称" align="center" />
      <el-table-column prop="identifier" label="标识符" align="center" />
      <el-table-column prop="updateTime" label="修改时间" align="center" width="160px" />
      <el-table-column label="操作" align="center" width="160px">
        <template #default="scope">
          <el-button type="primary" link :icon="Edit" @click="updateButton(scope.row)">编辑</el-button>
          <el-button type="danger" link :icon="Delete" @click="deleteRoleInfo(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-container"
      :current-page="requestForm.page"
      :page-size="requestForm.pageSize"
      background
      layout="total, prev, pager, next, jumper"
      :total="requestForm.total"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<style scoped lang="scss">
.tree {
  border-style: solid;
  border-color: var(--el-border-color);
  border-width: 1px;
  border-radius: var(--el-border-radius-base);
}
</style>
