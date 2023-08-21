// 获取字典列表的结构体
export interface GetDictionaryRequestData {
  total?: number
  page?: number // 页码
  pageSize?: number // 每页大小
  keyword?: string // 查询条件
}

// 字典信息结构体
export interface DictionaryInfoResponseData {
  createTime: string
  updateTime: string
  id: number // 字典id
  desc: string
  code: string
  name: string
  status: boolean
}

// 编辑字典的结构体
export interface EditDictionaryRequestData {
  id?: number | null // 字典id
  desc: string
  code: string
  name: string
  status: boolean
}

// 删除字典的结构体
export interface DeleteDictionaryRequestData {
  id: number // 字典id
}

// 获取字典列表的结构体
export type DictionaryListResponseData = ApiResponseData<{
  items: DictionaryInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type DictionaryEditResponseData = ApiResponseData<{}>
