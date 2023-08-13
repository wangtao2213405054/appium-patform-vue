<script setup lang="ts">
import { onMounted, shallowRef, watch, computed } from "vue"
import { Codemirror } from "vue-codemirror"
import { json } from "@codemirror/lang-json"
import { python } from "@codemirror/lang-python"
import { useTheme } from "@/hooks/useTheme"
import { ElMessage } from "element-plus"
import { CopyDocument } from "@element-plus/icons-vue"
import clip from "@/utils/clipboard"
import { BlueDark } from "@/views/codemirror/theme/dark-blue"
import { oneDark } from "@/views/codemirror/theme/dark"
import { Normal } from "@/views/codemirror/theme/normal"

interface Props {
  modelValue?: string
  tabSize?: number
  autofocus?: boolean
  disabled?: boolean
  indentWithTab?: boolean
  placeholder?: string
  height?: string
  language?: string
  theme?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  tabSize: 2,
  autofocus: false,
  disabled: false,
  indentWithTab: true,
  placeholder: "",
  height: "300px",
  language: "python",
  theme: ""
})

const capitalizeFirstLetter = (value: string) => {
  if (value.length === 0) {
    return value
  }
  return value[0].toUpperCase() + value.slice(1)
}

const { activeThemeName } = useTheme()

const themeContent = {
  normal: Normal,
  dark: oneDark,
  "dark-blue": BlueDark
}

const language = {
  python: python(),
  json: json()
}

const extensions = computed(() => {
  return [language[props.language] || python(), themeContent[activeThemeName.value] || oneDark]
})
const code = shallowRef<string>(props.modelValue)
const emit = defineEmits(["update:modelValue"])

onMounted(() => {
  watch(
    () => props.modelValue,
    (data) => {
      code.value = data
    }
  )

  watch(code, (data) => {
    emit("update:modelValue", data)
  })
})

const copyCode = (event: any) => {
  if (!code.value) {
    ElMessage.error("暂无可复制数据, 请添加数据后重试")
    return
  }
  clip(code.value, event)
}
</script>

<template>
  <div class="box">
    <div class="title">
      <span class="text">{{ capitalizeFirstLetter(props.language) }}</span>
      <el-button class="copy" type="info" size="small" link :icon="CopyDocument" @click="copyCode($event)"
        >复制</el-button
      >
    </div>
    <codemirror
      v-model="code"
      :style="{ height: props.height }"
      :autofocus="props.autofocus"
      :indent-with-tab="props.indentWithTab"
      :disabled="props.disabled"
      :tab-size="props.tabSize"
      :extensions="extensions"
      :placeholder="props.placeholder"
    />
  </div>
</template>

<style scoped lang="scss">
.box {
  border: 1px solid var(--codemirror-border-color);
  border-radius: 10px;
  overflow: hidden;
  width: 100%;

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
