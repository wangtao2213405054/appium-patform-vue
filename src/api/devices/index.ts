import { request } from "@/utils/service"
import type * as Master from "./types/master"
import type * as Worker from "./types/worker"

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

export function apiGetMasterSocketRoomInfo(data: Master.DeleteMasterRequestData) {
  return request<Master.MasterSocketResponseData>({
    url: "/devices/master/socket",
    method: "POST",
    data
  })
}

export function apiGetWorkerList(data: Worker.GetWorkerRequestData) {
  return request<Worker.WorkerListResponseData>({
    url: "/devices/worker/list",
    method: "POST",
    data
  })
}

export function apiEditWorkerInfo(data: Worker.EditWorkerRequestData) {
  return request<Worker.WorkerEditResponseData>({
    url: "/devices/worker/edit",
    method: "POST",
    data
  })
}

export function apiDeleteWorkerInfo(data: Worker.DeleteWorkerRequestData) {
  return request<Worker.WorkerEditResponseData>({
    url: "/devices/worker/delete",
    method: "POST",
    data
  })
}

export function apiEditWorkerStatusInfo(data: Worker.SwitchWorkerRequestData) {
  return request<Worker.WorkerEditResponseData>({
    url: "/devices/worker/switch",
    method: "POST",
    data
  })
}
