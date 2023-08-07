import { RouteRecordRaw } from "vue-router"

const Layouts = () => import("@/layouts/index.vue")

const mock: RouteRecordRaw = {
  path: "/mock",
  component: Layouts,
  redirect: "/mock/api",
  name: "Mock",
  meta: {
    title: "模拟配置",
    svgIcon: "lock",
    roles: ["Mock"] // 可以在根路由中设置角色
  },
  children: [
    {
      path: "domain",
      component: () => import("@/views/mock/domain/index.vue"),
      name: "MockDomain",
      meta: {
        title: "域名配置",
        roles: ["MockDomain"],
        svgIcon: "menu"
      }
    },
    {
      path: "api",
      component: () => import("@/views/mock/api/index.vue"),
      name: "MockApi",
      meta: {
        title: "接口配置",
        roles: ["MockApi"],
        svgIcon: "user"
      }
    }
  ]
}

export default mock
