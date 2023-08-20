// 获取测试集合列表的结构体
export interface GetSetRequestData {
  total?: number
  page: number // 页码
  pageSize: number // 每页大小
  name?: string // 查询条件
  special?: boolean | undefined
  projectId: number
}

// 测试集合信息结构体
export interface SetInfoResponseData {
  createTime: string
  updateTime: string
  id: number // 测试集合id
  desc: string
  customSet: number[][]
  special: boolean
  name: string
  projectId: number
}

// 编辑测试集合的结构体
export interface EditSetRequestData {
  id: number | null // 测试集合id
  desc: string
  projectId: number
  name: string
  customSet: number[][]
  special: boolean
}

// 删除测试集合的结构体
export interface DeleteSetRequestData {
  id: number // 测试集合id
}

// 获取测试集合列表的结构体
export type SetListResponseData = ApiResponseData<{
  items: SetInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type SetEditResponseData = ApiResponseData<{}>
