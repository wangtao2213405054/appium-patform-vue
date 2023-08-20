<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { EditVersionRequestData, GetVersionRequestData, VersionInfoResponseData } from "@/api/version/types/version"
import { ElDialog, ElMessageBox, ElMessage, FormInstance, FormRules, ElPagination } from "element-plus"
import { apiDeleteVersionInfo, apiEditVersionInfo, apiGetVersionList } from "@/api/version"
import { Search, Refresh, Plus, Edit, Delete, Warning } from "@element-plus/icons-vue"
import { isVersion } from "@/utils/validate"
import { checkPermission } from "@/utils/permission"

const projectId: number = JSON.parse(localStorage.getItem("projectId"))
const title = ref<string>("添加版本")
const dialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const versionList = ref<VersionInfoResponseData[]>([])
const addForm: EditVersionRequestData = reactive({
  name: "",
  projectId: projectId,
  identify: "",
  desc: "",
  id: null
})
const requestForm: GetVersionRequestData = reactive({
  name: "",
  page: 1,
  pageSize: 20,
  total: 0,
  projectId: projectId
})

// 校验 版本
const checkVersion = (_: any, value: any, callback: any) => {
  if (!isVersion(value)) {
    callback(new Error("请输入正确的版本号"))
  } else {
    callback()
  }
}

const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入版本名称", trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
  ],
  identify: [
    { required: true, message: "请输入版本标识", trigger: "blur" },
    { validator: checkVersion, trigger: "blur" }
  ]
}

// 查询版本信息
const queryVersionList = () => {
  requestForm.page = 1
  getVersionList()
}

// 重置请求信息
const refreshRequest = () => {
  requestForm.name = ""
  queryVersionList()
}

// 添加版本信息
const addVersion = () => {
  title.value = "添加版本"
  dialogVisible.value = true
}

const addFormRef = ref<FormInstance | null>(null)
// 关闭弹窗的事件
const closeDialog = () => {
  addForm.name = ""
  addForm.identify = ""
  addForm.desc = ""
  addForm.id = null
  addFormRef.value?.clearValidate()
}

// 提交表单
const submitForm = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditVersionInfo(addForm)
      dialogVisible.value = false
      await getVersionList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

// 获取版本列表
const getVersionList = async () => {
  loading.value = true
  const { items, total } = (await apiGetVersionList(requestForm)).data
  const effectList = ["success", "info", "warning", "danger", null]
  items.forEach((item: VersionInfoResponseData) => {
    item.effect = effectList[Math.floor(Math.random() * effectList.length)]
  })
  versionList.value = items
  requestForm.total = total
  loading.value = false
}

// 页码改变
const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getVersionList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

// 编辑版本
const updateVersion = (row: VersionInfoResponseData) => {
  title.value = "编辑版本"
  addForm.id = row.id
  addForm.desc = row.desc
  addForm.name = row.name
  addForm.identify = row.identify
  dialogVisible.value = true
}

// 删除版本
const deleteVersionInfo = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该版本, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).catch((err) => err)
  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeleteVersionInfo({ id })
  await getVersionList()
}

onMounted(() => {
  getVersionList()
})

const deletePermission = computed(() => {
  return checkPermission(["/business/version/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/business/version/edit"])
})
const actionWidth = computed(() => {
  let width = 150
  if (!editPermission.value) {
    width -= 75
  }
  if (!deletePermission.value) {
    width -= 75
  }
  return width.toString()
})
</script>

<template>
  <el-card v-loading="loading">
    <el-dialog :title="title" v-model="dialogVisible" width="50%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="版本名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入版本名称" clearable />
        </el-form-item>
        <el-form-item prop="identify">
          <template #label>
            <span class="form-label">
              <span>版本标识</span>
              <el-tooltip
                effect="dark"
                content="版本标识必须为 X.Y.Z, 请让位长一致,否者可能会出现意想不到的结果 推荐使用应用实际的版本标识，用于任务过滤。"
                placement="top"
              >
                <el-icon><Warning /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="addForm.identify" placeholder="请输入版本标识" clearable />
        </el-form-item>
        <el-form-item label="版本描述" prop="desc">
          <el-input v-model="addForm.desc" placeholder="请输入版本描述" clearable type="textarea" :rows="3" />
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
        <el-input v-model="requestForm.name" placeholder="输入版本名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryVersionList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editPermission" :icon="Plus" type="success" @click="addVersion">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="versionList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="版本名称" width="150px" />
      <el-table-column prop="name" label="版本标识" width="150px">
        <template #default="scope">
          <el-tag disable-transitions :type="scope.row.effect">{{ scope.row.identify }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="版本描述" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="160px" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="160px" align="center" />
      <el-table-column v-if="actionWidth !== '0'" label="操作" :width="actionWidth" align="center">
        <template #default="scope">
          <el-button v-if="editPermission" :icon="Edit" type="primary" link @click.stop="updateVersion(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="deletePermission"
            :icon="Delete"
            type="danger"
            link
            @click.stop="deleteVersionInfo(scope.row.id)"
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
.form-label {
  display: flex;
  place-items: center;
  .el-icon {
    margin-left: 3px;
  }
}
</style>
