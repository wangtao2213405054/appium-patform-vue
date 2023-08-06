import { request } from "@/utils/service"
import type * as Upload from "./types/upload"

export function apiUploadImageFile(data: FormData) {
  return request<Upload.uploadFileResponseData>({
    url: "/upload/file/image",
    method: "POST",
    data
  })
}
