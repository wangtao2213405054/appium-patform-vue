// 获取测试用例列表的结构体
export interface GetCaseRequestData {
  total?: number
  page: number // 页码
  pageSize: number // 每页大小
  name?: string // 查询条件
  special?: boolean | undefined
  projectId: number
}

// 测试用例信息结构体
export interface CaseInfoResponseData {
  createTime: string
  updateTime: string
  id: number // 测试用例id
  desc: string
  customCase: number[][]
  special: boolean
  name: string
  projectId: number
}

// 编辑测试用例的结构体
export interface EditCaseRequestData {
  id: number | null // 测试用例id
  desc: string
  projectId: number
  name: string
  customCase: number[][]
  special: boolean
}

// 删除测试用例的结构体
export interface DeleteCaseRequestData {
  id: number // 测试用例id
}

// 获取测试用例列表的结构体
export type CaseListResponseData = ApiResponseData<{
  items: CaseInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type CaseEditResponseData = ApiResponseData<{}>
