<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { ElDialog, ElMessage, ElMessageBox, ElPagination, FormInstance, FormRules } from "element-plus"
import { Edit, Delete, Search, Refresh, Plus, MagicStick } from "@element-plus/icons-vue"
import { apiDeleteDynamicInfo, apiEditDynamicInfo, apiGetDynamicList } from "@/api/base"
import { checkPermission } from "@/utils/permission"
import { DynamicInfoResponseData, EditDynamicRequestData, GetDynamicRequestData } from "@/api/base/types/dynamic"
import Dictionary from "@/components/Select/dictionary.vue"

const title = ref<string>("添加动态组件")
const dialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const dynamicList = ref<DynamicInfoResponseData[]>([])
const addForm: EditDynamicRequestData = reactive({
  id: null,
  name: "",
  expression: "",
  type: "",
  element: "",
  placeholder: "",
  options: []
})
const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入动态组件名称", trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
  ],
  expression: [
    { required: true, message: "请输入组件要绑定的值", trigger: "blur" },
    { min: 2, max: 64, message: "长度在 2 到 64 个字符", trigger: "blur" }
  ],
  element: [{ required: true, message: "请选择组件类型", trigger: "blur" }]
}
const requestForm: GetDynamicRequestData = reactive({
  keyword: "",
  page: 1,
  pageSize: 20,
  total: 0
})

// 条件查询
const queryDynamicList = () => {
  requestForm.page = 1
  getDynamicList()
}

// 重置请求信息
const refreshRequest = () => {
  requestForm.keyword = ""
  getDynamicList()
}

const addFormRef = ref<FormInstance | null>(null)

// 编辑元素信息
const editDynamicInfo = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditDynamicInfo(addForm)
      dialogVisible.value = false
      await getDynamicList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
// 获取元素列表
const getDynamicList = async () => {
  loading.value = true
  const { items, total } = (await apiGetDynamicList(requestForm)).data
  dynamicList.value = items
  requestForm.total = total
  loading.value = false
}

// 删除元素
const deleteDynamicInfo = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该组件, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).catch((err) => err)
  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeleteDynamicInfo({ id })
  await getDynamicList()
}

// 修改button
const updateButton = (row: DynamicInfoResponseData) => {
  addForm.id = row.id
  addForm.name = row.name
  addForm.expression = row.expression
  addForm.placeholder = row.placeholder
  addForm.element = row.element
  addForm.type = row.type
  addForm.options = row.options
  title.value = "修改动态组件"
  dialogVisible.value = true
}

// 新建 Button
const openDialog = () => {
  title.value = "添加动态组件"
  dialogVisible.value = true
}

// 关闭弹窗的钩子
const closeDialog = () => {
  addForm.id = null
  addForm.name = ""
  addForm.expression = ""
  addForm.placeholder = ""
  addForm.options = []
  addForm.type = undefined
  addForm.element = undefined
  addFormRef.value?.clearValidate()
}

// 页码改变
const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getDynamicList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

let id = 0
// 添加额外绑定的参数
const addOptions = () => {
  /** 当上一个值为空时无法添加数据并触发 FormRef 校验 */
  for (let i = 0; i < addForm.options.length; i++) {
    id = addForm.options[i].id
    if (!addForm.options[i].value) {
      addFormRef.value?.validate()
      return ElMessage.error("请填写绑定值再添加")
    }
  }
  id++
  addForm.options.push({ id: id, value: "", label: "" })
}

// 删除指定数据
const deleteOptions = (index) => {
  addForm.options.splice(index, 1)
}

onMounted(() => {
  getDynamicList()
})

const deletePermission = computed(() => {
  return checkPermission(["/conf/dynamic/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/conf/dynamic/edit"])
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
  <el-card>
    <el-dialog :title="title" v-model="dialogVisible" width="50%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px" hide-required-asterisk>
        <el-form-item label="组件名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入动态组件名称" clearable />
        </el-form-item>
        <el-form-item label="绑定数据" prop="expression">
          <el-input v-model="addForm.expression" placeholder="请输入组件要绑定的数据" clearable />
        </el-form-item>
        <el-form-item label="组件类型">
          <dictionary v-model="addForm.element" placeholder="请选择组件类型" name="element" clearable />
        </el-form-item>
        <el-form-item v-if="addForm.element === 'input'" label="数据类型">
          <dictionary v-model="addForm.type" placeholder="请选择绑定值的数据类型" name="dataType" />
        </el-form-item>
        <el-form-item label="组件提示">
          <el-input v-model="addForm.placeholder" placeholder="请输入组件站位文本提示" clearable />
        </el-form-item>
        <el-row v-for="(item, index) in addForm.options" :key="item.id" :gutter="10">
          <el-col :span="10">
            <el-form-item
              label="绑定值"
              :prop="`options.${index}.value`"
              :rules="{
                required: true,
                message: '请输入绑定值',
                trigger: 'blur'
              }"
            >
              <el-input v-model="item.value" placeholder="请输入绑定值" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="信息描述"
              :prop="`options.${index}.label`"
              :rules="{
                required: true,
                message: '请输入绑定信息描述',
                trigger: 'blur'
              }"
            >
              <el-input v-model="item.label" placeholder="请输入绑定信息描述" clearable />
            </el-form-item>
          </el-col>
          <el-col style="text-align: center" :span="4">
            <el-button :icon="Delete" type="danger" @click="deleteOptions(index)">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="flex-container">
          <el-button
            v-if="addForm.element === 'select'"
            class="button"
            type="warning"
            :icon="MagicStick"
            @click="addOptions"
            >添加参数</el-button
          >
          <span class="end-button">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editDynamicInfo">确 定</el-button>
          </span>
        </div>
      </template>
    </el-dialog>
    <el-form :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.keyword" placeholder="名称/内容查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryDynamicList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editPermission" :icon="Plus" type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="dynamicList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="组件名称" width="200px" show-overflow-tooltip />
      <el-table-column prop="expression" label="绑定数据" width="200px" show-overflow-tooltip />
      <el-table-column prop="placeholder" label="组件提示" show-overflow-tooltip />
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
            @click.stop="deleteDynamicInfo(scope.row.id)"
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
.flex-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  .button {
    margin-right: auto;
  }
  .end-button {
    margin-left: auto;
  }
}
</style>
