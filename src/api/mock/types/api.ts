// 获取模拟接口列表请求结构体
export interface GetMockApiRequestData {
  total: number
  page: number
  pageSize: number
  name: string | null
  path: string
  projectId: number
}

// 编辑模拟接口请求结构体
export interface EditMockApiRequestData {
  body: string
  projectId: number
  path: string
  id: number
  name: string
}

// 删除模拟接口请求结构体
export interface DeleteMockApiRequestData {
  id: number
}

// 模拟接口信息结构体
export interface MockApiInfoResponseData {
  body: string
  projectId: number
  path: string
  id: number
  name: string
  updateTime: string
  createTime: string
}

// 获取模拟接口列表的结构体
export type MockApiListResponseData = ApiResponseData<{
  items: MockApiInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type MockApiEditResponseData = ApiResponseData<{}>
