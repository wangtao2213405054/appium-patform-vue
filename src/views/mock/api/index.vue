<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import { EditMockApiRequestData, GetMockApiRequestData, MockApiInfoResponseData } from "@/api/mock/types/api"
import { ElDialog, ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus"
import { apiDeleteMockApiInfo, apiEditMockApiInfo, apiGetMockApiList } from "@/api/mock"
import { Edit, Delete, Plus, Search, Refresh } from "@element-plus/icons-vue"

const projectId = JSON.parse(localStorage.getItem("projectId") || "0")
const title = ref<string>("添加接口")
const dialogVisible = ref<boolean>(false)
const apiList = ref<MockApiInfoResponseData[]>([])
const addFormRef = ref<FormInstance | null>(null)
const requestFormRef = ref<FormInstance | null>(null)

// 校验 JSON
const checkJson = (_: any, value: any, callback: any) => {
  try {
    if (JSON.parse(value.trim())) {
      callback()
    }
  } catch (error) {
    callback("请输入正确的JSON结构")
  }
}

const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入接口名称", trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
  ],
  body: [
    { required: true, message: "请输入返回结构", trigger: "blur" },
    { validator: checkJson, trigger: "blur" }
  ],
  path: [{ required: true, message: "请输入接口路径", trigger: "blur" }]
}

const addForm: EditMockApiRequestData = reactive({
  name: "",
  path: "",
  body: "",
  projectId: projectId,
  id: 0
})
const requestForm: GetMockApiRequestData = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  name: "",
  path: "",
  projectId: projectId
})

// 查询
const queryApiList = () => {
  requestForm.page = 1
  getApiList()
}

// 重置
const refreshRequest = () => {
  requestForm.name = ""
  requestForm.path = ""
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
  addForm.body = ""
  addForm.id = 0
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
  addForm.body = JSON.stringify(JSON.parse(value.body), null, 2)
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
</script>

<template>
  <el-card>
    <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="接口名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入接口名称" clearable />
        </el-form-item>
        <el-form-item label="接口路径" prop="path">
          <el-input v-model="addForm.path" placeholder="请输入接口路径" clearable />
        </el-form-item>
        <el-form-item label="返回结构" prop="body">
          <el-input v-model="addForm.body" />
          <!-- <b-code-editor ref="editor" v-model="addForm.body" />-->
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
        <el-input v-model="requestForm.name" placeholder="输入接口名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="requestForm.path" placeholder="输入接口路径查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryApiList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Plus" type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table header-row-class-name="table-header-style" :data="apiList" style="width: 100%">
      <el-table-column type="index" label="编号" width="60px" align="center" />
      <el-table-column prop="name" label="接口名称" width="200px" />
      <el-table-column prop="path" label="接口路径" />
      <el-table-column prop="createTime" label="更新时间" width="160px" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="160px" align="center" />
      <el-table-column label="操作" width="160px" align="center">
        <template v-slot="scope">
          <el-button :icon="Edit" type="primary" link @click.stop="updateApi(scope.row)">编辑</el-button>
          <el-button :icon="Delete" type="danger" link @click.stop="deleteApiInfo(scope.row.id)">删除</el-button>
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
