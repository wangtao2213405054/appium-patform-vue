// 获取版本列表的结构体
export interface GetVersionRequestData {
  total?: number
  page: number // 页码
  pageSize: number // 每页大小
  name?: string // 查询条件
  projectId: number
}

// 版本信息结构体
export interface VersionInfoResponseData {
  createTime: string
  updateTime: string
  id: number // 版本id
  desc: string
  identify: string
  name: string
  projectId: number
}

// 编辑版本的结构体
export interface EditVersionRequestData {
  id: number | null // 版本id
  desc: string
  projectId: number
  name: string
  identify: string
}

// 删除版本的结构体
export interface DeleteVersionRequestData {
  id: number // 版本id
}

// 获取版本列表的结构体
export type VersionListResponseData = ApiResponseData<{
  items: VersionInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type VersionEditResponseData = ApiResponseData<{}>
