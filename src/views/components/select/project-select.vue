<script lang="ts" setup>
import {onMounted, ref} from "vue"
import { ProjectInfoResponseData } from "@/api/business/types/project"
import { apiGetProjectList } from "@/api/business"

interface Props {
  modelValue: number | undefined
  placeholder?: string
  clearable?: boolean
  size?: string
  filterable?: boolean
  load?: boolean
}

const props = defineProps<Props>()
const projectList = ref<ProjectInfoResponseData[]>([])
const bound = ref<number | undefined>(undefined)
const emit = defineEmits(["update:modelValue"])

// 获取项目列表
const getProjectList = async (value: boolean) => {
  if (value) {
    const { items } = (await apiGetProjectList({ page: 1, pageSize: 9999 })).data
    projectList.value = items
  }
}

// 选项发生变化
const changeValue = (value: number) => {
  emit("update:modelValue", value)
}

onMounted(() => {
  bound.value = props.modelValue
  if (props.load) {
    getProjectList(true)
  }
})
</script>

<template>
  <el-select
    v-model="bound"
    :placeholder="props.placeholder"
    :clearable="clearable"
    :size="props.size"
    :filterable="props.filterable"
    @visible-change="getProjectList"
    @change="changeValue"
  >
    <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
</template>

<style scoped lang="scss">

</style>
