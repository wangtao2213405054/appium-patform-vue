<script setup lang="ts">
import { ref, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElRadio,
  ElButton,
  ElTag,
  ElEmpty,
  ElPagination,
  ElDialog,
  ElMessageBox,
  ElMessage,
  FormRules,
  FormInstance
} from "element-plus"
import { apiDeleteProjectInfo, apiEditProjectInfo, apiGetProjectList } from "@/api/business"
import { Edit, Delete, Search, Refresh, Plus } from "@element-plus/icons-vue"
import { EditProjectRequestData, GetProjectRequestData, ProjectInfoResponseData } from "@/api/business/types/project"
import upload from "../../components/Upload/index.vue"

const avatarPrefix = "?imageView2/1/w/80/h/80"

const projectList = ref<ProjectInfoResponseData[]>([])
const title = ref<string>("创建项目")
const projectLoading = ref<boolean>(true)
const visibleBool = ref<boolean>(false)
const requestForm: GetProjectRequestData = reactive({
  name: "",
  page: 1,
  pageSize: 4,
  total: 0
})

const addForm: EditProjectRequestData = reactive({
  id: 0,
  name: "",
  describe: "",
  avatar: "",
  mold: "appium"
})
const addFormRef = ref<FormInstance | null>(null)
const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入正确的项目名称", trigger: "blur" },
    { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
  ],
  describe: [
    { required: true, message: "请输入正确的项目背景", trigger: "blur" },
    { min: 5, max: 512, message: "长度在 5 到 512 个字符", trigger: "blur" }
  ]
}

const router = useRouter()

onMounted(async () => {
  await getProjectListData()
})

// 获取项目列表
async function getProjectListData() {
  projectLoading.value = true
  const { items, total } = (await apiGetProjectList(requestForm)).data
  projectList.value = items
  requestForm.total = total
  projectLoading.value = false
}

// 查询项目方法
function queryProjectListData() {
  requestForm.page = 1
  getProjectListData()
}

// 点击项目后跳转的钩子
function enterProjectPage(id: number, mold: string) {
  localStorage.setItem("projectId", String(id))
  localStorage.setItem("mold", mold)
  router.push("/dashboard")
}

// 页码发生变化的钩子
function handleCurrentChange(newPage: number) {
  requestForm.page = newPage
  getProjectListData()
  // 返回顶部
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  })
}

function closeDialog() {
  visibleBool.value = false
  addForm.id = 0
  addForm.name = ""
  addForm.describe = ""
  addForm.avatar = ""
  addForm.mold = "appium"
  addFormRef.value?.clearValidate()
  title.value = "创建项目"
}

// 修改项目信息
function editProjectInfoData() {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditProjectInfo(addForm)
      visibleBool.value = false
      await getProjectListData()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

// 重置请求信息
function refreshRequest() {
  requestForm.name = ""
  requestForm.page = 1
  requestForm.pageSize = 20
  getProjectListData()
}

// 更新按钮
function updateButton(value: any) {
  addForm.id = value.id
  addForm.name = value.name
  addForm.describe = value.describe
  addForm.avatar = value.avatar
  addForm.mold = value.mold
  title.value = "编辑项目"
  visibleBool.value = true
}

// 删除项目的钩子
async function deleteProjectData(id: number) {
  const clickConfirmResult = await ElMessageBox.confirm("此操作将永久删除该项目, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false
  }).catch((err) => err)

  if (clickConfirmResult !== "confirm") {
    return ElMessage.info("取消删除")
  }

  await apiDeleteProjectInfo({ id })
  await getProjectListData()
}
</script>

<template>
  <el-card v-loading="projectLoading" class="user-activity">
    <el-dialog :title="title" :model-value="visibleBool" width="600px" @close="closeDialog">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" hide-required-asterisk label-width="80px">
        <el-form-item label="项目头像">
          <upload v-model="addForm.avatar" />
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入项目名称" clearable />
        </el-form-item>
        <el-form-item label="项目描述" prop="describe">
          <el-input v-model="addForm.describe" placeholder="请输入项目描述" type="textarea" :rows="4" clearable />
        </el-form-item>
        <el-form-item label="项目类型">
          <div>
            <el-radio v-model="addForm.mold" style="height: 55px" label="appium" border>
              App 端
              <el-text tag="b" type="success">基于 Appium 框架</el-text>
            </el-radio>
            <el-radio v-model="addForm.mold" style="height: 55px" label="selenium" border>
              Web 端
              <el-text tag="b" type="warning">基于 Selenium 框架</el-text>
            </el-radio>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visibleBool = false">取 消</el-button>
          <el-button type="primary" @click="editProjectInfoData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-form :model="requestForm" inline>
      <el-form-item label="项目名称">
        <el-input
          v-model="requestForm.name"
          placeholder="输入项目名称进行过滤"
          clearable
          @keyup.enter="queryProjectListData"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="queryProjectListData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Refresh" @click="refreshRequest">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Plus" plain @click="visibleBool = true">新建项目</el-button>
      </el-form-item>
    </el-form>
    <div v-for="item in projectList" :key="item.id">
      <div class="post" @click="enterProjectPage(item.id, item.mold)">
        <div class="user-block">
          <img class="img-circle" alt="" :src="item.avatar + avatarPrefix" />
          <span class="username text-muted">{{ item.name }}</span>
          <el-tag v-if="item.mold === 'appium'" class="mold" type="success">移动端</el-tag>
          <el-tag v-else class="mold" type="warning">Web端</el-tag>
          <span class="description">{{ item.label }}</span>
        </div>
        <p>{{ item.describe }}</p>
        <ul class="list-inline">
          <li>
            <el-button :icon="Edit" type="primary" link @click.stop="updateButton(item)">编辑</el-button>
          </li>
          <li>
            <el-button type="danger" :icon="Delete" link @click.stop="deleteProjectData(item.id)">删除</el-button>
          </li>
        </ul>
      </div>
    </div>
    <el-empty v-if="!projectList.length" description="暂无项目, 快来创建一个吧" />
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
.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: var(--el-text-color-primary);
    }

    .mold {
      float: right;
      margin-right: 10px;
      align-items: center;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: var(--el-text-color-secondary);

    .image {
      width: 100%;
      height: 100%;
    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;
    text-align: right;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {
      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
:deep(.disabled) {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
