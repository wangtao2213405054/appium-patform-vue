import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw } from "vue-router"
import { constantRoutes, asyncRoutes } from "@/router"
import asyncRouteSettings from "@/config/async-route"
import { filterRouter } from "@/utils/filter-router"

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  const routeRoles = route.meta?.roles
  return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true
}

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterAsyncRoutes(tempRoute.children, roles)
      }
      res.push(tempRoute)
    }
  })
  return res
}

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([])
  const dynamicRoutes = ref<RouteRecordRaw[]>([])
  const verifyRoutes = ref<string[]>([])
  const homeRoutes = ref<RouteRecordRaw[]>([])
  const detailRoutes = ref<RouteRecordRaw[]>([])

  const setRoutes = (roles: string[]) => {
    let accessedRoutes
    if (roles.includes("admin")) {
      accessedRoutes = asyncRoutes || []
    } else {
      accessedRoutes = asyncRouteSettings.open ? filterAsyncRoutes(asyncRoutes, roles) : asyncRoutes
    }
    routes.value = constantRoutes.concat(accessedRoutes)
    dynamicRoutes.value = accessedRoutes
    verifyRoutes.value = filterRouter(routes.value) // 将项目页面的数据过滤出来
    // 区分路由, 将首页路由和详情页路由区分出来
    homeRoutes.value = routes.value.filter((route) => route.meta?.home === true)
    detailRoutes.value = routes.value.filter((route) => {
      const hasHomeField = route.meta && typeof route.meta.home !== "undefined"
      const isHomeFalse = route.meta?.home === false
      return !hasHomeField || isHomeFalse
    })
  }
  return { routes, dynamicRoutes, setRoutes, verifyRoutes, homeRoutes, detailRoutes }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
