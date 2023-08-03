// 获取项目列表的结构体
export interface GetProjectRequestData {
  total: number
  page: number // 页码
  pageSize: number // 每页大小
  name: string // 项目名称
}

// 项目信息结构体
export interface ProjectInfoResponseData {
  avatar: string
  createId: number
  createTime: string
  createUser: string
  describe: string
  id: number
  label: string
  mold: string
  name: string
  updateTime: string
}

// 编辑项目的结构体
export interface EditProjectRequestData {
  avatar: string // 头像
  describe: string // 项目描述
  mold: string // 驱动程序
  name: string // 名称
  id: number // 项目id
}

// 删除项目的结构体
export interface DeleteProjectRequestData {
  id: number // 项目id
}

// 获取项目列表的结构体
export type ProjectListResponseData = ApiResponseData<{
  items: ProjectInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type ProjectEditResponseData = ApiResponseData<{}>
