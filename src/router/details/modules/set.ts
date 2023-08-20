import { RouteRecordRaw } from "vue-router"

const Layouts = () => import("@/layouts/index.vue")

const version: RouteRecordRaw = {
  path: "/set",
  component: Layouts,
  redirect: "/set/index",
  name: "Set",
  meta: {
    title: "测试集合",
    svgIcon: "set",
    roles: ["Set"] // 可以在根路由中设置角色
  },
  children: [
    {
      path: "index",
      component: () => import("@/views/set/index.vue"),
      name: "SetIndex",
      meta: {
        title: "测试集合",
        roles: ["SetIndex"],
        svgIcon: "set"
      }
    }
  ]
}

export default version
