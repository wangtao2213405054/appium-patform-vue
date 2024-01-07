import { request } from "@/utils/service"

type uploadFileResponseData = ApiResponseData<{
  time: string[]
  prices: number[]
  avgPrices: number[]
  ratios: number[]
  ratiosValue: number[]
  volume: number[]
}>

export function apiGetTestTime() {
  return request<uploadFileResponseData>({
    url: "/test/time",
    method: "POST"
  })
}
