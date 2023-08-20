import { request } from "@/utils/service"
import type * as Set from "./types/version"

export function apiGetSetList(data: Set.GetSetRequestData) {
  return request<Set.SetListResponseData>({
    url: "/business/set/list",
    method: "POST",
    data
  })
}

export function apiEditSetInfo(data: Set.EditSetRequestData) {
  return request<Set.SetEditResponseData>({
    url: "/business/set/edit",
    method: "POST",
    data
  })
}

export function apiDeleteSetInfo(data: Set.DeleteSetRequestData) {
  return request<Set.SetEditResponseData>({
    url: "/business/set/delete",
    method: "POST",
    data
  })
}
