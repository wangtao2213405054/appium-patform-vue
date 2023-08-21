// 获取字典数据列表的结构体
export interface GetLibraryRequestData {
  total?: number
  page?: number // 页码
  pageSize?: number // 每页大小
  name?: string // 查询条件
  code: string
}

// 字典数据信息结构体
export interface LibraryInfoResponseData {
  createTime: string
  updateTime: string
  id: number // 字典数据id
  desc: string
  code: string
  name: string
  status: boolean
  value: string
  valueType: string
  sort: number
}

// 编辑字典数据的结构体
export interface EditLibraryRequestData {
  id?: number | null // 字典数据id
  desc: string
  code: string
  name: string
  status: boolean
  value: string
  valueType: string
  sort: number
}

// 删除字典数据的结构体
export interface DeleteLibraryRequestData {
  id: number // 字典数据id
}

// 获取字典数据列表的结构体
export type LibraryListResponseData = ApiResponseData<{
  items: LibraryInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type LibraryEditResponseData = ApiResponseData<{}>
