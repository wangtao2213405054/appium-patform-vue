// 获取权限菜单请求
export interface GetPermissionsMenuRequestData {
  identifier: string
  name: string
}

// 编辑权限请求结构体
export interface EditPermissionsMenuRequestData {
  id: number | null
  identifier: string | null
  name: string
  nodeId: number | null
}

// 删除权限菜单请求结构体
export interface DeletePermissionsMenuRequestData {
  id: number
}

export interface PermissionsMenuInfoResponseData {
  createTime: string
  id: number | null
  identifier: string | null
  name: string
}

// 获取权限列表的结构体
export type PermissionsMenuListResponseData = ApiResponseData<PermissionsMenuInfoResponseData[]>

// 编辑响应结构体
export type PermissionsMenuEditResponseData = ApiResponseData<{}>
