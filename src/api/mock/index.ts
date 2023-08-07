import { request } from "@/utils/service"
import type * as Domain from "./types/domain"
import type * as Api from "./types/api"

// 获取分类树列表
export function apiGetMockDomainList(data: Domain.GetMockDomainRequestData) {
    return request<Domain.MockDomainListResponseData>({
        url: "/mock/domain/list",
        method: "POST",
        data
    })
}

// 编辑分类节点
export function apiEditMockDomainInfo(data: Domain.EditMockDomainRequestData) {
    return request<Domain.MockDomainEditResponseData>({
        url: "/mock/domain/edit",
        method: "POST",
        data
    })
}

// 删除分类节点
export function apiDeleteMockDomainInfo(data: Domain.DeleteMockDomainRequestData) {
    return request<Domain.MockDomainEditResponseData>({
        url: "/mock/domain/delete",
        method: "POST",
        data
    })
}

export function apiGetMockApiList(data: Api.GetMockApiRequestData) {
    return request<Api.MockApiListResponseData>({
        url: "/mock/api/list",
        method: "POST",
        data
    })
}

// 编辑分类节点
export function apiEditMockApiInfo(data: Api.EditMockApiRequestData) {
    return request<Api.MockApiEditResponseData>({
        url: "/mock/api/edit",
        method: "POST",
        data
    })
}

// 删除分类节点
export function apiDeleteMockApiInfo(data: Api.DeleteMockApiRequestData) {
    return request<Api.MockApiEditResponseData>({
        url: "/mock/api/delete",
        method: "POST",
        data
    })
}
