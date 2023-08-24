<script lang="ts" setup>
import { ref, computed, nextTick } from "vue"
import { MagicStick, FullScreen } from "@element-plus/icons-vue"
import SvgIcon from "@/components/SvgIcon/index.vue" // Svg Component
import { ElDialog, ElScrollbar } from "element-plus"

interface FunctionListData {
  keyword: string
  name: string
}

interface ParamsData {
  id: number
  placeholder: string
  value?: string | null
  type: string
  label: string
}

const input = ref("")
const dialogVisible = ref(false)
const expression = ref<string>("") // 当前绑定的表达式
const startExpression = ref<string>("") // 表达式开始段
const endExpression = ref<string>("") // 表达式结束段
const currentParameter = ref<ParamsData[]>([]) // 当前入参
const currentMenuList = ref<string[]>([]) // 当前所选函数菜单索引
const showFunctionNumber = ref<number>(1) // 要展示的函数列表数量默认为1
const functionList = ref<FunctionListData[]>([]) // 当前选中的函数列表
const functionSelectList = ref<string[]>([]) // 当前已选函数
/** 组装完成的表达式, 用于匹配动态赋值信息 */
const currentExpression = computed(() => {
  return `
  ${startExpression.value}
  ${expression.value}
  ${currentParameter.value ? currentParameter.value.map((field) => field.value && `,${field.value}`).join("") : ""}
  ${functionSelectList.value ? functionSelectList.value.map((field) => field && `|${field}`).join("") : ""}
  ${endExpression.value}`
})
const root = ref([
  {
    id: 1,
    name: "全局变量",
    startExpression: "{{",
    endExpression: "}}",
    keyword: "global",
    children: [
      {
        id: 3,
        keyword: "name",
        name: "姓名",
        children: [
          { id: 1, placeholder: "测试一下", type: "number", label: "最小长度" },
          { id: 2, placeholder: "测试一下", type: "number", label: "最大长度" }
        ]
      },
      { id: 4, keyword: "date", name: "日期", children: [] }
    ],
    functionList: [
      {
        keyword: "length",
        name: "数据长度"
      },
      {
        keyword: "lower",
        name: "将所有字母变为小写"
      }
    ]
  },
  {
    id: 2,
    name: "动态变量",
    startExpression: "{%",
    endExpression: "%}",
    keyword: "mock",
    children: [
      { id: 5, keyword: "date", name: "日期", children: [] },
      { id: 6, keyword: "date", name: "日期", children: [] }
    ]
  }
])
const clickButton = () => {
  dialogVisible.value = true
}

/** 点击子菜单的回调事件 */
const clickSubmenu = (
  start: string,
  end: string,
  keyword: string,
  childrenKeyword: string,
  id: number,
  childrenId: number
) => {
  /** 将当前菜单的前后包裹表达式及子菜单的表达式赋值 */
  startExpression.value = start
  endExpression.value = end
  expression.value = `${keyword} '${childrenKeyword}'`

  /** 清空菜单索引和已选择的函数 */
  functionSelectList.value = []
  currentMenuList.value = []
  currentParameter.value = []

  /** 寻找当前子菜单的入参输入及菜单的函数数据 */
  const foundRoot = root.value.find((item) => item.id === id)
  if (foundRoot) {
    const foundChild = foundRoot.children.find((child) => child.id === childrenId)
    functionList.value = foundRoot.functionList || []
    if (foundChild) {
      currentParameter.value = JSON.parse(JSON.stringify(foundChild.children))
    }
  }
}

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

/** 点击绑定函数的事件 */
const functionClick = (index: number, keyword: string) => {
  /** 如果再次点击相同的函数, 则销毁其本身和其身后的所有函数绑定 */
  if (functionSelectList.value[index + 1] == keyword) {
    currentMenuList.value.splice(index, functionSelectList.value.length - index)
    functionSelectList.value.splice(index + 1, functionSelectList.value.length - (index + 1))
    showFunctionNumber.value = index
    return
  }
  currentMenuList.value[index] = keyword
  functionSelectList.value[index + 1] = keyword

  /** 当点击为最后一个函数列表时，动态添加一个 */
  if (index === showFunctionNumber.value) {
    showFunctionNumber.value += 1

    /** 数据渲染完成后将移动到最后一个函数列表 */
    nextTick(() => {
      const container = document.getElementById("dialogWidth") as HTMLElement // dialog 中容器的宽度
      const containerWidth = container.scrollWidth
      scrollbarRef.value!.setScrollLeft(containerWidth)
    })
  }
}
</script>

<template>
  <div style="margin: 10px">
    <el-dialog v-model="dialogVisible" width="70%">
      <template #header>
        <div class="dialog-header">
          <el-icon><MagicStick /></el-icon>
          <span class="text">动态变量</span>
        </div>
      </template>
      <el-scrollbar ref="scrollbarRef">
        <div class="content" id="dialogWidth">
          <div class="element-menu">
            <el-scrollbar wrap-class="scrollbar-wrapper">
              <el-menu style="height: 400px" unique-opened>
                <el-sub-menu v-for="item in root" :key="item.id" :index="item.id.toString()">
                  <template #title>
                    <span class="code">{{ item.name }}</span>
                    <!--  <div class="container">-->
                    <!--   <span class="code">{{ item.name }}</span>-->
                    <!--   <el-input class="input" v-model="input3" size="small" @click.stop>-->
                    <!--    <template #suffix>-->
                    <!--     <el-icon :size="14"><Search /></el-icon>-->
                    <!--    </template>-->
                    <!--   </el-input>-->
                    <!--  </div>-->
                  </template>
                  <el-menu-item
                    v-for="child in item.children"
                    :key="child.id"
                    :index="child.id.toString()"
                    @click="
                      clickSubmenu(
                        item.startExpression,
                        item.endExpression,
                        item.keyword,
                        child.keyword,
                        item.id,
                        child.id
                      )
                    "
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
                <el-form class="content-area">
                  <el-form-item v-for="item in currentParameter" :key="item.id" :label="item.label">
                    <el-input
                      v-if="item.type === 'number'"
                      v-model.number="item.value"
                      :placeholder="item.placeholder"
                    />
                    <el-input v-else v-model="item.value" :placeholder="item.placeholder" />
                  </el-form-item>
                </el-form>
              </div>
            </el-scrollbar>
          </div>
          <div v-for="index in showFunctionNumber" v-show="functionList.length" :key="index" class="element">
            <el-scrollbar>
              <div class="section">
                <div class="dialog-header">
                  <svg-icon name="function" />
                  <span class="text">函数</span>
                </div>
                <div class="content-area">
                  <div
                    v-for="item in functionList"
                    :key="item.keyword"
                    class="el-menu-item"
                    :class="{ 'is-active': item.keyword === currentMenuList[index] }"
                    @click="functionClick(index, item.keyword)"
                  >
                    <div class="container">
                      <div class="code">{{ item.keyword }}</div>
                      <div>{{ item.name }}</div>
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
        <div class="flex-grow-element">
          测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊测试啊试啊
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary">插 入</el-button>
        </span>
      </template>
    </el-dialog>
    <el-input v-model="input" class="w-50 m-2" style="width: 150px" placeholder="Pick a date">
      <template #suffix>
        <el-button class="input-button" link :icon="MagicStick" @click="clickButton" />
        <el-button class="input-button" link :icon="FullScreen" @click="clickButton" />
      </template>
    </el-input>
  </div>
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
    min-width: 24%;
  }
  .element {
    flex: 0;
    min-width: 38%;
    border-right: 1px solid var(--el-menu-border-color);
  }
}
.input-button {
  margin-left: 0;
}
:deep(.el-input__wrapper) {
  padding: 1px 3px 1px 11px;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  .code {
    flex: 1;
  }
  .input {
    height: auto;
    width: 100px;
  }
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
    width: 90px;
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
    width: 90px;
    font-weight: bold;
    font-size: 16px;
  }
  .flex-grow-element {
    flex-grow: 1;
  }
}
.content-area {
  margin-top: 10px;
  padding: 5px;
}
</style>
