// socket.ts 全局方法实现
import { io, Socket } from "socket.io-client"
import { getToken } from "@/utils/cache/cookies"
import { ElMessage, ElNotification } from "element-plus"
import { apiGetSocketDomainInfo } from "@/api/conf"

export async function initSocket(app: any) {
  const token = getToken()
  if (!token) {
    setTimeout(() => {
      console.count()
      initSocket(app) // 未登录时进入递归
    }, 100)
    return
  }
  const { domain } = (await apiGetSocketDomainInfo())!.data
  if (!domain) return

  const socket = io(domain, {
    extraHeaders: { token: token },
    autoConnect: true, // 已通过验证，全局使用可默认打开，组件内使用则默认关闭，使用时在打开
    // mac 下 如果为1秒时，会出现跨域问题, 重连会失败, 在 python-socket io 库中也出现了此问题, 经过调试后发现当重连过于频繁时,
    // 服务器会返回403, 但是在服务器中并没有收到任何的请求信息
    reconnectionDelay: 5000, // 重连间隔
    reconnectionAttempts: 5 // 重连次数
  })

  // 注册服务
  app.config.globalProperties.$socket = socket
  app.provide("socket", socket)

  // 普通消息
  socket.on("message", (data) => {
    const { message, type, duration } = data
    ElMessage({
      message: message,
      type: type || "info",
      duration: duration || 2 * 1000
    })
  })

  // 通知框
  socket.on("notify", (data) => {
    const { title, message, type, duration, position, dangerouslyUseHTMLString, offset, showClose } = data
    ElNotification({
      message: message,
      title: title,
      type: type || null,
      duration: duration || 2 * 1000,
      position: position || "top-right",
      dangerouslyUseHTMLString: dangerouslyUseHTMLString || false,
      offset: offset || 0,
      showClose: showClose || true
    })
  })

  // 连接事件
  socket.on("connect", () => {
    console.log("socket连接成功")
  })
  // 断开事件
  socket.on("disconnect", () => {
    console.log("socket断开连接")
  })
}

export { initSocket as socket, Socket }
