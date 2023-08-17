// 获取模拟接口列表请求结构体
export interface GetMockApiRequestData {
  total: number
  page: number
  pageSize: number
  keyword?: string
  projectId: number
}

// 编辑模拟接口请求结构体
export interface EditMockApiRequestData {
  projectId: number
  path: string
  id: number | null
  name: string
  overall: boolean
  recordRequest: boolean
  recordResponse: boolean
  breakpointRequest: boolean
  breakpointResponse: boolean
  request: string
  response: string
}

// 删除模拟接口请求结构体
export interface DeleteMockApiRequestData {
  id: number
}

// 模拟接口信息结构体
export interface MockApiInfoResponseData {
  projectId: number
  path: string
  id: number
  name: string
  overall: boolean
  recordRequest: boolean
  recordResponse: boolean
  breakpointRequest: boolean
  breakpointResponse: boolean
  request: string
  response: string
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
