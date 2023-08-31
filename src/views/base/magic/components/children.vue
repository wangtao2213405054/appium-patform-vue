<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { ElDialog, ElMessage, ElMessageBox, ElPagination, FormInstance, FormRules } from "element-plus"
import { Edit, Delete, Search, Refresh, Plus } from "@element-plus/icons-vue"
import { apiDeleteMagicInfo, apiEditMagicInfo, apiGetDynamicList, apiGetMagicList } from "@/api/base"
import { checkPermission } from "@/utils/permission"
import { EditMagicRequestData, GetMagicRequestData, MagicInfoResponseData } from "@/api/base/types/magic"
import { DynamicInfoResponseData } from "@/api/base/types/dynamic"

interface Props {
  type: "menu" | "function"
  id: number
}

const props = defineProps<Props>()

const title = ref<string>(props.type === "menu" ? "添加功能" : "添加函数")
const dialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const selectLoading = ref<boolean>(false)
const dictionaryList = ref<MagicInfoResponseData[]>([])
const magicElementList = ref<DynamicInfoResponseData[]>([])

const functionTitle = ref<string>("")
const libraryDialogVisible = ref<boolean>(false)
const addForm: EditMagicRequestData = reactive({
  id: null,
  desc: "",
  keyword: "",
  name: "",
  status: true,
  sort: 1,
  nodeId: props.id,
  params: [],
  type: props.type
})
const addFormRules: FormRules = {
  name: [
    { required: true, message: `请输入${props.type === "menu" ? "功能" : "函数"}名称`, trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
  ],
  keyword: [
    { required: true, message: `请输入${props.type === "menu" ? "功能" : "函数"}映射`, trigger: "blur" },
    { min: 1, max: 64, message: "长度在 1 到 64 个字符", trigger: "blur" }
  ]
}
const requestForm: GetMagicRequestData = reactive({
  keyword: "",
  page: 1,
  pageSize: 20,
  total: 0,
  type: props.type,
  nodeId: props.id
})

// 条件查询
const queryMagicList = () => {
  requestForm.page = 1
  getMagicList()
}

// 重置请求信息
const refreshRequest = () => {
  requestForm.keyword = ""
  getMagicList()
}

const addFormRef = ref<FormInstance | null>(null)

// 编辑魔法菜单信息
const editMagicInfo = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditMagicInfo(addForm)
      dialogVisible.value = false
      await getMagicList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
// 获取魔法菜单列表
const getMagicList = async () => {
  loading.value = true
  const { items, total } = (await apiGetMagicList(requestForm)).data
  dictionaryList.value = items
  requestForm.total = total
  loading.value = false
}

// 获取动态组件
const getMagicElementList = async (query: string) => {
  selectLoading.value = true
  const { items } = (await apiGetDynamicList({ page: 1, pageSize: 20, keyword: query })).data
  magicElementList.value = items
  selectLoading.value = false
}

// 删除魔法菜单
const deleteMagicInfo = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm(
    `此操作将永久删除该${props.type === "menu" ? "功能" : "函数"}, 是否继续?`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  ).catch((err) => err)
  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeleteMagicInfo({ id })
  await getMagicList()
}

// 修改button
const updateButton = async (row: MagicInfoResponseData) => {
  addForm.id = row.id
  addForm.desc = row.desc
  addForm.keyword = row.keyword
  addForm.name = row.name
  addForm.status = row.status
  addForm.sort = row.sort
  addForm.nodeId = row.nodeId
  addForm.params = row.params
  addForm.type = row.type
  title.value = props.type === "menu" ? "修改功能" : "修改函数"
  dialogVisible.value = true
  if (row.params.length) {
    const { items } = (await apiGetDynamicList({ page: 1, pageSize: 20, ids: row.params })).data
    magicElementList.value = items
  }
}

// 新建 Button
const openButton = () => {
  title.value = props.type === "menu" ? "添加功能" : "添加函数"
  dialogVisible.value = true
}

// 关闭弹窗的钩子
const closeDialog = () => {
  addForm.id = null
  addForm.desc = ""
  addForm.keyword = ""
  addForm.name = ""
  addForm.status = true
  addForm.sort = 1
  addForm.nodeId = props.id
  addForm.params = []
  addForm.type = props.type
  addFormRef.value?.clearValidate()
}

// 页码改变
const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getMagicList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

onMounted(() => {
  getMagicList()
})

const deletePermission = computed(() => {
  return checkPermission(["/conf/magic/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/conf/magic/edit"])
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
    <el-dialog :title="title" v-model="dialogVisible" width="40%" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px" hide-required-asterisk>
        <el-form-item :label="props.type === 'menu' ? '功能名称' : '函数名称'" prop="name">
          <el-input
            v-model="addForm.name"
            :placeholder="props.type === 'menu' ? '请输入功能名称' : '请输入函数名称'"
            clearable
          />
        </el-form-item>
        <el-form-item :label="props.type === 'menu' ? '功能映射' : '函数映射'" prop="code">
          <el-input
            v-model="addForm.keyword"
            :placeholder="props.type === 'menu' ? '请输入功能映射' : '请输入函数映射'"
            clearable
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="addForm.sort" :min="1" :max="9999" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="true">正常</el-radio>
            <el-radio :label="false">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="组件绑定">
          <el-select
            v-model="addForm.params"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请选择绑定的组件(无入参可不选)"
            style="width: 60%"
            :remote-method="getMagicElementList"
            :loading="selectLoading"
          >
            <el-option v-for="item in magicElementList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="addForm.desc" type="textarea" :row="2" placeholder="请输入备注信息" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editMagicInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="functionTitle" v-model="libraryDialogVisible" width="50%" />
    <el-form :model="requestForm" inline>
      <el-form-item>
        <el-input v-model="requestForm.keyword" placeholder="输入名称/编码查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryMagicList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editPermission" :icon="Plus" type="success" @click="openButton">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="dictionaryList" border stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column
        prop="name"
        :label="props.type === 'menu' ? '功能名称' : '函数名称'"
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column
        prop="keyword"
        :label="props.type === 'menu' ? '功能映射' : '函数映射'"
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column label="状态" width="80px" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status" type="success" effect="dark" disable-transitions>正常</el-tag>
          <el-tag v-else type="danger" effect="dark" disable-transitions>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述" show-overflow-tooltip />
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
            @click.stop="deleteMagicInfo(scope.row.id)"
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
