<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue"
import {
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElRadio,
  FormRules,
  ElMessageBox,
  ElMessage,
  FormInstance,
  ElCollapseTransition
} from "element-plus"
import { Delete, Edit, Refresh, Search, Plus, ArrowDown, ArrowUp } from "@element-plus/icons-vue"
import { sha1 } from "@/utils/sha1"
import { apiDeleteAccountUserInfo, apiEditAccountUserInfo, apiGetAccountUserList } from "@/api/account"
import {
  AccountUserInfoResponseData,
  EditAccountUserRequestData,
  GetAccountUserRequestData
} from "@/api/account/types/user"
import { apiGetPermissionsRoleList } from "@/api/permissions"
import { PermissionsMenuInfoResponseData } from "@/api/permissions/types/menu"
import upload from "../../components/Upload/index.vue"
import { isEmail, isPhoneNumber } from "@/utils/validate"
import { checkPermission } from "@/utils/permission"

const updateDisabled = ref<boolean>(true)
const deleteDisabled = ref<boolean>(true)
const newDisabled = ref<boolean>(false)
const hiddenArea = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const tableLoading = ref<boolean>(false)

const roleList = ref<PermissionsMenuInfoResponseData[]>([])
const selectionUserList = ref<AccountUserInfoResponseData[]>([])
const userList = ref<AccountUserInfoResponseData[]>([])

const addForm = reactive<EditAccountUserRequestData>({
  id: undefined,
  name: "",
  email: "",
  mobile: "",
  password: "",
  state: true,
  department: [],
  role: undefined,
  avatarUrl: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
})

const requestForm = reactive<GetAccountUserRequestData>({
  id: 0,
  keyword: "",
  state: undefined,
  page: 1,
  pageSize: 10,
  total: 0
})

const stateList = ref([
  { key: true, value: "在职" },
  { key: false, value: "离职" }
])

const validateMobile = (_: any, value: any, callback: any) => {
  if (!isPhoneNumber(value)) {
    callback(new Error("请输入正确的手机号"))
  } else {
    callback()
  }
}

const validateUsername = (_: any, value: any, callback: any) => {
  if (!isEmail(value)) {
    callback(new Error("请输入正确的邮箱"))
  } else {
    callback()
  }
}

const addFormRef = ref<FormInstance | null>(null)
const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入正确的姓名", trigger: "blur" },
    { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
  ],
  mobile: [
    { required: true, message: "请输入正确的手机号", trigger: "blur" },
    { min: 11, max: 11, message: "长度在 11 个字符", trigger: "blur" },
    { required: true, validator: validateMobile, trigger: "blur" }
  ],
  email: [
    { required: true, message: "请输入正确的邮箱", trigger: "blur" },
    { min: 5, max: 60, message: "长度在 5 到 60 个字符", trigger: "blur" },
    { required: true, validator: validateUsername, trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入正确的密码", trigger: "blur" },
    { min: 8, max: 30, message: "长度在 8 到 30 个字符", trigger: "blur" }
  ],
  department: [{ required: true, message: "请选择正确的所属部门", trigger: "blur" }],
  role: [{ required: true, message: "请选择角色信息", trigger: "blur" }]
}

interface Props {
  classificationTree: any
  queryId: number
}

const props = withDefaults(defineProps<Props>(), {
  classificationTree: [],
  queryId: 0
})

onMounted(() => {
  if (props.queryId) {
    requestForm.id = props.queryId
  }
  getManagementList()
})

const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getManagementList()
}

// 获取用户列表
const getManagementList = async () => {
  tableLoading.value = true
  try {
    const { items, total } = (await apiGetAccountUserList(requestForm)).data
    userList.value = items
    requestForm.total = total
  } catch (e) {
    console.log(e)
  }
  tableLoading.value = false
}

const editManagementInfo = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    const addFormData = JSON.parse(JSON.stringify(addForm))
    if (!addFormData.id) {
      addFormData.password = sha1(addFormData.password)
    }
    if (valid) {
      await apiEditAccountUserInfo(addFormData)
      dialogVisible.value = false
      await getManagementList()
    } else {
      console.log("表单校验不通过", fields)
    }
  })
}

const getRoleList = async () => {
  const getRoleRequestForm = {
    page: 1,
    pageSize: 9999
  }
  const { items } = (await apiGetPermissionsRoleList(getRoleRequestForm)).data
  roleList.value = items
}

// 修改用户信息
const updateUserInfo = (value: AccountUserInfoResponseData) => {
  addForm.id = value.id
  addForm.name = value.name
  addForm.email = value.email
  addForm.mobile = value.mobile
  addForm.password = ""
  addForm.state = value.state
  addForm.department = value.department
  addForm.role = value.role
  addForm.avatarUrl = value.avatarUrl
  title.value = "修改用户"
  dialogVisible.value = true
}

// 数据查询
const queryGetList = () => {
  requestForm.page = 1
  getManagementList()
}

// 重置查询表单
const refreshQuery = () => {
  requestForm.id = undefined
  requestForm.keyword = ""
  requestForm.state = undefined
  queryGetList()
}

// 新增按钮
const newUserButton = () => {
  title.value = "新增用户"
  dialogVisible.value = true
}

// 重置提交表单
const closeResetFields = () => {
  addForm.id = undefined
  addForm.name = ""
  addForm.email = ""
  addForm.mobile = ""
  addForm.password = ""
  addForm.state = true
  addForm.department = []
  addForm.role = undefined
  addForm.avatarUrl = ""
  addFormRef.value?.clearValidate()
}

const deleteManagementInfo = async (userList: number[]) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).catch((err) => err)

  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }

  await apiDeleteAccountUserInfo({ id: userList })
  await getManagementList()
}
// 批量删除
const batchDelete = () => {
  const userList: number[] = []
  for (let i = 0; i < selectionUserList.value.length; i++) {
    userList.push(selectionUserList.value[i].id)
  }
  deleteManagementInfo(userList)
}
// 选中的用户组
const handleSelectionChange = (value: AccountUserInfoResponseData[]) => {
  selectionUserList.value = value
  updateDisabled.value = value.length !== 1 // 选中列表不为1时禁用此功能
  deleteDisabled.value = !value.length // 选中列表为空时禁用此功能
}

const deletePermission = computed(() => {
  return checkPermission(["/account/user/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/account/user/edit"])
})
const actionWidth = computed(() => {
  let width = 120
  if (!editPermission.value) {
    width -= 60
  }
  if (!deletePermission.value) {
    width -= 60
  }
  return width.toString()
})
</script>

<template>
  <div>
    <el-collapse-transition>
      <el-form v-show="!hiddenArea" :model="requestForm" inline size="small">
        <el-form-item prop="name">
          <el-input v-model="requestForm.keyword" class="request-form" placeholder="名称/手机号查询" clearable />
        </el-form-item>
        <el-form-item prop="state">
          <el-select v-model="requestForm.state" class="request-form" placeholder="选择用户状态查询" clearable>
            <el-option v-for="item in stateList" :key="item.value" :label="item.value" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="queryGetList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :icon="Refresh" @click="refreshQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-collapse-transition>
    <el-dialog :title="title" v-model="dialogVisible" width="700px" @close="closeResetFields" @open="getRoleList">
      <el-form
        ref="addFormRef"
        inline
        :model="addForm"
        :rules="addFormRules"
        hide-required-asterisk
        label-width="86px"
        size="small"
      >
        <el-form-item label="用户头像">
          <upload v-model="addForm.avatarUrl" />
        </el-form-item>
        <el-form-item style="display: block" />
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入用户名称" style="width: 180px" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="addForm.mobile"
            placeholder="请输入用户手机号"
            :maxlength="11"
            style="width: 180px"
            clearable
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入用户邮箱" style="width: 180px" clearable />
        </el-form-item>
        <el-form-item v-if="!addForm.id" label="密码" prop="password">
          <el-input
            autocomplete="new-password"
            v-model="addForm.password"
            placeholder="请输入用户密码"
            show-password
            style="width: 180px"
            clearable
          />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-cascader
            v-model="addForm.department"
            :props="{ value: 'id', label: 'name' }"
            :options="props.classificationTree"
            placeholder="请选择所属部门"
            style="width: 180px"
            clearable
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择用户角色" style="width: 180px" clearable>
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="addForm.id" label="状态" prop="state">
          <el-radio v-model="addForm.state" :label="true">在职</el-radio>
          <el-radio v-model="addForm.state" :label="false">离职</el-radio>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editManagementInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-form v-if="actionWidth !== '0'" inline size="small">
      <el-form-item v-if="editPermission">
        <el-button :icon="Plus" plain type="primary" :disabled="newDisabled" @click="newUserButton">新增</el-button>
      </el-form-item>
      <el-form-item v-if="editPermission">
        <el-button
          :icon="Edit"
          plain
          type="success"
          :disabled="updateDisabled"
          @click="updateUserInfo(selectionUserList[0])"
          >修改</el-button
        >
      </el-form-item>
      <el-form-item v-if="deletePermission">
        <el-button :icon="Delete" plain type="danger" :disabled="deleteDisabled" @click="batchDelete">删除</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button :icon="Refresh" circle plain type="primary" @click="getManagementList" />
        </el-tooltip>
      </el-form-item>
      <el-form-item style="float: right">
        <el-tooltip
          effect="dark"
          :hide-after="50"
          :content="hiddenArea ? '展示搜索框' : '收起搜索框'"
          placement="top"
          :enterable="false"
        >
          <el-button
            circle
            :icon="hiddenArea ? ArrowDown : ArrowUp"
            plain
            type="info"
            @click="hiddenArea = !hiddenArea"
          />
        </el-tooltip>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="tableLoading"
      :data="userList"
      style="width: 100%"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" label="编号" width="60px" align="center" />
      <el-table-column prop="name" label="用户名称" align="center" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机号" align="center" width="100px" />
      <el-table-column prop="state" label="状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.state" type="success" size="small">在职</el-tag>
          <el-tag v-else type="danger" size="small" effect="dark">离职</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="140px" align="center" />
      <el-table-column v-if="actionWidth !== '0'" label="操作" :width="actionWidth" align="center">
        <template #default="scope">
          <el-button
            v-if="editPermission"
            :icon="Edit"
            size="small"
            type="primary"
            link
            @click="updateUserInfo(scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="deletePermission"
            :icon="Delete"
            size="small"
            type="danger"
            link
            @click="deleteManagementInfo([scope.row['id']])"
          >
            删除
          </el-button>
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
  </div>
</template>

<style scoped lang="scss">
.request-form {
  width: 140px;
}
:deep(.disabled) {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
