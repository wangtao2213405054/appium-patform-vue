import { request } from "@/utils/service"
import type * as Classification from "./types/classification"
import type * as User from "./types/user"

// 获取分类树列表
export function apiGetAccountClassificationList() {
  return request<Classification.AccountClassificationListResponseData>({
    url: "/account/classification/list",
    method: "GET"
  })
}

// 编辑分类节点
export function apiEditAccountClassificationInfo(data: Classification.EditAccountClassificationRequestData) {
  return request<Classification.AccountClassificationEditResponseData>({
    url: "/account/classification/edit",
    method: "POST",
    data
  })
}

// 删除分类节点
export function apiDeleteAccountClassificationInfo(data: Classification.DeleteAccountClassificationRequestData) {
  return request<Classification.AccountClassificationEditResponseData>({
    url: "/account/classification/delete",
    method: "POST",
    data
  })
}

export function apiGetAccountUserList(data: User.GetAccountUserRequestData) {
  return request<User.AccountUserListResponseData>({
    url: "/account/user/list",
    method: "POST",
    data
  })
}

// 编辑分类节点
export function apiEditAccountUserInfo(data: User.EditAccountUserRequestData) {
  return request<User.AccountUserEditResponseData>({
    url: "/account/user/edit",
    method: "POST",
    data
  })
}

// 删除分类节点
export function apiDeleteAccountUserInfo(data: User.DeleteAccountUserRequestData) {
  return request<User.AccountUserEditResponseData>({
    url: "/account/user/delete",
    method: "POST",
    data
  })
}

export function apiQueryAccountUserListById(data: User.QueryAccountUserListByIdRequestData) {
  return request<User.AccountUserListResponseData>({
    url: "/account/user/ids",
    method: "POST",
    data
  })
}
