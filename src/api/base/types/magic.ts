// 获取魔法菜单列表的结构体
import { DynamicInfoResponseData } from "@/api/base/types/dynamic"

export interface GetMagicRequestData {
  total?: number
  page?: number // 页码
  pageSize?: number // 每页大小
  keyword?: string // 查询条件
  type: "menu" | "function"
  nodeId?: number
}

// 魔法菜单信息结构体
export interface MagicInfoResponseData {
  createTime: string
  updateTime: string
  id: number // 魔法菜单id
  desc: string
  keyword: string
  name: string
  status: boolean
  sort: number
  nodeId?: number
  params: number[]
  type: "menu" | "function"
}

// 编辑魔法菜单的结构体
export interface EditMagicRequestData {
  id?: number | null // 魔法菜单id
  desc: string
  keyword: string
  name: string
  status: boolean
  sort: number
  nodeId?: number
  params: number[]
  type: "menu" | "function"
}

// 删除魔法菜单的结构体
export interface DeleteMagicRequestData {
  id: number // 魔法菜单id
}

// 获取魔法菜单列表的结构体
export type MagicListResponseData = ApiResponseData<{
  items: MagicInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type MagicEditResponseData = ApiResponseData<{}>

export interface MagicVariableResponseData {
  createTime: string
  updateTime: string
  id: number // 魔法菜单id
  desc: string
  keyword: string
  name: string
  status: boolean
  sort: number
  nodeId?: number
  params: DynamicInfoResponseData[]
  type: "menu" | "function"
  children: MagicVariableResponseData[]
  functionList: MagicVariableResponseData[]
  show?: boolean
}

export type MagicVariableListResponseData = ApiResponseData<MagicVariableResponseData>
