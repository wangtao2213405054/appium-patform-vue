<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
import { ElDialog } from "element-plus"
// 将 Element Plus 的语言设置为中文
import zhCn from "element-plus/es/locale/lang/zh-cn"

const { initTheme } = useTheme()
ElDialog.props.lockScroll.default = false  // 修复 dialog 打开时右侧出现抖动的问题
/** 初始化主题 */
initTheme()
</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <router-view />
  </ElConfigProvider>
</template>
