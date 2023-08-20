import { RouteRecordRaw } from "vue-router"

const Homes = () => import("@/views/home/index.vue")

const base: RouteRecordRaw = {
  path: "/base",
  component: Homes,
  redirect: "noRedirect",
  name: "Base",
  meta: {
    title: "基础配置",
    svgIcon: "config",
    roles: ["Base"],
    home: true
  },
  children: [
    {
      path: "element",
      component: () => import("@/views/base/element/index.vue"),
      name: "BaseElement",
      meta: {
        title: "页面元素",
        svgIcon: "element",
        roles: ["BaseElement"]
      }
    }
  ]
}

export default base
