<script setup lang="ts">
import { reactive, ref, onMounted, inject, onBeforeUnmount, computed } from "vue"
import {
  EditWorkerRequestData,
  GetWorkerRequestData,
  SocketWorkStatusResponseData,
  WorkerInfoResponseData
} from "@/api/devices/types/worker"
import { MasterInfoResponseData, MasterOnlineStatusSocketData } from "@/api/devices/types/master"
import { ElDialog, ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus"
import {
  apiDeleteWorkerInfo,
  apiEditWorkerInfo,
  apiEditWorkerStatusInfo,
  apiGetMasterList,
  apiGetWorkerList
} from "@/api/devices"
import Dictionary from "@/components/Select/dictionary.vue"
import Codemirror from "@/components/Codemirror/index.vue"
import { dict } from "@/components/Select/data"
import { VideoPause, VideoPlay, Plus, Delete, Search, Refresh, Edit } from "@element-plus/icons-vue"
import { isJson } from "@/utils/validate"
import { Socket } from "socket.io-client"
import { checkPermission } from "@/utils/permission"
import Mapping from "@/components/Map/index.vue"

const workerLoading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const title = ref<string>("添加设备")
const addFormRef = ref<FormInstance | null>(null)

// 校验 JSON
const checkJson = (_: any, value: any, callback: any) => {
  if (!isJson(value)) {
    callback(new Error("请输入正确的Json"))
  } else {
    callback()
  }
}

const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入设备名称", trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
  ],
  master: [{ required: true, message: "请选择归属设备", trigger: "blur" }],
  mapping: [
    { required: true, message: "请输入能力映射", trigger: "blur" },
    { validator: checkJson, trigger: "blur" }
  ]
}
const requestForm: GetWorkerRequestData = reactive({
  name: "",
  page: 1,
  pageSize: 20,
  total: 0,
  master: undefined,
  status: undefined
})
const addForm: EditWorkerRequestData = reactive({
  name: "",
  master: undefined,
  desc: "",
  blocker: 3,
  mapping: "",
  switch: true,
  logging: "INFO",
  id: null
})
const masterList = ref<MasterInfoResponseData[]>([])
const workerList = ref<WorkerInfoResponseData[]>([])

// 关闭弹窗钩子
const closeDialog = () => {
  addForm.name = ""
  addForm.master = undefined
  addForm.desc = ""
  addForm.blocker = 3
  addForm.mapping = ""
  addForm.switch = true
  addForm.logging = "INFO"
  addForm.id = null
  addFormRef.value?.clearValidate()
}
// 添加设备
const addDevice = () => {
  title.value = "添加设备"
  dialogVisible.value = true
}

// 提交表单
const submitForm = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditWorkerInfo(addForm)
      dialogVisible.value = false
      await getWorkerList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

// 获取设备列表
const getMasterList = async (bool: boolean) => {
  if (!bool) return
  const { items } = (await apiGetMasterList({ page: 1, pageSize: 9999 })).data
  masterList.value = items
}

// 获取执行设备列表
const getWorkerList = async () => {
  workerLoading.value = true
  const { items, total } = (await apiGetWorkerList(requestForm)).data
  workerList.value = items
  requestForm.total = total
  workerLoading.value = false
}

// 编辑设备
const updateDevice = (value: WorkerInfoResponseData) => {
  title.value = "编辑设备"
  addForm.name = value.name
  addForm.master = value.master
  addForm.desc = value.desc
  addForm.blocker = value.blocker
  addForm.mapping = JSON.stringify(JSON.parse(value.mapping), null, 2)
  addForm.switch = value.switch
  addForm.logging = value.logging
  addForm.id = value.id
  dialogVisible.value = true
}

// 删除设备
const deleteDeviceInfo = async (id: number, master: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该设备, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).catch((err) => err)

  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeleteWorkerInfo({ id, master })
  await getWorkerList()
}

// 页码改变
const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getWorkerList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

// 重置查询框
const refreshRequest = () => {
  requestForm.name = ""
  requestForm.master = undefined
  requestForm.status = undefined
  queryDeviceList()
}

// 查询角色列表
const queryDeviceList = () => {
  requestForm.page = 1
  getWorkerList()
}

// 修改设备状态
const updateDeviceStatus = async (id: number, status: boolean, online: number) => {
  const message = status ? "此操作将停止此设备, 此设备将不会再执行任务" : "此操作将开启此设备的任务进程"
  const clickConfirmResult = await ElMessageBox.confirm(message, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: status && online !== 4 && online === 1 ? "关闭进程" : "取消",
    type: "warning",
    distinguishCancelAndClose: true
  }).catch((err) => err)
  if (status && clickConfirmResult === "close") return
  if (clickConfirmResult !== "confirm" && !status) return
  if (online !== 4 && online !== 1 && clickConfirmResult !== "confirm") return
  await apiEditWorkerStatusInfo({ id, switch: !status, kill: clickConfirmResult === "cancel" })
  await getWorkerList()
}

const socket: Socket = inject("socket") as Socket
onMounted(() => {
  getMasterList(true)
  getWorkerList()
  socket.on("masterOnline", (data: MasterOnlineStatusSocketData) => {
    workerList.value.forEach((item) => {
      if (item.master === data.id) {
        item.status = data.online ? 0 : 4
      }
    })
  })
  socket.on("workerStatus", (data: SocketWorkStatusResponseData) => {
    workerList.value.forEach((item) => {
      if (item.id === data.id) {
        item.status = data.status
        item.cause = data.cause
      }
    })
  })
})
onBeforeUnmount(() => {
  socket.off("masterOnline")
  socket.off("workerStatus")
})

const deletePermission = computed(() => {
  return checkPermission(["/devices/worker/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/devices/worker/edit"])
})
const switchPermission = computed(() => {
  return checkPermission(["/devices/worker/switch"])
})
const actionWidth = computed(() => {
  let width = 210
  if (!editPermission.value) {
    width -= 70
  }
  if (!deletePermission.value) {
    width -= 70
  }
  if (!switchPermission.value) {
    width -= 70
  }
  return width.toString()
})
</script>

<template>
  <el-card v-loading="workerLoading">
    <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入设备名称" clearable />
        </el-form-item>
        <el-form-item label="归属设备" prop="master">
          <el-select v-model="addForm.master" placeholder="请选择归属设备" clearable @visible-change="getMasterList">
            <el-option
              v-for="item in masterList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.context >= item.maxContext"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备描述" prop="desc">
          <el-input v-model="addForm.desc" placeholder="请输入设备描述" clearable type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="日志等级">
          <dictionary v-model="addForm.logging" placeholder="请选择日志等级" name="logging" />
        </el-form-item>
        <el-form-item label="熔断阈值">
          <el-input-number v-model="addForm.blocker" :min="1" :max="10" label="请输入此设备的熔断阈值" />
        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <el-switch v-model="addForm.switch" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="能力映射" prop="mapping">
          <mapping v-model="addForm.mapping" style="margin-bottom: 10px" />
          <codemirror v-model="addForm.mapping" height="30vh" language="json" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-form :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.name" placeholder="输入设备名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="requestForm.master"
          placeholder="选择归属设备查询"
          clearable
          @visible-change="getMasterList"
        >
          <el-option v-for="item in masterList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <dictionary v-model="requestForm.status" placeholder="选择状态进行查询" name="workerStatus" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryDeviceList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editPermission" :icon="Plus" type="success" @click="addDevice">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="workerList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="设备名称" width="150px" />
      <el-table-column prop="blocker" label="熔断阈值" width="80px" align="center" />
      <el-table-column label="归属设备" width="120px" align="center">
        <template #default="scope">
          <div v-for="item in masterList" :key="item.id">
            <span v-if="scope.row.master === item.id">{{ item.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="事件描述" show-overflow-tooltip />
      <el-table-column label="设备状态" width="120px" align="center">
        <template #default="scope">
          <div v-for="item in dict['workerStatus']" :key="item.name">
            <el-tag v-if="scope.row.status === item.id" :type="item.type" disable-transitions>
              {{ item.name }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="160px" align="center" />
      <el-table-column v-if="actionWidth !== '0'" label="操作" :width="actionWidth" align="center">
        <template #default="scope">
          <el-button
            v-if="switchPermission"
            :icon="scope.row.switch ? VideoPause : VideoPlay"
            :type="scope.row.switch ? 'warning' : 'success'"
            link
            @click.stop="updateDeviceStatus(scope.row.id, scope.row.switch, scope.row.status)"
            >{{ scope.row.switch ? "关闭" : "开启" }}</el-button
          >
          <el-button v-if="editPermission" :icon="Edit" type="primary" link @click.stop="updateDevice(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="deletePermission"
            :icon="Delete"
            type="danger"
            link
            @click.stop="deleteDeviceInfo(scope.row.id, scope.row.master)"
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
