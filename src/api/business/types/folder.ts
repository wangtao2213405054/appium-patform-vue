// 获取文件夹列表的结构体
export interface GetFolderRequestData {
  total?: number
  page: number // 页码
  pageSize: number // 每页大小
  name?: string // 查询条件
  projectId: number
}

// 文件夹信息结构体
export interface FolderInfoResponseData {
  createTime: string
  updateTime: string
  id: number // 文件夹id
  name: string
  projectId: number
}

// 编辑文件夹的结构体
export interface EditFolderRequestData {
  id: number | null // 文件夹id
  projectId: number
  name: string
}

// 删除文件夹的结构体
export interface DeleteFolderRequestData {
  id: number // 文件夹id
}

// 获取文件夹列表的结构体
export type FolderListResponseData = ApiResponseData<{
  items: FolderInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type FolderEditResponseData = ApiResponseData<{}>
