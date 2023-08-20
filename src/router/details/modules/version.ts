import { RouteRecordRaw } from "vue-router"

const Layouts = () => import("@/layouts/index.vue")

const version: RouteRecordRaw = {
  path: "/version",
  component: Layouts,
  redirect: "/version/index",
  name: "Version",
  meta: {
    title: "版本管理",
    svgIcon: "version",
    roles: ["Version"] // 可以在根路由中设置角色
  },
  children: [
    {
      path: "index",
      component: () => import("@/views/version/index.vue"),
      name: "VersionIndex",
      meta: {
        title: "版本管理",
        roles: ["VersionIndex"],
        svgIcon: "version"
      }
    }
  ]
}

export default version
