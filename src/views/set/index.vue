<script setup lang="ts">
import { computed, reactive, ref } from "vue"
import {
  CascaderProps,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElPagination,
  FormInstance,
  CascaderNode
} from "element-plus"
import { EditSetRequestData, GetSetRequestData, SetInfoResponseData } from "@/api/set/types/set"
import { apiDeleteSetInfo, apiEditSetInfo, apiGetSetList } from "@/api/set"
import { Edit, Delete, Plus, Search, Refresh } from "@element-plus/icons-vue"
import { apiGetCaseList, apiGetFolderList } from "@/api/business"
import { checkPermission } from "@/utils/permission"

const projectId = JSON.parse(localStorage.getItem("projectId"))
const addForm: EditSetRequestData = reactive({
  name: "",
  projectId: projectId,
  special: false,
  desc: "",
  customSet: []
})
const requestForm: GetSetRequestData = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  projectId: projectId,
  name: "",
  special: false
})
const title = ref<string>("")
const dialogVisible = ref<boolean>(false)
const setList = ref<SetInfoResponseData[]>([])
const specialList = reactive([
  { key: false, label: "普通集合", tag: null },
  { key: true, label: "特殊集合", tag: "success" }
])
let options = []
type Resolve = (data: any) => void
const props: CascaderProps = {
  lazy: true,
  async lazyLoad(node: CascaderNode, resolve: Resolve) {
    await lazyLoads(node, resolve)
  },
  value: "id",
  label: "name",
  multiple: true
}

// 查询集合信息
const querySetList = () => {
  requestForm.page = 1
  getSetList()
}

// 重置请求信息
const refreshRequest = () => {
  requestForm.name = ""
  requestForm.special = undefined
  querySetList()
}

// 添加版本信息
const addSet = () => {
  title.value = "添加集合"
  dialogVisible.value = true
}

const addFormRef = ref<FormInstance | null>(null)
// 关闭弹窗的事件
const closeDialog = () => {
  addForm.name = ""
  addForm.id = null
  addForm.decs = ""
  addForm.special = false
  addForm.customSet = []
  addFormRef.value?.clearValidate()
}

// 提交表单
const submitForm = () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditSetInfo(addForm)
      dialogVisible.value = false
      await getSetList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

// 获取集合列表
const getSetList = async () => {
  const { items, total } = (await apiGetSetList(requestForm)).data
  setList.value = items
  requestForm.total = total
}

// 页码改变
const handleCurrentChange = (newPage: number) => {
  requestForm.page = newPage
  getSetList()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

// 编辑集合
const updateVersion = async (row: SetInfoResponseData) => {
  title.value = "编辑集合"
  addForm.id = row.id
  addForm.special = row.special
  addForm.customSet = row.customSet
  addForm.desc = row.desc
  addForm.name = row.name
  row.loading = true
  // 根据已绑定的信息对用例树进行加载
  for (let i = 0; i < row.customSet.length; i++) {
    const node = options.find((item) => item.id === row.customSet[i][0])
    if (!node.children) {
      // this.$set(node, "children", module)
      node.children = await getModuleList(row.customSet[i][0], 1)
    }
    const children = node.children.find((item) => item.id === row.customSet[i][1])
    if (!children.children) {
      // this.$set(children, "children", _case)
      children.children = await getCaseList(row.customSet[i][1])
    }
  }
  row.loading = false
  // this.$set(row, "loading", false)
  dialogVisible.value = true
}

// 删除集合
const deleteSetInfo = async (id: number) => {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该集合, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).catch((err) => err)
  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }
  await apiDeleteSetInfo({ id })
  await getSetList()
}

// 选择器加载方法
const lazyLoads = async (node: CascaderNode, resolve: Resolve) => {
  const { level, data }: { level: number; data: any } = node
  if (level === 0 && !options.length) {
    options = await getModuleList(data ? data.id : level, level)
  } else if (level === 1 && !data.leaf && !node.children) {
    const node = options.find((item) => item.id === data.id)
    node.children = await getModuleList(data ? data.id : level, level)
  } else if (level === 2 && !data.leaf && !node.children) {
    data.children = await getCaseList(data.id)
  }
  resolve([])
}

// 获取模块列表
const getModuleList = async (id: number, level: number) => {
  const module = (await apiGetFolderList({ projectId, id, special: false })).data
  module.forEach((item) => {
    item.disabled = level === 0 ? item.leaf : item.exist
    item.leaf = level === 0 ? item.leaf : item.exist
  })
  return module
}

// 获取用例列表
const getCaseList = async (id: number) => {
  const request = {
    page: 1,
    pageSize: 9999,
    projectId,
    special: false,
    folderId: [1, id]
  }
  const { items } = (await apiGetCaseList(request)).data
  items.forEach((item) => {
    item.leaf = true
    item.lazy = false
  })
  return items
}

const deletePermission = computed(() => {
  return checkPermission(["/business/set/delete"])
})
const editPermission = computed(() => {
  return checkPermission(["/business/set/edit"])
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
      <el-form ref="addFormRef" :model="addForm" label-width="100px">
        <el-form-item
          label="集合名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入集合名称', trigger: 'blur' },
            { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="addForm.name" placeholder="请输入集合名称" clearable />
        </el-form-item>
        <el-form-item label="集合类型">
          <el-switch
            v-model="addForm.special"
            active-text="特殊集合"
            inactive-text="普通集合"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item v-if="addForm.special" label="测试用例">
          <el-cascader v-model="addForm.customSet" :options="options" :props="props" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="集合描述" prop="desc">
          <el-input v-model="addForm.desc" placeholder="请输入集合描述" clearable type="textarea" :rows="3" />
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
        <el-input v-model="requestForm.name" placeholder="输入集合名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="requestForm.special" placeholder="选择集合类型查询" clearable>
          <el-option v-for="item in specialList" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="querySetList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="editPermission" :icon="Plus" type="success" @click="addSet">添 加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="setList" stripe style="width: 100%">
      <el-table-column type="index" label="编号" width="60" align="center" />
      <el-table-column prop="name" label="集合名称" width="150px" />
      <el-table-column prop="name" label="集合类型" width="150px" align="center">
        <template #default="scope">
          <div v-for="item in specialList" :key="item.label">
            <el-tag v-if="item.key === scope.row.special" :type="item.tag" disable-transitions effect="dark">{{
              item.label
            }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="集合描述" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="160px" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="160px" align="center" />
      <el-table-column v-if="actionWidth !== '0'" label="操作" :width="actionWidth" align="center">
        <template #default="scope">
          <el-button
            v-if="editPermission"
            v-model="scope.row.loading"
            :loading="scope.row.loading"
            :icon="Edit"
            type="primary"
            link
            @click.stop="updateVersion(scope.row)"
            >编辑</el-button
          >
          <el-button v-if="deletePermission" :icon="Delete" type="danger" link @click.stop="deleteSetInfo(scope.row.id)"
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
