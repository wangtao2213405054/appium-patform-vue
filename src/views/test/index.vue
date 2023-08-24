<script lang="ts" setup>
import { ref, computed } from "vue"
import { MagicStick, FullScreen, Search } from "@element-plus/icons-vue"
import SvgIcon from "@/components/SvgIcon/index.vue" // Svg Component
import { ElDialog } from "element-plus"

const input = ref("")
const dialogVisible = ref(false)
const expression = ref("")
const startExpression = ref("")
const endExpression = ref("")
const currentParameter = ref([]) // 当前入参
const currentExpression = computed(() => {
  return `
  ${startExpression.value}
  ${expression.value}
  ${currentParameter.value ? currentParameter.value.map(field => field.value && `,${field.value}`).join(""): ""}
  ${endExpression.value}`
})
const root = ref([
  {
    id: 1,
    name: "全局变量",
    startExpression: "{{",
    endExpression: "}}",
    keyword: "global",
    children: [{ id: 3, keyword: "name", name: "姓名", children: [
      { id: 1, placeholder: "测试一下", value: null, type: "number", label: "最小长度" },
      { id: 2, placeholder: "测试一下", value: null, type: "number", label: "最大长度" }
      ] }, { id: 4, keyword: "date", name: "日期" }]
  },
  {
    id: 2,
    name: "动态变量",
    startExpression: "{%",
    endExpression: "%}",
    keyword: "mock",
    children: [{ id: 5, keyword: "name", name: "姓名" }, { id: 6, keyword: "date", name: "日期" }]
  }
])
const clickButton = () => {
  dialogVisible.value = true
}
const clickReturn = (start: string, end: string, keyword: string, childrenKeyword: string, id: number, childrenId: number) => {
  startExpression.value = start
  endExpression.value = end
  expression.value = `${keyword} '${childrenKeyword}'`
  for (const index in root.value) {
    if (root.value[index].id == id) {
      for (const child in root.value[index].children) {
        if (root.value[index].children[child].id === childrenId) {
          currentParameter.value = root.value[index].children[child].children
        }
      }
    }
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
      <el-scrollbar>
        <div class="content">
          <div class="element-menu">
            <el-scrollbar wrap-class="scrollbar-wrapper">
              <el-menu style="height: 400px" unique-opened>
                <el-sub-menu
                  v-for="item in root"
                  :key="item.id"
                  :index="item.id.toString()"
                >
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
                    @click="clickReturn(item.startExpression, item.endExpression, item.keyword, child.keyword, item.id, child.id)"
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
                  <svg-icon name="params"></svg-icon>
                  <span class="text">入参</span>
                </div>
                <el-form class="content-area">
                  <el-form-item v-for="item in currentParameter" :key="item.id" :label="item.label">
                    <el-input v-if="item.type === 'number'" v-model.number="item.value" :placeholder="item.placeholder" />
                    <el-input v-else v-model="item.value" :placeholder="item.placeholder" />
                  </el-form-item>
                </el-form>
              </div>
            </el-scrollbar>
          </div>
          <div class="element">
            <el-scrollbar>
              <div class="section">
                <div class="dialog-header">
                  <svg-icon name="function"></svg-icon>
                  <span class="text">函数</span>
                </div>
                <div class="content-area">
                  <div v-for="item in 10" :key="item" class="el-menu-item">
                    <div class="container">
                      <div class="code">SHA1</div>
                      <div>SHA1加密</div>
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
    flex: 1;
    min-width: 24%;
  }
  .element {
    flex: 1;
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
  margin-top: 20px;
  padding: 5px;
}
</style>
