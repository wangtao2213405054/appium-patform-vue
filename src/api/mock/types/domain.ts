// 获取模拟域名列表请求结构体
export interface GetMockDomainRequestData {
  total?: number
  page: number
  pageSize: number
  keyword?: string
  projectId: number
  protocol: string
}

// 编辑模拟域名请求结构体
export interface EditMockDomainRequestData {
  domain: string
  projectId: number
  port: string
  protocol: string
  id: number
  name: string
}

// 删除模拟域名请求结构体
export interface DeleteMockDomainRequestData {
  id: number
}

// 模拟域名结构体
export interface MockDomainInfoResponseData {
  domain: string
  projectId: number
  port: string
  protocol: string
  id: number
  name: string
  updateTime: string
  createTime: string
}

// 获取模拟域名列表的结构体
export type MockDomainListResponseData = ApiResponseData<{
  items: MockDomainInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type MockDomainEditResponseData = ApiResponseData<{}>
