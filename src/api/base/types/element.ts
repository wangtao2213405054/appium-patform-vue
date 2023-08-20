// 获取元素列表的结构体
export interface GetElementRequestData {
  total?: number
  page: number // 页码
  pageSize: number // 每页大小
  keyword?: string // 查询条件
  platform?: string // 平台
}

// 元素信息结构体
export interface ElementInfoResponseData {
  createTime: string
  updateTime: string
  id: number // 元素id
  desc: string
  label: string
  name: string
  platform: string[] // selenium or appium
}

// 编辑元素的结构体
export interface EditElementRequestData {
  id: number | null // 元素id
  desc: string
  label: string
  name: string
  platform: string[] // selenium or appium
}

// 删除元素的结构体
export interface DeleteElementRequestData {
  id: number // 元素id
}

// 获取元素列表的结构体
export type ElementListResponseData = ApiResponseData<{
  items: ElementInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type ElementEditResponseData = ApiResponseData<{}>
