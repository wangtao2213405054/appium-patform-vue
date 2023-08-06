import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage, ElMessageBox } from "element-plus"
import { get, merge } from "lodash-es"
import { getToken } from "./cache/cookies"

/** 退出登录并强制刷新页面（会重定向到登录页） */
function logout() {
  useUserStoreHook().logout()
  location.reload()
}

/** 创建请求实例 */
function createService() {
  // 创建一个 axios 实例命名为 service
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    (config) => config,
    // 发送失败
    (error) => Promise.reject(error)
  )
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    (response) => {
      // apiData 是 api 返回的数据
      const apiData = response.data
      const { code, msg } = response.data
      // 二进制数据则直接返回
      const responseType = response.request?.responseType
      if (responseType === "blob" || responseType === "arraybuffer") return apiData
      // 这个 code 是和后端约定的业务 code
      // 如果没有 code, 代表这不是项目后端开发的 api
      if (code === undefined) {
        ElMessage.error("非本系统的接口")
        return Promise.reject(new Error("非本系统的接口"))
      } else if (code !== 1) {
        // code !== 1 则提示错误
        ElMessage.error(msg || "Error")
        return Promise.reject(new Error(msg || "Error"))
      } else if (code === 4001 || code === 4002) {
        // 当 code 为 4001 or 4002 时退出登陆
        ElMessageBox.confirm("您已登出，您可以取消停留在此页面，或重新登录", "登陆失效", {
          confirmButtonText: "重新登陆",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return logout()
        })
      } else {
        return apiData
      }
    },
    (error) => {
      // status 是 HTTP 状态码
      const status = get(error, "response.status")
      switch (status) {
        case 400:
          error.msg = "请求错误"
          break
        case 401:
          // Token 过期时
          logout()
          break
        case 403:
          error.msg = "拒绝访问"
          break
        case 404:
          error.msg = "请求地址出错"
          break
        case 408:
          error.msg = "请求超时"
          break
        case 500:
          error.msg = "服务器内部错误"
          break
        case 501:
          error.msg = "服务未实现"
          break
        case 502:
          error.msg = "网关错误"
          break
        case 503:
          error.msg = "服务不可用"
          break
        case 504:
          error.msg = "网关超时"
          break
        case 505:
          error.msg = "HTTP 版本不受支持"
          break
        default:
          break
      }
      ElMessage.error(error.msg)
      return Promise.reject(error)
    }
  )
  return service
}

/** 创建请求方法 */
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = getToken()
    const defaultConfig = {
      headers: {
        // 携带 Token
        token: token
      },
      timeout: 5000,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {}
    }
    // 将默认配置 defaultConfig 和传入的自定义配置 config 进行合并成为 mergeConfig
    const mergeConfig = merge(defaultConfig, config)
    return service(mergeConfig)
  }
}

/** 用于网络请求的实例 */
const service = createService()
/** 用于网络请求的方法 */
export const request = createRequest(service)
