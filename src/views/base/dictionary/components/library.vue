<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { ElDialog, ElMessage, ElMessageBox, ElPagination, FormInstance, FormRules } from "element-plus"
import { Edit, Delete, Search, Refresh, Plus } from "@element-plus/icons-vue"
import { apiDeleteLibraryInfo, apiEditLibraryInfo, apiGetLibraryList } from "@/api/base"
import { checkPermission } from "@/utils/permission"
import { EditLibraryRequestData, GetLibraryRequestData, LibraryInfoResponseData } from "@/api/base/types/library"
import Dictionary from "@/components/Select/dictionary.vue"
import { isString } from "@/utils/validate"

interface Props {
  code: string
}
const props = defineProps<Props>()

const title = ref<string>("添加字典数据")
const dialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const libraryList = ref<LibraryInfoResponseData[]>([])
const addForm: EditLibraryRequestData = reactive({
  id: null,
  name: "",
  value: "",
  desc: "",
  valueType: "String",
  sort: 1,
  code: props.code,
  status: true
})
// 校验数字长度
const checkLength = (_: any, value: any, callback: any) => {
  if (!isString(value)) {
    value = value.toString()
  }
  if (value.length < 1 || value.length > 32) {
    callback(new Error("长度在 1 到 32 个字符"))
  } else {
    callback()
  }
}

const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入字典数据名称", trigger: "blur" },
    { validator: checkLength, trigger: "blur" }
  ],
  value: [
    { required: true, message: "请输入字典数据值", trigger: "blur" },
    { validator: checkLength, trigger: "blur" }
  ]
}
const requestForm: GetLibraryRequestData = reactive({
  name: "",
  page: 1,
  pageSize: 20,
  total: 0,
  code: props.code
})

// 条件查询
const queryLibraryList = () => {
  requestForm.page = 1
  getLibraryList()
}

// 重置请求信息
const refreshRequest = () => {
  requestForm.name = ""
  getLibraryList()
}

const addFormRef = ref<FormInstance | null>(null)

// 编辑字典数据信息
const editLibraryInfo = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditLibraryInfo(addForm)
      dialogVisible.value = false
      await getLibraryList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
// 获取字典数据列表
const getLibraryList = async () => {
  loading.value = true
  const { items, total } = (await apiGetLibraryList(requestForm)).data
  libraryList.value = items
  requestForm.total = total
  loading.value = false
}

// 删除字典数据
const deleteLibraryInfo = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该字典数据, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).catch((err) => err)
  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeleteLibraryInfo({ id })
  await getLibraryList()
}

// 修改button
const updateButton = (row: LibraryInfoResponseData) => {
  addForm.id = row.id
  addForm.desc = row.desc
  addForm.name = row.name
  addForm.valueType = row.valueType
  addForm.value = row.value
  addForm.sort = row.sort
  addForm.status = row.status
  title.value = "修改字典数据"
  dialogVisible.value = true
}

// 新建 Button
const openDialog = () => {
  title.value = "添加字典数据"
  dialogVisible.value = true
}

// 关闭弹窗的钩子
const closeDialog = () => {
  addForm.id = null
  addForm.name = ""
  addForm.desc = ""
  addForm.valueType = "String"
  addForm.value = ""
  addForm.sort = 1
  addForm.status = true
  addFormRef.value?.clearValidate()
}

// 页码改变
const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getLibraryList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

onMounted(() => {
  getLibraryList()
})

const deletePermission = computed(() => {
  return checkPermission(["/conf/library/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/conf/library/edit"])
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
  <div>
    <el-dialog :title="title" v-model="dialogVisible" width="30%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px" hide-required-asterisk>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入字典数据名称" clearable />
        </el-form-item>
        <el-form-item label="数据类型">
          <dictionary :key="addForm.valueType" v-model="addForm.valueType" name="dataType" />
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input v-model="addForm.value" placeholder="请输入字典值" clearable />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="addForm.sort" :min="1" :max="9999" controls-position="right" />
        </el-form-item>
        <el-form-item label="字典状态">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="true">正常</el-radio>
            <el-radio :label="false">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="addForm.desc" type="textarea" :row="2" placeholder="请输入字典数据备注" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editLibraryInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-form :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.name" placeholder="字典名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryLibraryList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editPermission" :icon="Plus" type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="libraryList" border stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="字典名称" width="200px" show-overflow-tooltip />
      <el-table-column prop="value" label="字典值" show-overflow-tooltip />
      <el-table-column label="状态" width="80px" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status" type="success" effect="dark" disable-transitions>正常</el-tag>
          <el-tag v-else type="danger" effect="dark" disable-transitions>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="actionWidth !== '0'" label="操作" :width="actionWidth" align="center" fixed="right">
        <template #default="scope">
          <el-button v-if="editPermission" :icon="Edit" type="primary" link @click.stop="updateButton(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="deletePermission"
            :icon="Delete"
            type="danger"
            link
            @click.stop="deleteLibraryInfo(scope.row.id)"
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
  </div>
</template>

<style scoped lang="scss"></style>
