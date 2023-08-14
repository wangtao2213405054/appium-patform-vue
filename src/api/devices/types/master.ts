// 获取控制机列表的结构体
export interface GetMasterRequestData {
  total?: number
  page: number
  pageSize: number
  name?: string
  projectId?: number | undefined
  status?: boolean | undefined
}

// 控制机信息结构体
export interface MasterInfoResponseData {
  context: number
  createTime: string
  desc: string
  id: number
  key: string
  logging: string
  maxContext: number
  name: string
  online: boolean
  projectId: number
  role: number
  status: boolean
  token: string
  updateTime: string
}

// 编辑控制机的结构体
export interface EditMasterRequestData {
  name: string
  id: number | null
  desc: string
  logging: string
  maxContext: number
  projectId: number | undefined
  role: number | undefined
  status: boolean
  token?: string
}

// 删除控制机的结构体
export interface DeleteMasterRequestData {
  id: number // 控制机id
}

// 修改控制机状态的结构体
export interface StatusMasterRequestData {
  id: number // 控制机id
  status: boolean // 控制机状态
}

// 获取控制机列表的结构体
export type MasterListResponseData = ApiResponseData<{
  items: MasterInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type MasterEditResponseData = ApiResponseData<{}>

export type MasterSocketResponseData = ApiResponseData<string>

// master 状态变化
export interface MasterOnlineStatusSocketData {
  id: number
  online: boolean
}

export interface CpuInfoData {
  count: number
  logical: number
  percent: number
}

export interface NetworkData {
  send: string
  recv: string
}

export interface VirtualData {
  available: string
  total: string
  percent: number
}

export interface DiskData {
  total: string
  used: string
  free: string
  percent: number
}

// master socket 图标消息体
export interface MasterSocketChartsData {
  id: number
  cpu: CpuInfoData
  startedTime: string
  network: NetworkData
  virtual: VirtualData
  disk: DiskData
  currentTime: string
}
