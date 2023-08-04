import { request } from "@/utils/service"
import type * as Menu from "./types/menu"
import type * as Role from "./types/role"

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

export function apiGetPermissionsRoleList(data: Role.GetPermissionsRoleRequestData) {
  return request<Role.PermissionsRoleListResponseData>({
    url: "/permissions/role/list",
    method: "POST",
    data
  })
}

export function apiEditPermissionsRoleInfo(data: Role.EditPermissionsRoleRequestData) {
  return request<Role.PermissionsRoleEditResponseData>({
    url: "/permissions/role/edit",
    method: "POST",
    data
  })
}

export function apiDeletePermissionsRoleInfo(data: Role.DeletePermissionsRoleRequestData) {
  return request<Role.PermissionsRoleEditResponseData>({
    url: "/permissions/role/delete",
    method: "POST",
    data
  })
}
