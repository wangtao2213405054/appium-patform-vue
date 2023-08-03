import { request } from "@/utils/service"
import type * as Menu from "./types/menu"

export function apiGetPermissionsMenuList(data: Menu.GetPermissionsMenuRequestData) {
  return request<Menu.PermissionsMenuListResponseData>({
    url: "/permissions/menu/list",
    method: "POST",
    data
  })
}

export function apiEditPermissionsMenuInfo(data: Menu.EditPermissionsMenuRequestData) {
  return request<Menu.PermissionsMenuEditResponseData>({
    url: "/permissions/menu/edit",
    method: "POST",
    data
  })
}

export function apiDeletePermissionsMenuInfo(data: Menu.DeletePermissionsMenuRequestData) {
  return request<Menu.PermissionsMenuEditResponseData>({
    url: "/permissions/menu/delete",
    method: "POST",
    data
  })
}
