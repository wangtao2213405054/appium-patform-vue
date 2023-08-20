import { request } from "@/utils/service"
import type * as Version from "./types/version"

export function apiGetVersionList(data: Version.GetVersionRequestData) {
  return request<Version.VersionListResponseData>({
    url: "/business/version/list",
    method: "POST",
    data
  })
}

export function apiEditVersionInfo(data: Version.EditVersionRequestData) {
  return request<Version.VersionEditResponseData>({
    url: "/business/version/edit",
    method: "POST",
    data
  })
}

export function apiDeleteVersionInfo(data: Version.DeleteVersionRequestData) {
  return request<Version.VersionEditResponseData>({
    url: "/business/version/delete",
    method: "POST",
    data
  })
}
