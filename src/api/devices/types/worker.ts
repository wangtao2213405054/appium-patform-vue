// 获取工作机列表的结构体
export interface GetWorkerRequestData {
  total?: number
  page: number
  pageSize: number
  name?: string
  master?: number | undefined
  status?: boolean | undefined
}

// 工作机信息结构体
export interface WorkerInfoResponseData {
  actual: number
  blocker: number
  cause: string | null
  createTime: string
  updateTime: string
  desc: string | undefined
  id: number
  key: string
  logging: string
  mapping: string
  master: number
  name: string
  status: number
  switch: boolean
}

// 编辑工作机的结构体
export interface EditWorkerRequestData {
  blocker: number
  desc: string | undefined
  id: number | null
  logging: string
  mapping: string
  master: number | undefined
  name: string
  switch: boolean
}

// 删除工作机的结构体
export interface DeleteWorkerRequestData {
  id: number // 工作机id
  master: number
}


// 修改工作机任务轮训的结构体
export interface SwitchWorkerRequestData {
  id: number // 工作机id
  kill: boolean // 是否杀死现有进程
  switch: boolean // 工作机状态
}

// 获取工作机列表的结构体
export type WorkerListResponseData = ApiResponseData<{
  items: WorkerInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type WorkerEditResponseData = ApiResponseData<{}>

export interface SocketWorkStatusResponseData {
  id: number
  status: number
  cause: string
}
