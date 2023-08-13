import { request } from "@/utils/service"
import type * as Master from "./types/master"

export function apiGetMasterList(data: Master.GetMasterRequestData) {
  return request<Master.MasterListResponseData>({
    url: "/devices/master/list",
    method: "POST",
    data
  })
}

export function apiEditMasterInfo(data: Master.EditMasterRequestData) {
  return request<Master.MasterEditResponseData>({
    url: "/devices/master/edit",
    method: "POST",
    data
  })
}

export function apiDeleteMasterInfo(data: Master.DeleteMasterRequestData) {
  return request<Master.MasterEditResponseData>({
    url: "/devices/master/delete",
    method: "POST",
    data
  })
}

export function apiEditMasterStatusInfo(data: Master.StatusMasterRequestData) {
  return request<Master.MasterEditResponseData>({
    url: "/devices/master/status",
    method: "POST",
    data
  })
}

export function apiGetMasterSocketRoomInfo(data: Master.StatusMasterRequestData) {
  return request<Master.MasterSocketResponseData>({
    url: "/devices/master/socket",
    method: "POST",
    data
  })
}
