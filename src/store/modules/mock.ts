import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { apiGetMagicVariable } from "@/api/base"
import { MagicVariableResponseData } from "@/api/base/types/magic"

export const useMockStore = defineStore("mock", () => {
  const mockList = ref<MagicVariableResponseData[]>([])

  /** 获取动态变量数据 */
  const getMockList = async () => {
    mockList.value = (await apiGetMagicVariable()).data
  }
  return { mockList, getMockList }
})

/** 在 setup 外使用 */
export function useMockStoreHook() {
  return useMockStore(store)
}
