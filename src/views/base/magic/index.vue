<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue"
import { ElDialog, ElMessage, ElMessageBox, ElPagination, FormInstance, FormRules } from "element-plus"
import { Edit, Delete, Search, Refresh, Plus, Collection, SetUp, TrophyBase } from "@element-plus/icons-vue"
import { apiDeleteMagicInfo, apiEditMagicInfo, apiGetMagicList } from "@/api/base"
import { checkPermission } from "@/utils/permission"
import { EditMagicRequestData, GetMagicRequestData, MagicInfoResponseData } from "@/api/base/types/magic"
import Children from "./components/children.vue"

const title = ref<string>("添加魔法菜单")
const dialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const dictionaryList = ref<MagicInfoResponseData[]>([])

const functionTitle = ref<string>("")
const childrenDialogVisible = ref<boolean>(false)
const childrenRequestId = ref<number>(0)
const childrenRequestType = ref<string>("menu")
const addForm: EditMagicRequestData = reactive({
  id: null,
  desc: "",
  keyword: "",
  name: "",
  status: true,
  sort: 1,
  nodeId: 0,
  params: [],
  type: "menu"
})
const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入魔法菜单名称", trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" }
  ],
  keyword: [
    { required: true, message: "请输入功能函数类映射", trigger: "blur" },
    { min: 1, max: 64, message: "长度在 1 到 64 个字符", trigger: "blur" }
  ]
}
const requestForm: GetMagicRequestData = reactive({
  keyword: "",
  page: 1,
  pageSize: 20,
  total: 0,
  type: "menu",
  nodeId: 0
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

// 删除魔法菜单
const deleteMagicInfo = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该魔法菜单, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).catch((err) => err)
  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeleteMagicInfo({ id })
  await getMagicList()
}

// 修改button
const updateButton = (row: MagicInfoResponseData) => {
  addForm.id = row.id
  addForm.desc = row.desc
  addForm.keyword = row.keyword
  addForm.name = row.name
  addForm.status = row.status
  addForm.sort = row.sort
  addForm.nodeId = row.nodeId
  addForm.params = row.params
  addForm.type = row.type
  title.value = "修改魔法菜单"
  dialogVisible.value = true
}

// 新建 Button
const openDialog = () => {
  title.value = "添加魔法菜单"
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
  addForm.nodeId = 0
  addForm.params = []
  addForm.type = "menu"
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

// 打开魔法菜单数据页面
const openChildren = (row: MagicInfoResponseData, type: "menu" | "function") => {
  functionTitle.value = `【${row.name}】${type === 'menu' ? '功能列表' : '函数列表'}`
  childrenDialogVisible.value = true
  childrenRequestId.value = row.id
  childrenRequestType.value = type
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
  let width = 340
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
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入魔法菜单名称" clearable />
        </el-form-item>
        <el-form-item label="菜单映射" prop="keyword">
          <el-input v-model="addForm.keyword" placeholder="请输入魔法菜单映射" clearable />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="addForm.sort" :min="1" :max="9999" controls-position="right" />
        </el-form-item>
        <el-form-item label="菜单状态">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="true">正常</el-radio>
            <el-radio :label="false">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单备注" prop="desc">
          <el-input v-model="addForm.desc" type="textarea" :row="2" placeholder="请输入魔法菜单备注" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editMagicInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="functionTitle" v-model="childrenDialogVisible" width="70%">
      <children :key="childrenRequestId && childrenRequestType" :id="childrenRequestId" :type="childrenRequestType" />
    </el-dialog>
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
        <el-button v-if="editPermission" :icon="Plus" type="success" @click="openDialog">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="dictionaryList" border stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="菜单名称" width="200px" show-overflow-tooltip />
      <el-table-column prop="keyword" label="菜单映射" width="200px" show-overflow-tooltip />
      <el-table-column label="状态" width="80px" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status" type="success" effect="dark" disable-transitions>正常</el-tag>
          <el-tag v-else type="danger" effect="dark" disable-transitions>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="菜单描述" show-overflow-tooltip />
      <el-table-column prop="updateTime" label="更新时间" width="160px" align="center" />
      <el-table-column v-if="actionWidth !== '0'" label="操作" :width="actionWidth" align="center" fixed="right">
        <template #default="scope">
          <el-button
            :icon="SetUp"
            type="primary"
            link
            @click.stop="openChildren(scope.row, 'menu')"
          >
            功能管理
          </el-button>
          <el-button
            :icon="TrophyBase"
            type="primary"
            link
            @click.stop="openChildren(scope.row, 'function')"
          >
            函数管理
          </el-button>
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
