<script setup lang="ts">
import { ref, computed, onMounted, watch, inject, onBeforeUnmount, shallowRef } from "vue"
import { ElDialog, ElScrollbar } from "element-plus"
import { MagicStick, Search } from "@element-plus/icons-vue"
import SvgIcon from "@/components/SvgIcon/index.vue"
import { Socket } from "socket.io-client"
import { useMockStore } from "@/store/modules/mock"
import { DynamicInfoResponseData } from "@/api/base/types/dynamic"
import { MagicVariableResponseData } from "@/api/base/types/magic"

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const faker = useMockStore()

const dialogVisible = shallowRef<string>(props.modelValue)
const expression = ref<string>("") // 当前绑定的表达式
const currentParameter = ref<DynamicInfoResponseData[]>([]) // 当前入参
const currentMenuList = ref<string[]>([]) // 当前所选函数菜单索引
const showFunction = ref<MagicVariableResponseData[][]>([]) // 要展示的函数列表数量默认为1
const functionList = ref<MagicVariableResponseData[]>([]) // 当前选中的函数列表
const functionSelectList = ref<MagicVariableResponseData[]>([]) // 当前已选函数
const functionSelectParams = ref<MagicVariableResponseData[]>([])
const profile = ref<string>("") // 预览数据
/** 组装完成的表达式, 用于匹配动态赋值信息 */
const currentExpression: string = computed(() => {
  return `{{${expression.value}${
    currentParameter.value
      ? currentParameter.value
          .map(
            (field) =>
              field.value && `,${field.expression}:${/^-?\d+$/.test(field.value) ? field.value : `'${field.value}'`}`
          )
          .join("")
      : ""
  }${
    functionSelectList.value
      ? functionSelectList.value
          .map((field) => {
            let functionExpression = ""
            if (field.params && field.params.length) {
              field.params.forEach((item) => {
                if (item.value) {
                  functionExpression += `,${item.expression}:${
                    /^-?\d+$/.test(item.value) ? item.value : `'${item.value}'`
                  }`
                }
              })
            }
            return field.keyword && `|${field.keyword}${functionExpression}`
          })
          .join("")
      : ""
  }}}`
})

/** 点击子菜单的回调事件 */
const clickSubmenu = (keyword: string, childrenKeyword: string, id: number, childrenId: number) => {
  /** 将当前菜单的前后包裹表达式及子菜单的表达式赋值 */
  expression.value = `${keyword} '${childrenKeyword}'`

  /** 清空菜单索引和已选择的函数 */
  functionSelectList.value = []
  currentMenuList.value = []
  currentParameter.value = []
  showFunction.value = []

  /** 寻找当前子菜单的入参输入及菜单的函数数据 */
  const foundRoot = faker.mockList.find((item) => item.id === id)

  if (foundRoot) {
    if (foundRoot.functionList) {
      functionSelectParams.value = JSON.parse(JSON.stringify(foundRoot.functionList))
      showFunction.value = [JSON.parse(JSON.stringify(foundRoot.functionList))]
    }
    const foundChild = foundRoot.children.find((child) => child.id === childrenId)
    functionList.value = foundRoot.functionList || []
    if (foundChild && foundChild.params) {
      currentParameter.value = JSON.parse(JSON.stringify(foundChild.params))
    }
  }
}

/** 横向显示的滚动条, 用于自动滚动到指定的位置 */
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

/** 点击绑定函数的事件 */
const functionClick = (index: number, keyword: string, chanel = true) => {
  /** 如果再次点击相同的函数, 则销毁其本身和其身后的所有函数绑定 */
  if (chanel && functionSelectList.value[index + 1] && functionSelectList.value[index + 1].keyword == keyword) {
    currentMenuList.value.splice(index, functionSelectList.value.length - index)
    functionSelectList.value.splice(index + 1, functionSelectList.value.length - (index + 1))
    showFunction.value.splice(index, showFunction.value.length - index - 1)
    return
  }
  currentMenuList.value[index] = keyword
  const functionRoot = showFunction.value[index].find((item) => item.keyword === keyword)
  functionSelectList.value[index + 1] = { keyword, params: functionRoot.params }

  /** 当点击为最后一个函数列表时，动态添加一个 */
  if (index === showFunction.value.length - 1) {
    // showFunctionNumber.value += 1
    showFunction.value.push(JSON.parse(JSON.stringify(functionSelectParams.value)))

    const scrollableElement = document.getElementById("dialogWidth") as HTMLElement // dialog 中容器的宽度
    const functionElement = document.getElementById("functionSection") as HTMLElement
    const targetScrollLeft = scrollableElement.scrollWidth - functionElement.scrollWidth * 1.5

    /** 数据渲染完成后将移动到最后一个函数列表 */
    const step = 10 // 每次滚动的距离
    // 定义滚动的时间间隔（延迟）
    const delay = 20 // 每次滚动之间的延迟时间（以毫秒为单位）
    let currentScrollLeft = targetScrollLeft - functionElement.scrollWidth
    // 使用 setInterval 创建定时器
    const scrollInterval = setInterval(() => {
      // 计算下一步滚动后的位置
      if (currentScrollLeft < targetScrollLeft) {
        currentScrollLeft = Math.min(currentScrollLeft + step, targetScrollLeft)
      } else {
        currentScrollLeft = Math.max(currentScrollLeft - step, targetScrollLeft)
      }
      // 将计算后的位置应用于滚动条
      scrollbarRef.value!.setScrollLeft(currentScrollLeft)

      // 判断是否达到目标位置，如果是则清除定时器
      if (currentScrollLeft === targetScrollLeft) {
        clearInterval(scrollInterval)
      }
    }, delay)
  }
}

/** 从服务器获取数据 */
const socket: Socket = inject("socket") as Socket
let timer: number | undefined = undefined
const loading = ref<boolean>(false)
let timeout: number | undefined = undefined

const emit = defineEmits(["update:modelValue", "expression"])

/** 点击插入弹窗时将输入返回到 @expression 所绑定的函数中 */
const insertionExpression = () => {
  emit("expression", currentExpression.value)
  dialogVisible.value = false
}

onMounted(() => {
  /** 当组件打开时挂载 reverseMockData Socket钩子 */
  socket.on("reverseMockData", (data) => {
    profile.value = data
    loading.value = false
    window.clearTimeout(timeout)
  })
  /** 监听父组件数据变化 */
  watch(
    () => props.modelValue,
    (data: boolean) => {
      dialogVisible.value = data
    }
  )

  /** 组件中变量出现变化通知父组件 */
  watch(dialogVisible, (data: boolean) => {
    emit("update:modelValue", data)
  })

  /** 当表达式出现变化跟服务器获取最新的数据值, 当变化小于 500毫秒 则只发送最后一次 */
  watch(currentExpression, (data: string) => {
    window.clearTimeout(timer)
    loading.value = true
    timer = window.setTimeout(() => {
      socket.emit("getMockData", { expression: data })
      /** 设置一个超时时间, 如果时间超时则取消 Loading */
      timeout = window.setTimeout(() => {
        if (loading.value) {
          loading.value = false
          profile.value = "加载数据失败..."
        }
      }, 5000)
    }, 500)
  })
})

/** 当组件销毁时销毁 reverseMockData Socket 钩子 */
onBeforeUnmount(() => {
  socket.off("reverseMockData")
})

/** 用于数据菜单的数据过滤, 并展示对应的过滤信息 */
const filterInput = ref<string>("")
const filterMenuList = ref<MagicVariableResponseData[]>([])
watch(filterInput, (data: string) => {
  faker.mockList.forEach((item) => {
    if (item.show) {
      item.children = filterMenuList.value.filter(
        (item) => item.keyword.search(data) != -1 || item.name.search(data) != -1
      )
    }
  })
})
/** 打开菜单时进行赋值, 用来展示当前菜单的状态信息 */
const openMenu = (index) => {
  faker.mockList.forEach((item) => {
    item.show = item.id.toString() === index
    if (item.id.toString() === index) {
      filterMenuList.value = item.children
    }
  })
}
/** 收起菜单时进行赋值, 用来关闭当前菜单的状态信息 */
const closeMenu = (index) => {
  faker.mockList.forEach((item) => {
    if (item.id.toString() === index) {
      item.show = false
    }
  })
}
</script>

<template>
  <el-dialog v-model="dialogVisible" width="80%">
    <template #header>
      <div class="dialog-header">
        <el-icon><MagicStick /></el-icon>
        <span class="text">动态变量</span>
      </div>
    </template>
    <el-scrollbar ref="scrollbarRef" id="scrollbarRef">
      <div class="content" id="dialogWidth">
        <div class="element-menu">
          <el-scrollbar>
            <el-menu style="height: 400px" unique-opened @open="openMenu" @close="closeMenu">
              <el-sub-menu v-for="item in faker.mockList" :key="item.id" :index="item.id.toString()">
                <template #title>
                  <span v-if="!item.show" class="code">{{ item.name }}</span>
                  <div v-else v-show="item.show" class="container">
                    <span class="code">{{ item.name }}</span>
                    <el-input style="max-width: 90px" v-model="filterInput" size="small" @click.stop>
                      <template #suffix>
                        <el-icon style="margin-right: 0" size="small"><Search /></el-icon>
                      </template>
                    </el-input>
                  </div>
                </template>
                <el-menu-item
                  v-for="child in item.children"
                  :key="child.id"
                  :index="child.id.toString()"
                  @click="clickSubmenu(item.keyword, child.keyword, item.id, child.id)"
                >
                  <template #title>
                    <div class="container">
                      <div class="code">{{ child.keyword }}</div>
                      <div>{{ child.name }}</div>
                    </div>
                  </template>
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </div>
        <div v-if="currentParameter && currentParameter.length" class="element">
          <el-scrollbar>
            <div class="section">
              <div class="dialog-header">
                <svg-icon name="params" />
                <span class="text">入参</span>
              </div>
              <div class="content-area">
                <div v-for="item in currentParameter" :key="item.expression" class="container">
                  <span class="code">{{ item.name }}</span>
                  <el-input
                    v-if="item.element === 'input' && item.type === 'Integer'"
                    v-model.number="item.value"
                    :placeholder="item.placeholder"
                  />
                  <el-input
                    v-else-if="item.element === 'input' && item.type === 'String'"
                    v-model="item.value"
                    :placeholder="item.placeholder"
                  />
                  <el-select v-else v-model="item.value" :placeholder="item.placeholder">
                    <el-option
                      v-for="option in item.options"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div v-for="(functionItem, index) in showFunction" :key="index" class="element">
          <el-scrollbar>
            <div class="section" id="functionSection">
              <div class="dialog-header">
                <svg-icon name="function" />
                <span class="text">函数</span>
              </div>
              <div class="content-area">
                <div
                  v-for="item in functionItem"
                  :key="item.keyword"
                  class="el-menu-item"
                  :class="{ 'is-active': item.keyword === currentMenuList[index] }"
                  @click="functionClick(index, item.keyword)"
                >
                  <div v-if="item.params && item.params.length" class="container">
                    <div class="code">
                      <el-tooltip effect="dark" :content="item.desc" placement="top">
                        {{ item.name }}
                      </el-tooltip>
                    </div>
                    <div class="el-input">
                      <div v-for="element in item.params" :key="element.id">
                        <el-input
                          v-if="element.element === 'input' && element.type === 'Integer'"
                          :placeholder="element.placeholder"
                          v-model.number="element.value"
                          @click.stop
                          @focus="functionClick(index, item.keyword, false)"
                        />
                        <el-input
                          v-else-if="element.element === 'input' && element.type === 'String'"
                          :placeholder="element.placeholder"
                          v-model="element.value"
                          @click.stop
                          @focus="functionClick(index, item.keyword, false)"
                        />
                        <el-select v-else v-model="element.value" :placeholder="element.placeholder" @click.stop>
                          <el-option
                            v-for="option in element.options"
                            :key="option.value"
                            :label="option.label"
                            :value="option.value"
                          />
                        </el-select>
                      </div>
                    </div>
                  </div>
                  <div v-else class="container">
                    <div class="code">{{ item.keyword }}</div>
                    <div>
                      <el-tooltip effect="dark" :content="item.desc" placement="top">
                        {{ item.name }}
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </el-scrollbar>
    <div class="expression">
      <div class="header-text">表达式</div>
      <div class="flex-grow-element">{{ currentExpression }}</div>
    </div>
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
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertionExpression">插 入</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog-header {
  display: flex;
  align-items: center; /* 垂直居中 */
  font-size: 18px;
  font-weight: bold;
  .text {
    margin-left: 8px;
  }
  .svg-icon {
    font-size: 20px;
  }
}
.content {
  display: flex;
  .element-menu {
    min-width: 30%;
    border-right: 1px solid var(--el-menu-border-color);
  }
  .el-menu {
    border-right: none;
  }
  .element {
    flex: 0;
    min-width: 35%;
    border-right: 1px solid var(--el-menu-border-color);
  }
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  .code {
    flex: 1;
  }
  .el-input {
    display: flex;
    flex-wrap: wrap;
    width: 190px;
    margin-bottom: 3px;
    margin-top: 3px;
  }
  .el-select {
    width: 190px;
  }
}
.el-menu-item {
  height: auto;
}

.section {
  flex: 1;
  height: 400px;
  padding: 10px;
}
.expression {
  padding: 20px;
  border-top: 1px solid var(--el-menu-border-color);
  display: flex;
  align-items: center;
  .header-text {
    min-width: 80px;
    font-size: 16px;
    font-weight: bold;
  }
  .flex-grow-element {
    flex-grow: 1;
    color: var(--v3-tagsview-tag-active-border-color);
  }
}
.profile {
  padding: 20px;
  border-top: 1px solid var(--el-menu-border-color);
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
.content-area {
  margin-top: 10px;
  padding: 5px;
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
