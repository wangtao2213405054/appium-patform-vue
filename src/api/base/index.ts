import { request } from "@/utils/service"
import type * as Element from "./types/element"

export function apiGetElementList(data: Element.GetElementRequestData) {
  return request<Element.ElementListResponseData>({
    url: "/conf/element/list",
    method: "POST",
    data
  })
}

export function apiEditElementInfo(data: Element.EditElementRequestData) {
  return request<Element.ElementEditResponseData>({
    url: "/conf/element/edit",
    method: "POST",
    data
  })
}

export function apiDeleteElementInfo(data: Element.DeleteElementRequestData) {
  return request<Element.ElementEditResponseData>({
    url: "/conf/element/delete",
    method: "POST",
    data
  })
}
