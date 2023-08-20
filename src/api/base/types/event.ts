// 获取事件列表的结构体
export interface GetEventRequestData {
  total?: number
  page: number // 页码
  pageSize: number // 每页大小
  name?: string // 事件名称
}

// 事件信息结构体
export interface EventInfoResponseData {
  createTime: string
  updateTime: string
}

// 编辑事件的结构体
export interface EditEventRequestData {
  id: number // 事件id
}

// 删除事件的结构体
export interface DeleteEventRequestData {
  id: number // 事件id
}

// 获取事件列表的结构体
export type EventListResponseData = ApiResponseData<{
  items: EventInfoResponseData[]
  page: number
  pageSize: number
  total: number
  totalPage: number
}>

export type EventEditResponseData = ApiResponseData<{}>
