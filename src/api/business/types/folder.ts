// 获取文件夹列表的结构体
export interface GetFolderRequestData {
  name?: string // 查询条件
  type?: "folder" | "case"
  projectId: number
}

// 文件夹信息结构体
export interface FolderInfoResponseData {
  createTime: string
  updateTime: string
  id: number // 文件夹id
  name: string
  type?: "folder" | "case"
  projectId: number
  children: FolderInfoResponseData[]
}

// 编辑文件夹的结构体
export interface EditFolderRequestData {
  id: number | null // 文件夹id
  projectId: number
  type?: "folder" | "case"
  nodeId: number
  name: string
}

// 移动文件夹结构体
export interface MoveFolderRequestData {
  id: number | null // 文件夹id
  nodeId: number
  position: 'before' | 'after' | 'inner'
}

// 删除文件夹的结构体
export interface DeleteFolderRequestData {
  id: number // 文件夹id
}

// 获取文件夹列表的结构体
export type FolderListResponseData = ApiResponseData<FolderInfoResponseData[]>

export type FolderDefaultResponseData = ApiResponseData<{}>

export type FolderEditResponseData = ApiResponseData<FolderInfoResponseData>
