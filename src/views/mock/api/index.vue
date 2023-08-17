<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue"
import { EditMockApiRequestData, GetMockApiRequestData, MockApiInfoResponseData } from "@/api/mock/types/api"
import { ElDialog, ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus"
import { apiDeleteMockApiInfo, apiEditMockApiInfo, apiGetMockApiList } from "@/api/mock"
import { Edit, Delete, Plus, Search, Refresh } from "@element-plus/icons-vue"
import Codemirror from "@/components/Codemirror/index.vue"
import { isJson, isApiPath } from "@/utils/validate"
import { Warning } from "@element-plus/icons-vue"
import { checkPermission } from "@/utils/permission"

const projectId = JSON.parse(localStorage.getItem("projectId") || "0")
const title = ref<string>("添加接口")
const dialogVisible = ref<boolean>(false)
const apiList = ref<MockApiInfoResponseData[]>([])
const addFormRef = ref<FormInstance | null>(null)
const requestFormRef = ref<FormInstance | null>(null)

// 校验 JSON
const checkJson = (_: any, value: any, callback: any) => {
  if (!isJson(value)) {
    callback(new Error("请输入正确的Json"))
  } else {
    callback()
  }
}

// 校验接口 Path
const checkPath = (_: any, value: any, callback: any) => {
  if (!isApiPath(value)) {
    callback(new Error("请输入正确的接口路径"))
  } else {
    callback()
  }
}

const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入接口名称", trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
  ],
  request: [
    { required: true, message: "请输入请求结构体", trigger: "blur" },
    { validator: checkJson, trigger: "blur" }
  ],
  response: [
    { required: true, message: "请输入返回结构体", trigger: "blur" },
    { validator: checkJson, trigger: "blur" }
  ],
  path: [
    { required: true, message: "请输入接口路径", trigger: "blur" },
    { validator: checkPath, trigger: "blur" }
  ]
}

const addForm: EditMockApiRequestData = reactive({
  name: "",
  path: "",
  projectId: projectId,
  id: null,
  overall: false,
  recordRequest: false,
  recordResponse: false,
  breakpointRequest: false,
  breakpointResponse: true,
  request: "",
  response: ""
})
const requestForm: GetMockApiRequestData = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  keyword: "",
  projectId: projectId
})

// 查询
const queryApiList = () => {
  requestForm.page = 1
  getApiList()
}

// 重置
const refreshRequest = () => {
  requestForm.keyword = ""
  requestForm.page = 1
  requestForm.pageSize = 20
  queryApiList()
}

// 添加接口
const openDialog = () => {
  title.value = "添加接口"
  dialogVisible.value = true
}

// 关闭弹窗的钩子
const closeDialog = () => {
  addForm.name = ""
  addForm.path = ""
  addForm.overall = false
  addForm.recordRequest = false
  addForm.recordResponse = false
  addForm.breakpointRequest = false
  addForm.breakpointResponse = true
  addForm.request = ""
  addForm.response = ""
  addForm.id = null
  addFormRef.value?.clearValidate()
}

// 提交表单
const submitForm = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditMockApiInfo(addForm)
      ElMessage.success("保存成功")
      dialogVisible.value = false
      await getApiList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

// 页码改变
const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getApiList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

// 删除接口
const deleteApiInfo = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该接口, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).catch((err) => err)

  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeleteMockApiInfo({ id })
  await getApiList()
}

// 编辑接口
const updateApi = (value: MockApiInfoResponseData) => {
  title.value = "编辑接口"
  addForm.id = value.id
  addForm.path = value.path
  addForm.name = value.name
  addForm.request = value.request !== "" ? JSON.stringify(JSON.parse(value.request), null, 2) : ""
  addForm.response = value.response !== "" ? JSON.stringify(JSON.parse(value.response), null, 2) : ""
  dialogVisible.value = true
}

// 获取接口列表
const getApiList = async () => {
  const { items, total } = (await apiGetMockApiList(requestForm)).data
  apiList.value = items
  requestForm.total = total
}

onMounted(() => {
  getApiList()
})

const deletePermission = computed(() => {
  return checkPermission(["/mock/api/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/mock/api/edit"])
})
const actionWidth = computed(() => {
  let width = 160
  if (!editPermission.value) {
    width -= 80
  }
  if (!deletePermission.value) {
    width -= 80
  }
  return width.toString()
})
</script>

<template>
  <el-card>
    <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="90px">
        <el-form-item label="接口名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
        </el-form-item>
        <el-form-item label="接口路径" prop="path">
          <el-input v-model="addForm.path" placeholder="请输入接口路径" clearable />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <template #label>
                <span class="form-label">
                  <span>全局配置</span>
                  <el-tooltip
                    content="当打开此项后, 此接口将会在 测试开始~测试结束 一直处于Mock状态, 关闭时只有在对应调用用例中进行Mock"
                    placement="top"
                  >
                    <el-icon><Warning /></el-icon>
                  </el-tooltip>
                </span>
              </template>
              <el-switch v-model="addForm.overall" class="switch" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <template #label>
                <span class="form-label">
                  <span>记录请求</span>
                  <el-tooltip
                    content="当打开此项后会记录当前接口的请求信息, 注意只会记录最新一次的请求"
                    placement="top"
                  >
                    <el-icon><Warning /></el-icon>
                  </el-tooltip>
                </span>
              </template>
              <el-switch v-model="addForm.recordRequest" class="switch" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <template #label>
                <span class="form-label">
                  <span>记录响应</span>
                  <el-tooltip
                    content="当打开此项后会记录当前接口的响应信息, 注意只会记录最新一次的响应"
                    placement="top"
                  >
                    <el-icon><Warning /></el-icon>
                  </el-tooltip>
                </span>
              </template>
              <el-switch v-model="addForm.recordResponse" class="switch" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <template #label>
            <span class="form-label">
              <span>修改请求</span>
              <el-tooltip content="打开此项后将会覆盖客户端的请求信息, 由用户提供请求JSON" placement="top">
                <el-icon><Warning /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-switch v-model="addForm.breakpointRequest" class="switch" />
        </el-form-item>
        <el-form-item v-if="addForm.breakpointRequest" label="请求结构" prop="request">
          <codemirror v-model="addForm.request" height="30vh" language="json" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span class="form-label">
              <span>修改响应</span>
              <el-tooltip content="打开此项后将会覆盖服务器的响应信息, 由用户提供响应JSON" placement="top">
                <el-icon><Warning /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-switch v-model="addForm.breakpointResponse" class="switch" />
        </el-form-item>
        <el-form-item v-if="addForm.breakpointResponse" label="返回结构" prop="response">
          <codemirror v-model="addForm.response" height="30vh" language="json" />
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
        <el-input v-model="requestForm.keyword" placeholder="输入名称/路径查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryApiList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item v-if="editPermission">
        <el-button :icon="Plus" type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="apiList" style="width: 100%">
      <el-table-column type="index" label="编号" width="60px" align="center" />
      <el-table-column prop="name" label="接口名称" width="200px" />
      <el-table-column prop="path" label="接口路径" />
      <el-table-column prop="createTime" label="创建时间" width="160px" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="160px" align="center" />
      <el-table-column v-if="actionWidth !== '0'" label="操作" :width="actionWidth" align="center">
        <template #default="scope">
          <el-button v-if="editPermission" :icon="Edit" type="primary" link @click.stop="updateApi(scope.row)"
            >编辑</el-button
          >
          <el-button v-if="deletePermission" :icon="Delete" type="danger" link @click.stop="deleteApiInfo(scope.row.id)"
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

<style scoped lang="scss">
.switch {
  --el-switch-on-color: #13ce66;
  --el-switch-off-color: #ff4949;
}
.form-label {
  display: flex;
  place-items: center;
  .el-icon {
    margin-left: 3px;
  }
}
</style>
