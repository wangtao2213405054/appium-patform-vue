<script lang="ts" setup>
import { ref } from "vue"
import Codemirror from "@/components/Codemirror/index.vue"
import { mapping } from "./data"

const mappingKey = ref<string | undefined>(undefined)

const emit = defineEmits(["update:modelValue"])

// 选项发生变化
const changeMapping = (value: any) => {
  emit("update:modelValue", mapping[value].default)
}
</script>

<template>
  <div>
    <el-radio-group v-model="mappingKey" @change="changeMapping">
      <el-popover placement="top" :width="600">
        <template #reference>
          <el-radio-button label="Web" />
        </template>
        <codemirror v-model="mapping.Web.hint" language="Web" height="225px" disabled />
      </el-popover>
      <el-popover placement="top" :width="600">
        <template #reference>
          <el-radio-button label="Android" />
        </template>
        <codemirror v-model="mapping.Android.hint" language="Android" height="225px" disabled />
      </el-popover>
      <el-popover placement="top" :width="600">
        <template #reference>
          <el-radio-button label="iOS" />
        </template>
        <codemirror v-model="mapping.iOS.hint" language="iOS" height="225px" disabled />
      </el-popover>
    </el-radio-group>
  </div>
</template>

<style scoped lang="scss"></style>
