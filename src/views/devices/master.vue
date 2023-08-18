<script setup lang="ts">
import { reactive, ref, onMounted, inject, onBeforeUnmount, computed } from "vue"
import {
  EditMasterRequestData,
  GetMasterRequestData,
  MasterInfoResponseData,
  MasterOnlineStatusSocketData
} from "@/api/devices/types/master"
import { PermissionsMenuInfoResponseData } from "@/api/permissions/types/menu"
import {
  apiDeleteMasterInfo,
  apiEditMasterInfo,
  apiEditMasterStatusInfo,
  apiGetMasterList,
  apiGetMasterSocketRoomInfo
} from "@/api/devices"
import { ElDialog, ElMessage, ElMessageBox, ElPagination, FormInstance, FormRules } from "element-plus"
import { apiGetPermissionsRoleList } from "@/api/permissions"
import clip from "@/utils/clipboard"
import { useRouter } from "vue-router"
import { VideoPlay, VideoPause, Edit, Delete, DataLine, Refresh, Search, Plus } from "@element-plus/icons-vue"
import { Socket } from "socket.io-client"
import projectSelect from "@/components/Select/project-select.vue"
import Dictionary from "@/components/Select/dictionary.vue"
import { checkPermission } from "@/utils/permission"

const title = ref<string>("新增设备")
const dialogVisible = ref<boolean>(false)
const addForm: EditMasterRequestData = reactive({
  name: "",
  desc: "",
  role: undefined,
  maxContext: 4,
  projectId: undefined,
  status: true,
  token: "",
  logging: "INFO",
  id: null
})
const requestForm: GetMasterRequestData = reactive({
  name: "",
  page: 1,
  pageSize: 20,
  total: 0,
  projectId: undefined,
  status: undefined
})
const roleList = ref<PermissionsMenuInfoResponseData[]>([])
const masterList = ref<MasterInfoResponseData[]>([])

// 获取角色列表
const getRoleList = async (value: boolean) => {
  if (value) {
    const { items } = (await apiGetPermissionsRoleList({ page: 1, pageSize: 9999 })).data
    roleList.value = items
  }
}

// 添加设备时的钩子
const addDevice = () => {
  title.value = "添加设备"
  dialogVisible.value = true
}

// 编辑设备信息时的钩子
const updateDevice = (info: MasterInfoResponseData) => {
  addForm.id = info.id
  addForm.desc = info.desc
  addForm.logging = info.logging
  addForm.name = info.name
  addForm.role = info.role
  addForm.maxContext = info.maxContext
  addForm.projectId = info.projectId
  addForm.status = info.status
  addForm.token = info.token
  title.value = "编辑设备"
  dialogVisible.value = true
}

const addFormRef = ref<FormInstance | null>(null)
const addFormRules: FormRules = {
  name: [
    { required: true, message: '请输入设备名称', trigger: 'blur' },
    { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色信息', trigger: 'blur' }]
}
// 提交表单
const submitForm = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditMasterInfo(addForm)
      dialogVisible.value = false
      await getMasterList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
// 获取设备列表
const getMasterList = async () => {
  const { items, total } = (await apiGetMasterList(requestForm)).data
  masterList.value = items
  requestForm.total = total
}

// 关闭弹窗时的钩子
const closeDialog = () => {
  addForm.name = ""
  addForm.desc = ""
  addForm.role = undefined
  addForm.maxContext = 4
  addForm.projectId = undefined
  addForm.status = true
  addForm.token = ""
  addForm.logging = "INFO"
  addForm.id = null
  addFormRef.value?.clearValidate()
}
// 复制令牌
const copyToken = (text: string, event: any) => {
  clip(text, event)
}

// 删除设备
const deleteDeviceInfo = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该设备, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).catch((err) => err)

  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeleteMasterInfo({ id })
  await getMasterList()
}

// 重置查询框
const refreshRequest = () => {
  requestForm.name = ""
  requestForm.projectId = undefined
  requestForm.status = undefined
  queryDeviceList()
}

// 查询角色列表
const queryDeviceList = () => {
  requestForm.page = 1
  getMasterList()
}

// 修改设备当前状态
const updateDeviceStatus = async (id: number, status: boolean) => {
  const message = status
    ? "此操作将关闭此设备, 此设备将不会再执行任务（并不会关闭正在执行的任务）"
    : "此操作将开启此设备的任务轮训"
  const clickConfirmResult = await ElMessageBox.confirm(message, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).catch((err) => err)
  if (clickConfirmResult !== "confirm") return

  await apiEditMasterStatusInfo({ id, status: !status })
  await getMasterList()
}

// 页码改变
const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getMasterList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

const router = useRouter()
// 进入性能监控页面
const toCharts = async (id: number) => {
  const roomId = (await apiGetMasterSocketRoomInfo({ id })).data
  await router.push({ name: "DevicesProperty", params: { masterId: id, id: roomId.toString() } })
}

const socket: Socket = inject("socket") as Socket

onMounted(() => {
  getMasterList()
  getRoleList(true)
  socket.on("masterOnline", (data: MasterOnlineStatusSocketData) => {
    masterList.value.forEach((item) => {
      if (item.id === data.id) {
        item.online = data.online
      }
    })
  })
})
onBeforeUnmount(() => {
  socket.off("masterOnline")
})

const deletePermission = computed(() => {
  return checkPermission(["/devices/master/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/devices/master/edit"])
})
const statusPermission = computed(() => {
  return checkPermission(["/devices/master/status"])
})
const socketPermission = computed(() => {
  return checkPermission(["/devices/master/socket"])
})
const actionWidth = computed(() => {
  let width = 280
  if (!editPermission.value) {
    width -= 70
  }
  if (!deletePermission.value) {
    width -= 70
  }
  if (!statusPermission.value) {
    width -= 70
  }
  if (!socketPermission.value) {
    width -= 70
  }
  return width.toString()
})
</script>

<template>
  <el-card>
    <el-dialog :title="title" v-model="dialogVisible" width="50%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入设备名称" clearable />
        </el-form-item>
        <el-form-item label="所属角色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择设备绑定的角色" clearable @visible-change="getRoleList">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="日志等级">
          <dictionary v-model="addForm.logging" placeholder="请选择日志等级" name="logging" />
        </el-form-item>
        <el-form-item label="最大进程">
          <el-input-number v-model="addForm.maxContext" :min="1" :max="6" label="请输入最大进程数" />
        </el-form-item>
        <el-form-item label="所属项目" prop="projectId">
          <project-select v-model="addForm.projectId" placeholder="请选择设备所属项目" clearable />
        </el-form-item>
        <el-form-item v-if="addForm.token" label="设备令牌" prop="token">
          <el-input v-model="addForm.token" readonly disabled style="width: 80%" />
          <el-button style="margin-left: 10px" type="primary" plain @click.prevent="copyToken(addForm.token, $event)"
            >复制</el-button
          >
        </el-form-item>
        <el-form-item label="设备描述" prop="desc">
          <el-input v-model="addForm.desc" placeholder="请输入设备描述" clearable type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <el-switch v-model="addForm.status" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-form ref="requestFormRef" :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.name" placeholder="输入设备名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <project-select v-model="requestForm.projectId" placeholder="选择项目进行查询" clearable />
      </el-form-item>
      <el-form-item>
        <dictionary v-model="requestForm.status" name="masterStatus" placeholder="选择状态进行查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryDeviceList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item v-if="editPermission">
        <el-button :icon="Plus" type="success" @click="addDevice">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="masterList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="设备名称" width="150px" />
      <el-table-column label="角色信息" width="120px">
        <template #default="scope">
          <div v-for="item in roleList" :key="item.id">
            <span v-if="scope.row.role === item.id"> {{ item.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="online" label="设备状态" width="80px" align="center">
        <template #default="scope">
          <el-tag effect="dark" :type="scope.row.online ? 'success' : 'info'">{{
              scope.row.online ? "在线" : "离线"
            }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="maxContext" label="最大进程" width="80px" align="center" />
      <el-table-column prop="context" label="已绑设备" width="80px" align="center" />
      <el-table-column prop="desc" label="设备描述" show-overflow-tooltip />
      <el-table-column v-if="actionWidth !== '0'" label="操作" :width="actionWidth" align="center">
        <template #default="scope">
          <el-button
            v-if="statusPermission"
            :icon="scope.row.status ? VideoPause : VideoPlay"
            :type="scope.row.status ? 'warning' : 'success'"
            link
            @click.stop="updateDeviceStatus(scope.row.id, scope.row.status)"
            >{{ scope.row.status ? "关闭" : "开启" }}</el-button
          >
          <el-button v-if="socketPermission" :icon="DataLine" type="success" link @click.stop="toCharts(scope.row.id)"
            >性能</el-button
          >
          <el-button v-if="editPermission" :icon="Edit" type="primary" link @click.stop="updateDevice(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="deletePermission"
            :icon="Delete"
            type="danger"
            link
            @click.stop="deleteDeviceInfo(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-container"
      background
      :page-size="requestForm.pageSize"
      layout="total, prev, pager, next"
      :total="requestForm.total"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<style scoped lang="scss"></style>
