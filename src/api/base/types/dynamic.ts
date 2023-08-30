// 获取动态组件列表的结构体
export interface GetDynamicRequestData {
  total?: number
  page?: number // 页码
  pageSize?: number // 每页大小
  keyword?: string // 查询条件
}

// 动态组件信息结构体
export interface DynamicInfoResponseData {
  createTime: string
  updateTime: string
  id: number // 动态组件id
  type: string
  element: string
  name: string
  placeholder: string
  expression: string
  options: OptionsResponseData[]
}

export interface OptionsResponseData {
  id: number
  value: string | number
  label?: string
}

// 编辑动态组件的结构体
export interface EditDynamicRequestData {
  id?: number | null // 动态组件id
  type: string
  element: string
  name: string
  placeholder: string
  expression: string
  options: OptionsResponseData[]
}

// 删除动态组件的结构体
export interface DeleteDynamicRequestData {
  id: number // 动态组件id
}

// 获取动态组件列表的结构体
export type DynamicListResponseData = ApiResponseData<{
  items: DynamicInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type DynamicEditResponseData = ApiResponseData<{}>
