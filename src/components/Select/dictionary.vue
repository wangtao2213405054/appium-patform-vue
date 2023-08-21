<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { dict, DictItem } from "@/components/Select/data"
import { apiGetLibraryList } from "@/api/base"

interface Props {
  modelValue: number | string | boolean | undefined
  name: string
  placeholder?: string
  clearable?: boolean
  size?: ""
  filterable?: boolean
  disabled?: boolean
}

const props = defineProps<Props>()
const bound = ref<any>(undefined)
const source = ref<DictItem[]>([])
const emit = defineEmits(["update:modelValue"])

// 选项发生变化
const changeValue = (value: number) => {
  emit("update:modelValue", value)
}

onBeforeMount(async () => {
  if (props.name in dict) {
    source.value = dict[props.name]
  } else {
    const { items } = (await apiGetLibraryList({ code: props.name })).data
    source.value = items
  }
  bound.value = props.modelValue
})
</script>

<template>
  <div>
    <el-select
      v-model="bound"
      :placeholder="props.placeholder"
      :clearable="clearable"
      :size="props.size"
      :filterable="props.filterable"
      :disabled="props.disabled"
      @change="changeValue"
    >
      <el-option v-for="item in source" :key="item.name" :label="item.name" :value="item.value" />
    </el-select>
  </div>
</template>

<style scoped lang="scss"></style>
