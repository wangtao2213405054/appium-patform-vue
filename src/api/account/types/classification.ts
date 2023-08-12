// 编辑分类节点请求结构体
export interface EditAccountClassificationRequestData {
  id?: number | null
  name: string
  nodeId?: number | null
}

// 删除分类节点请求结构体
export interface DeleteAccountClassificationRequestData {
  id: number
}

// 分类节点信息结构体
export interface AccountClassificationInfoResponseData {
  createTime?: string
  updateTime?: string
  id?: number
  name?: string
  children?: AccountClassificationInfoResponseData[]
}

// 获取分类节点列表的结构体
export type AccountClassificationListResponseData = ApiResponseData<AccountClassificationInfoResponseData[]>

// 编辑响应结构体
export type AccountClassificationEditResponseData = ApiResponseData<{}>
