
// 获取权限角色列表
import { PermissionsMenuInfoResponseData } from "@/api/permissions/types/menu"

export interface GetPermissionsRoleRequestData {
  identifier: string
  name: string,
  page: number,
  pageSize: number,
  total: number
}

// 编辑权限请求结构体
export interface EditPermissionsRoleRequestData {
  id: number | null
  identifier: string | null
  name: string
  permissionsApi: any[]
}


// 删除权限请求数据
export interface DeletePermissionsRoleRequestData {
  id: number
}

// 编辑响应结构体
export type PermissionsRoleEditResponseData = ApiResponseData<{}>

// 角色列表
export type PermissionsRoleListResponseData = ApiResponseData<{
  items: PermissionsMenuInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>
