<script lang="ts" setup>
import { ref, watch, inject, shallowRef } from "vue"
import { MagicStick, FullScreen } from "@element-plus/icons-vue"
import { ElDialog, ElScrollbar } from "element-plus"
import Variable from "./components/variable.vue"
import { Socket } from "socket.io-client"

interface Props {
  modelValue: string | number
  placeholder?: string
}
const props = defineProps<Props>()

const input = shallowRef<string>(props.modelValue)
const magnifyInput = ref<string>("") // 窗口放大后输入框绑定的信息
const dialogVisible = ref<boolean>(false) // 平常模式下点击魔法变量
const magnifyVisible = ref<boolean>(false)

const socket: Socket = inject("socket") as Socket
const loading = ref<boolean>(false)
const profile = ref<string>("")
let timer: number | undefined = undefined
let timeout: number | undefined = undefined

watch(magnifyInput, (data: string) => {
  if (/{{.*?}}/.test(data)) {
    loading.value = true
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      socket.emit("transitionStringData", data)
      /** 设置一个超时时间, 如果时间超时则取消 Loading */
      timeout = window.setTimeout(() => {
        if (loading.value) {
          loading.value = false
          profile.value = "加载数据失败..."
        }
      }, 5000)
    }, 500)
  } else {
    profile.value = data
  }
})

socket.on("previewString", (data: string) => {
  profile.value = data
  loading.value = false
  window.clearTimeout(timeout)
})

/** 点击魔法变量时的钩子, 用于打开魔法变量的弹窗 */
const clickButton = () => {
  dialogVisible.value = true
}

/** 点击放大时的钩子 */
const openMagnifyDialog = () => {
  magnifyInput.value = input.value
}

/** 放大弹窗中点击确认的钩子 */
const notarizeMagnifyData = () => {
  magnifyVisible.value = false
  input.value = magnifyInput.value
}

/** 动态变量的回调函数 */
const expressionCallback = (expression: string) => {
  if (magnifyVisible.value) {
    magnifyInput.value += expression
  } else {
    input.value += expression
  }
}
/** 关闭弹窗 */
const closeMagnifyDialog = () => {
  magnifyInput.value = ""
}
const emit = defineEmits(["update:modelValue"])

/** 当数据发生变化时通知父组件 */
const changeValue = (value) => {
  emit("update:modelValue", value)
}
</script>

<template>
  <div style="margin: 10px">
    <variable v-model="dialogVisible" @expression="expressionCallback" />
    <el-dialog
      v-model="magnifyVisible"
      width="50%"
      title="编辑数据"
      @open="openMagnifyDialog"
      @close="closeMagnifyDialog"
    >
      <el-input
        v-model="magnifyInput"
        type="textarea"
        :placeholder="props.placeholder"
        :autosize="{ minRows: 10, maxRows: 10 }"
      />
      <div class="profile">
        <div class="header-text">预览</div>
        <el-scrollbar>
          <div class="flex-grow-element">
            <span v-if="!loading">{{ profile }}</span>
            <span v-else class="loading-hint">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>正在加载...</span>
            </span>
          </div>
        </el-scrollbar>
      </div>
      <template #footer>
        <div class="flex-container">
          <el-button class="button" type="warning" :icon="MagicStick" @click="clickButton">动态变量</el-button>
          <span>
            <el-button @click="magnifyVisible = false">取 消</el-button>
            <el-button type="primary" @click="notarizeMagnifyData">确 定</el-button>
          </span>
        </div>
      </template>
    </el-dialog>
    <el-input v-model="input" style="width: 150px" :placeholder="props.placeholder" @input="changeValue" clearable>
      <template #suffix>
        <el-button class="input-button" link :icon="MagicStick" @click="clickButton" />
        <el-button class="input-button" link :icon="FullScreen" @click="magnifyVisible = true" />
      </template>
    </el-input>
  </div>
</template>

<style scoped lang="scss">
.flex-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  .button {
    margin-right: auto;
  }
}
.input-button {
  margin-left: 0;
}
.profile {
  margin-top: 10px;
  padding: 20px;
  border-bottom: 1px solid var(--el-menu-border-color);
  display: flex;
  align-items: center;
  .header-text {
    min-width: 80px;
    font-weight: bold;
    font-size: 16px;
  }
  .flex-grow-element {
    flex-grow: 1;
    max-height: 80px;
  }
}
.loading-hint {
  display: flex;
  place-items: center;
  font-size: 15px;
  .el-icon {
    margin-right: 5px;
  }
}
</style>
