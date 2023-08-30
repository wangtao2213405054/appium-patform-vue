import { request } from "@/utils/service"
import type * as Element from "./types/element"
import type * as Dictionary from "./types/dictionary"
import type * as Library from "./types/library"
import type * as Dynamic from "./types/dynamic"

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

export function apiGetDictionaryList(data: Dictionary.GetDictionaryRequestData) {
  return request<Dictionary.DictionaryListResponseData>({
    url: "/conf/dictionary/list",
    method: "POST",
    data
  })
}

export function apiEditDictionaryInfo(data: Dictionary.EditDictionaryRequestData) {
  return request<Dictionary.DictionaryEditResponseData>({
    url: "/conf/dictionary/edit",
    method: "POST",
    data
  })
}

export function apiDeleteDictionaryInfo(data: Dictionary.DeleteDictionaryRequestData) {
  return request<Dictionary.DictionaryEditResponseData>({
    url: "/conf/dictionary/delete",
    method: "POST",
    data
  })
}

export function apiGetLibraryList(data: Library.GetLibraryRequestData) {
  return request<Library.LibraryListResponseData>({
    url: "/conf/library/list",
    method: "POST",
    data
  })
}

export function apiEditLibraryInfo(data: Library.EditLibraryRequestData) {
  return request<Library.LibraryEditResponseData>({
    url: "/conf/library/edit",
    method: "POST",
    data
  })
}

export function apiDeleteLibraryInfo(data: Library.DeleteLibraryRequestData) {
  return request<Library.LibraryEditResponseData>({
    url: "/conf/library/delete",
    method: "POST",
    data
  })
}

export function apiGetDynamicList(data: Dynamic.GetDynamicRequestData) {
  return request<Dynamic.DynamicListResponseData>({
    url: "/conf/dynamic/list",
    method: "POST",
    data
  })
}

export function apiEditDynamicInfo(data: Dynamic.EditDynamicRequestData) {
  return request<Dynamic.DynamicEditResponseData>({
    url: "/conf/dynamic/edit",
    method: "POST",
    data
  })
}

export function apiDeleteDynamicInfo(data: Dynamic.DeleteDynamicRequestData) {
  return request<Dynamic.DynamicEditResponseData>({
    url: "/conf/dynamic/delete",
    method: "POST",
    data
  })
}
