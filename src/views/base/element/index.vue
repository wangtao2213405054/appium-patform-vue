<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { EditElementRequestData, ElementInfoResponseData, GetElementRequestData } from "@/api/base/types/element"
import { ElDialog, ElMessage, ElMessageBox, ElPagination, FormInstance, FormRules } from "element-plus"
import { Edit, Delete, Search, Refresh, Plus } from "@element-plus/icons-vue"
import { apiDeleteElementInfo, apiEditElementInfo, apiGetElementList } from "@/api/base"
import { checkPermission } from "@/utils/permission"

const title = ref<string>("添加元素")
const dialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const elementList = ref<ElementInfoResponseData[]>([])
const addForm: EditElementRequestData = reactive({
  id: null,
  name: "",
  label: "",
  desc: "",
  platform: []
})
const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入元素名称", trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
  ],
  label: [
    { required: true, message: "请输入元素值", trigger: "blur" },
    { min: 2, max: 64, message: "长度在 2 到 64 个字符", trigger: "blur" }
  ],
  platform: [{ required: true, message: "请选择所属平台", trigger: "blur" }]
}
const requestForm: GetElementRequestData = reactive({
  keyword: "",
  page: 1,
  pageSize: 20,
  total: 0
})

// 条件查询
const queryElementList = () => {
  requestForm.page = 1
  getElementList()
}

// 重置请求信息
const refreshRequest = () => {
  requestForm.keyword = ""
  getElementList()
}

const addFormRef = ref<FormInstance | null>(null)

// 编辑元素信息
const editElementInfo = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditElementInfo(addForm)
      dialogVisible.value = false
      await getElementList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
// 获取元素列表
const getElementList = async () => {
  loading.value = true
  const { items, total } = (await apiGetElementList(requestForm)).data
  elementList.value = items
  requestForm.total = total
  loading.value = false
}

// 删除元素
const deleteElementInfo = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该元素, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).catch((err) => err)
  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeleteElementInfo({ id })
  await getElementList()
}

// 修改button
const updateButton = (row: ElementInfoResponseData) => {
  addForm.id = row.id
  addForm.desc = row.desc
  addForm.label = row.label
  addForm.name = row.name
  addForm.platform = row.platform
  title.value = "修改元素"
  dialogVisible.value = true
}

// 新建 Button
const openDialog = () => {
  title.value = "添加元素"
  dialogVisible.value = true
}

// 关闭弹窗的钩子
const closeDialog = () => {
  addForm.id = null
  addForm.name = ""
  addForm.label = ""
  addForm.desc = ""
  addForm.platform = []
  addFormRef.value?.clearValidate()
}

// 页码改变
const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getElementList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

onMounted(() => {
  getElementList()
})

const deletePermission = computed(() => {
  return checkPermission(["/conf/element/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/conf/element/edit"])
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
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px" hide-required-asterisk>
        <el-form-item label="元素名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入元素名称" clearable />
        </el-form-item>
        <el-form-item label="元素内容" prop="label">
          <el-input v-model="addForm.label" placeholder="请输入元素内容" clearable />
        </el-form-item>
        <el-form-item label="元素备注" prop="desc">
          <el-input v-model="addForm.desc" type="textarea" :row="2" placeholder="请输入元素备注" clearable />
        </el-form-item>
        <el-form-item label="所属平台" prop="platform">
          <el-checkbox-group v-model="addForm.platform">
            <el-checkbox label="selenium">Web端</el-checkbox>
            <el-checkbox label="appium">移动端</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editElementInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-form :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.keyword" placeholder="名称/内容查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryElementList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editPermission" :icon="Plus" type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="elementList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="元素名称" width="200px" show-overflow-tooltip />
      <el-table-column prop="label" label="元素内容" width="200px" show-overflow-tooltip />
      <el-table-column prop="desc" label="元素描述" show-overflow-tooltip />
      <el-table-column prop="updateTime" label="更新时间" width="160px" align="center" />
      <el-table-column v-if="actionWidth !== '0'" label="操作" :width="actionWidth" align="center">
        <template #default="scope">
          <el-button v-if="editPermission" :icon="Edit" type="primary" link @click.stop="updateButton(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="deletePermission"
            :icon="Delete"
            type="danger"
            link
            @click.stop="deleteElementInfo(scope.row.id)"
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
