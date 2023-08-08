<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue"
import { Codemirror } from "vue-codemirror"
import { json } from "@codemirror/lang-json"
import { useTheme } from "@/hooks/useTheme"
import { ElMessage } from "element-plus"
import { CopyDocument } from "@element-plus/icons-vue"
import clip from "@/utils/clipboard"
import { BlueDark } from "./theme/dark-blue"
import { oneDark } from "./theme/dark"
import { Normal } from "./theme/normal"

const { activeThemeName } = useTheme()

const themeContent = reactive({
  normal: Normal,
  dark: oneDark,
  "dark-blue": BlueDark
})

const extensions = [json(), oneDark]
watch(activeThemeName, (theme) => {
  currentCount.value++
  console.log(theme, 222)
  extensions[1] = themeContent[theme] || oneDark
})

onMounted(() => {
  currentCount.value++
  extensions[1] = themeContent[activeThemeName.value] || oneDark
})

const code = ref(`{
  "code": 1,
  "data": {
    "items": [
      {
        "body": "{\\"test\\": 123}",
        "createTime": "2023-04-09 17:10:07",
        "id": 1,
        "name": "测试接口奥",
        "path": "/api/v1/client/user/login",
        "project_id": 1,
        "updateTime": "2023-04-09 17:10:07"
      },
      {
        "body": "{\\"test\\": 123}",
        "createTime": "2023-04-09 17:10:07",
        "id": 1,
        "name": "测试接口奥",
        "path": "/api/v1/client/user/login",
        "project_id": 1,
        "updateTime": "2023-04-09 17:10:07"
      },
      {
        "body": "{\\"test\\": 123}",
        "createTime": "2023-04-09 17:10:07",
        "id": 1,
        "name": "测试接口奥",
        "path": "/api/v1/client/user/login",
        "project_id": 1,
        "updateTime": "2023-04-09 17:10:07"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 20,
    "totalPage": 1
  },
  "message": "服务接口调用成功",
  "ts": 1680854145
}`)
const currentCount = ref(0)

const copyCode = (event: any) => {
  if (!code.value) {
    ElMessage.error("暂无可复制数据, 请添加数据后重试")
    return
  }
  clip(code.value, event)
}
</script>

<template>
  <div style="padding: 20px">
    <div class="box">
      <div class="title">
        <span class="text">Json</span>
        <el-button class="copy" type="info" size="small" link :icon="CopyDocument" @click="copyCode($event)"
          >复制</el-button
        >
      </div>
      <codemirror
        :key="currentCount"
        v-model="code"
        :style="{ height: '500px' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  border: 1px solid var(--codemirror-border-color);
  border-radius: 10px;
  overflow: hidden;

  .title {
    background-color: var(--codemirror-title-background-color);
    border-bottom: 1px solid var(--codemirror-border-color);
    height: 30px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    place-items: center;

    .text {
      font-size: 10px;
      color: var(--el-color-info);
      padding-left: 15px;
    }

    .copy {
      padding-right: 15px;
    }
  }
}
</style>
