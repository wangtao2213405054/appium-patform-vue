<script setup lang="ts">
import {
  EditMockDomainRequestData,
  GetMockDomainRequestData,
  MockDomainInfoResponseData
} from "@/api/mock/types/domain"
import { ref, reactive, onMounted, computed } from "vue"
import { ElDialog, ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus"
import { apiDeleteMockDomainInfo, apiEditMockDomainInfo, apiGetMockDomainList } from "@/api/mock"
import { Refresh, Edit, Plus, Delete, Search } from "@element-plus/icons-vue"
import { isDomain, isIpPort } from "@/utils/validate"
import { checkPermission } from "@/utils/permission"

const projectId = JSON.parse(localStorage.getItem("projectId") || "0")
const title = ref<string>("添加域名")
const dialogVisible = ref<boolean>(false)
const addFormRef = ref<FormInstance | null>(null)
const requestForm: GetMockDomainRequestData = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  keyword: "",
  protocol: "",
  projectId: projectId
})
const addForm: EditMockDomainRequestData = reactive({
  name: "",
  protocol: "https",
  port: "443",
  domain: "",
  projectId: projectId,
  id: 0
})
// 校验 JSON
const checkDomain = (_: any, value: any, callback: any) => {
  if (isIpPort(value) || isDomain(value)) {
    callback()
  } else {
    callback(new Error("请输入正确的域名"))
  }
}
const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入域名名称", trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
  ],
  protocol: [{ required: true, message: "请选择通讯协议", trigger: "blur" }],
  domain: [
    { required: true, message: "请输入域名信息", trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 256 个字符", trigger: "blur" },
    { validator: checkDomain, trigger: "blur" }
  ],
  port: [{ required: true, message: "请选择协议端口", trigger: "blur" }]
}
const protocolList = ref([
  { label: "HTTPS", key: "https" },
  { label: "HTTP", key: "http" }
])
const portList = ref(["443", "80"])
const domainList = ref<MockDomainInfoResponseData[]>([])
const domainLoading = ref<boolean>(false)
const deletePermission = computed(() => {
  return checkPermission(["/mock/domain/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/mock/domain/edit"])
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

onMounted(() => {
  getDomainList()
})

// 查询
const queryDomainList = () => {
  requestForm.page = 1
  getDomainList()
}

// 重置
const refreshRequest = () => {
  requestForm.keyword = ""
  requestForm.protocol = ""
  requestForm.page = 1
  requestForm.pageSize = 20
  queryDomainList()
}

// 添加域名
const openDialog = () => {
  title.value = "添加域名"
  dialogVisible.value = true
}

// 关闭弹窗的钩子
const closeDialog = () => {
  addForm.name = ""
  addForm.protocol = "https"
  addForm.port = "443"
  addForm.domain = ""
  addForm.id = 0
  addFormRef.value?.clearValidate()
}

// 提交表单
const submitForm = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditMockDomainInfo(addForm)
      ElMessage.success("保存成功")
      dialogVisible.value = false
      await getDomainList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

// 页码改变
const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getDomainList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

// 删除域名
const deleteDomainInfo = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该域名, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).catch((err) => err)

  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }

  await apiDeleteMockDomainInfo({ id })
  await getDomainList()
}

// 编辑域名
const updateDomain = (value: MockDomainInfoResponseData) => {
  title.value = "编辑域名"
  addForm.name = value.name
  addForm.protocol = value.protocol
  addForm.port = value.port
  addForm.domain = value.domain
  addForm.id = value.id
  dialogVisible.value = true
}

// 获取域名列表
const getDomainList = async () => {
  domainLoading.value = true
  const { items, total } = (await apiGetMockDomainList(requestForm)).data
  domainList.value = items
  requestForm.total = total
  domainLoading.value = false
}
</script>

<template>
  <el-card v-loading="domainLoading">
    <el-dialog :title="title" v-model="dialogVisible" width="50%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="通讯协议" prop="protocol">
          <el-select v-model="addForm.protocol" placeholder="请选择通讯协议" clearable>
            <el-option v-for="item in protocolList" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="域名名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入域名名称" clearable />
        </el-form-item>
        <el-form-item label="域名信息" prop="domain">
          <el-input v-model="addForm.domain" placeholder="请输入域名信息" clearable />
        </el-form-item>
        <el-form-item label="协议端口" prop="port">
          <el-select v-model="addForm.port" placeholder="请选择通讯协议" clearable filterable allow-create>
            <el-option v-for="item in portList" :key="item" :label="item" :value="item" />
          </el-select>
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
        <el-input v-model="requestForm.keyword" placeholder="输入名称/域名查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="requestForm.protocol" placeholder="选择通讯协议查询" clearable>
          <el-option v-for="item in protocolList" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryDomainList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item v-if="editPermission">
        <el-button :icon="Plus" type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="domainList" style="width: 100%">
      <el-table-column type="index" label="编号" width="60px" align="center" />
      <el-table-column prop="name" label="域名名称" width="200px" />
      <el-table-column prop="protocol" label="通讯协议" width="120px" align="center">
        <template #default="scope">
          <div v-for="item in protocolList" :key="item.key">
            <span v-if="scope.row.protocol === item.key"> {{ item.label }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="domain" label="域名信息" align="center" />
      <el-table-column prop="port" label="协议端口" width="120px" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="160px" align="center" />
      <el-table-column v-if="actionWidth !== '0'" label="操作" :width="actionWidth" align="center">
        <template #default="scope">
          <el-button v-if="editPermission" :icon="Edit" type="primary" link @click.stop="updateDomain(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="deletePermission"
            :icon="Delete"
            type="danger"
            link
            @click.stop="deleteDomainInfo(scope.row.id)"
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
