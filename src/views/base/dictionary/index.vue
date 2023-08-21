<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { ElDialog, ElMessage, ElMessageBox, ElPagination, FormInstance, FormRules } from "element-plus"
import { Edit, Delete, Search, Refresh, Plus, Collection } from "@element-plus/icons-vue"
import { apiDeleteDictionaryInfo, apiEditDictionaryInfo, apiGetDictionaryList } from "@/api/base"
import { checkPermission } from "@/utils/permission"
import {
  DictionaryInfoResponseData,
  EditDictionaryRequestData,
  GetDictionaryRequestData
} from "@/api/base/types/dictionary"
import Library from "./components/library.vue"

const title = ref<string>("添加字典")
const dialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const dictionaryList = ref<DictionaryInfoResponseData[]>([])

const libraryTitle = ref<string>("")
const libraryDialogVisible = ref<boolean>(false)
const libraryRequestCode = ref<string>("")
const addForm: EditDictionaryRequestData = reactive({
  id: null,
  name: "",
  code: "",
  desc: "",
  status: true
})
const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入字典名称", trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
  ],
  code: [
    { required: true, message: "请输入字典编码", trigger: "blur" },
    { min: 2, max: 64, message: "长度在 2 到 64 个字符", trigger: "blur" }
  ]
}
const requestForm: GetDictionaryRequestData = reactive({
  keyword: "",
  page: 1,
  pageSize: 20,
  total: 0
})

// 条件查询
const queryDictionaryList = () => {
  requestForm.page = 1
  getDictionaryList()
}

// 重置请求信息
const refreshRequest = () => {
  requestForm.keyword = ""
  getDictionaryList()
}

const addFormRef = ref<FormInstance | null>(null)

// 编辑字典信息
const editDictionaryInfo = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditDictionaryInfo(addForm)
      dialogVisible.value = false
      await getDictionaryList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
// 获取字典列表
const getDictionaryList = async () => {
  loading.value = true
  const { items, total } = (await apiGetDictionaryList(requestForm)).data
  dictionaryList.value = items
  requestForm.total = total
  loading.value = false
}

// 删除字典
const deleteDictionaryInfo = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该字典, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).catch((err) => err)
  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeleteDictionaryInfo({ id })
  await getDictionaryList()
}

// 修改button
const updateButton = (row: DictionaryInfoResponseData) => {
  addForm.id = row.id
  addForm.desc = row.desc
  addForm.code = row.code
  addForm.name = row.name
  addForm.status = row.status
  title.value = "修改字典"
  dialogVisible.value = true
}

// 新建 Button
const openDialog = () => {
  title.value = "添加字典"
  dialogVisible.value = true
}

// 关闭弹窗的钩子
const closeDialog = () => {
  addForm.id = null
  addForm.name = ""
  addForm.code = ""
  addForm.desc = ""
  addForm.status = true
  addFormRef.value?.clearValidate()
}

// 页码改变
const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getDictionaryList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

// 打开字典数据页面
const openLibrary = (row: DictionaryInfoResponseData) => {
  libraryTitle.value = `【${row.name}】字典数据`
  libraryDialogVisible.value = true
  libraryRequestCode.value = row.code
}

onMounted(() => {
  getDictionaryList()
})

const deletePermission = computed(() => {
  return checkPermission(["/conf/dictionary/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/conf/dictionary/edit"])
})
const dictPermission = computed(() => {
  return checkPermission(["/conf/library/list"])
})
const actionWidth = computed(() => {
  let width = 240
  if (!editPermission.value) {
    width -= 75
  }
  if (!deletePermission.value) {
    width -= 75
  }
  if (!dictPermission.value) {
    width -= 90
  }
  return width.toString()
})
</script>

<template>
  <el-card v-loading="loading">
    <el-dialog :title="title" v-model="dialogVisible" width="40%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px" hide-required-asterisk>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入字典名称" clearable />
        </el-form-item>
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="addForm.code" placeholder="请输入字典内容" clearable />
        </el-form-item>
        <el-form-item label="字典状态">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="true">正常</el-radio>
            <el-radio :label="false">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="字典备注" prop="desc">
          <el-input v-model="addForm.desc" type="textarea" :row="2" placeholder="请输入字典备注" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDictionaryInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="libraryTitle" v-model="libraryDialogVisible" width="50%">
      <Library :key="libraryRequestCode" :code="libraryRequestCode" />
    </el-dialog>
    <el-form :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.keyword" placeholder="输入字典名称/编码查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryDictionaryList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editPermission" :icon="Plus" type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dictionaryList" border stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="字典名称" width="200px" show-overflow-tooltip />
      <el-table-column prop="code" label="字典编码" width="200px" show-overflow-tooltip />
      <el-table-column label="状态" width="80px" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status" type="success" effect="dark" disable-transitions>正常</el-tag>
          <el-tag v-else type="danger" effect="dark" disable-transitions>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="字典描述" show-overflow-tooltip />
      <el-table-column prop="updateTime" label="更新时间" width="160px" align="center" />
      <el-table-column v-if="actionWidth !== '0'" label="操作" :width="actionWidth" align="center" fixed="right">
        <template #default="scope">
          <el-button v-if="dictPermission" :icon="Collection" type="primary" link @click.stop="openLibrary(scope.row)"
            >字典数据</el-button
          >
          <el-button v-if="editPermission" :icon="Edit" type="primary" link @click.stop="updateButton(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="deletePermission"
            :icon="Delete"
            type="danger"
            link
            @click.stop="deleteDictionaryInfo(scope.row.id)"
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
