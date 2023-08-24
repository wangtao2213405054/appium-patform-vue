<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue"
import { MagicStick, FullScreen, Search } from "@element-plus/icons-vue"
import SvgIcon from "@/components/SvgIcon/index.vue" // Svg Component
import { ElDialog } from "element-plus"

const input = ref("")
const dialogVisible = ref(false)
const expression = ref("") // 当前绑定的表达式
const startExpression = ref("") // 表达式开始段
const endExpression = ref("") // 表达式结束段
const currentParameter = ref([]) // 当前入参
const currentMenu = ref("") // 当前所选函数菜单
const showfunctionNumber = ref(1) // 要展示的函数列表
const functionList = ref([]) // 当前选中的函数列表
const functionSelectList = ref([]) // 当前已选函数
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
          { id: 1, placeholder: "测试一下", value: null, type: "number", label: "最小长度" },
          { id: 2, placeholder: "测试一下", value: null, type: "number", label: "最大长度" }
        ]
      },
      { id: 4, keyword: "date", name: "日期" }
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
      { id: 5, keyword: "name", name: "姓名" },
      { id: 6, keyword: "date", name: "日期" }
    ]
  }
])
const clickButton = () => {
  dialogVisible.value = true
}
const clickReturn = (
  start: string,
  end: string,
  keyword: string,
  childrenKeyword: string,
  id: number,
  childrenId: number
) => {
  startExpression.value = start
  endExpression.value = end
  expression.value = `${keyword} '${childrenKeyword}'`
  const foundRoot = root.value.find((item) => item.id === id)
  functionSelectList.value = []
  if (foundRoot) {
    const foundChild = foundRoot.children.find((child) => child.id === childrenId)
    functionList.value = foundRoot.functionList || []
    if (foundChild) {
      currentParameter.value = foundChild.children
    }
  }
}

const functionClick = (keyword) => {
  currentMenu.value = keyword
  functionSelectList.value.push(keyword)
  showfunctionNumber.value += 1
  nextTick(() => {
    const container = document.getElementById("testTow") as HTMLElement // 替换为你的容器的 ID
    const containerWidth = container.scrollWidth
    console.log(containerWidth, "2222")
    container.scrollTo({
      left: containerWidth,
      top: 0,
      behavior: "smooth"
    })
  })
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
      <el-scrollbar>
        <div class="content" id="testTow">
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
                      clickReturn(
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
          <div v-for="func in showfunctionNumber" :key="func" class="element">
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
                    :class="{ 'is-active': item.keyword === currentMenu }"
                    @click="functionClick(item.keyword)"
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
  overflow: auto;
  white-space: nowrap;
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
