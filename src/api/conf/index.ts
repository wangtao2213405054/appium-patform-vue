import { request } from "@/utils/service"
import type * as Socket from "./types/socket"

// 获取分类树列表
export function apiGetSocketDomainInfo() {
    return request<Socket.SocketDomainResponseData>({
        url: "/conf/socket/domain",
        method: "GET"
    })
}
