<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue"
import { ElTree, ElButton, ElDialog, ElForm, ElFormItem, ElInput, FormInstance, FormRules } from "element-plus"
import { Plus, WarningFilled } from "@element-plus/icons-vue"
import {
  apiDeleteAccountClassificationInfo,
  apiGetAccountClassificationList,
  apiEditAccountClassificationInfo
} from "@/api/account"
import {
  AccountClassificationInfoResponseData,
  EditAccountClassificationRequestData
} from "@/api/account/types/classification"
import account from "./account.vue"

const classificationTree = ref<AccountClassificationInfoResponseData[]>([])
const filterText = ref<string>("")
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const labelName = ref<string>("")
const addFormRef = ref<FormInstance | null>(null)
const queryId = ref<number>(0)
const treeRef = ref<InstanceType<typeof ElTree>>()

const addForm: EditAccountClassificationRequestData = reactive({
  nodeId: null,
  name: "",
  id: null
})
const addFormRules: FormRules = {
  name: [
    { required: true, message: "请输入正确的组织信息", trigger: "blur" },
    { min: 2, max: 7, message: "长度在 2 到 7 个字符", trigger: "blur" }
  ]
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

onMounted(async () => {
  await getClassificationList()
})

interface Tree {
  [key: string]: any
}

// 过滤树节点
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.indexOf(value) !== -1
}

// 删除树节点
const remove = async (id: number) => {
  await apiDeleteAccountClassificationInfo({ id })
  await getClassificationList()
}

// 获取tree
const getClassificationList = async () => {
  classificationTree.value = (await apiGetAccountClassificationList()).data
}

// 新增子节点
const newClassification = (nodeId: number | null) => {
  title.value = "新增组织"
  labelName.value = "组织名称"
  dialogVisible.value = true
  addForm.nodeId = nodeId
}

// 关闭添加节点的钩子
const closeClassification = () => {
  addForm.nodeId = null
  addForm.name = ""
  addForm.id = null
  addFormRef.value?.clearValidate()
}

// 新增节点的钩子
const editClassificationData = async () => {
  addFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      await apiEditAccountClassificationInfo(addForm)
      dialogVisible.value = false
      await getClassificationList()
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

// 查询tree节点的用户列表
const queryNodeUser = (data: Tree) => {
  queryId.value = data.id
}
</script>

<template>
  <el-card>
    <el-row :gutter="20">
      <el-dialog :title="title" v-model="dialogVisible" width="30%" @close="closeClassification">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="68px" hide-required-asterisk>
          <el-form-item :label="labelName" prop="name">
            <el-input v-model="addForm.name" clearable :placeholder="'请输入' + labelName" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editClassificationData">确 定</el-button>
          </span>
        </template>
      </el-dialog>
      <el-col :span="7" :xs="24">
        <div class="title">
          <el-input v-model="filterText" size="small" placeholder="输入关键字进行过滤" clearable />
          &nbsp;
          <el-button type="success" plain size="small" :icon="Plus" @click="newClassification(null)">新增</el-button>
        </div>
        <el-tree
          ref="treeRef"
          :data="classificationTree"
          node-key="id"
          default-expand-all
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          @node-click="queryNodeUser"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span style="font-size: 10px">{{ data.name }}</span>
              <span>
                <el-button
                  v-if="node.level < 2"
                  size="small"
                  type="primary"
                  link
                  @click.stop="newClassification(data.id)"
                >
                  添加
                </el-button>
                <el-popconfirm
                  width="200px"
                  confirm-button-text="好的"
                  cancel-button-text="不用了"
                  :icon="WarningFilled"
                  icon-color="#f56c6c"
                  title="确定要删除这个组织吗？"
                  @confirm="remove(data.id)"
                >
                  <template #reference>
                    <el-button class="danger-button" type="danger" size="small" link @click.stop>删除</el-button>
                  </template>
                </el-popconfirm>
              </span>
            </span>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="17" :xs="24">
        <account :key="queryId" :query-id="queryId" :classification-tree="classificationTree" />
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.title {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.danger-button {
  margin-left: 0;
}
</style>
