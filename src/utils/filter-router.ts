import { RouteRecordRaw } from "vue-router"

export function filterRouter(data: RouteRecordRaw[]) {
  const router: string[] = []
  for (const item of data) {
    if ((item.meta && item.meta.home) || (item.meta && item.meta.hidden)) {
      continue
    }
    router.push(item.path)

    if (item.children) {
      const result = filterRouter(item.children)
      for (const children of result) {
        router.push(`${item.path}/${children}`)
      }
    }
  }
  return router
}
