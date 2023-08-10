// 获取用户列表请求结构体
export interface GetAccountUserRequestData {
  total: number
  page: number
  pageSize: number
  name: string | null
  mobile: string | null
  id: number | null
  state: boolean | null
}

// 编辑用户请求结构体
export interface EditAccountUserRequestData {
  avatarUrl: string
  department: number[]
  email: string
  id: number | null
  mobile: string
  name: string
  password: string
  role: number | null
  state: boolean
}

// 指定查询用户请求结构体
export interface QueryAccountUserListByIdRequestData {
  idList: number[]
}

// 删除用户请求结构体
export interface DeleteAccountUserRequestData {
  id: number[]
}

// 用户信息结构体
export interface AccountUserInfoResponseData {
  avatar: string
  createId: number
  createTime: string
  department: number[]
  email: string
  mobile: string
  role: number
  roles: string[]
  state: boolean
  id: number
  name: string
  updateTime: string
}

// 获取项目列表的结构体
export type AccountUserListResponseData = ApiResponseData<{
  items: AccountUserInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type AccountUserEditResponseData = ApiResponseData<{}>
