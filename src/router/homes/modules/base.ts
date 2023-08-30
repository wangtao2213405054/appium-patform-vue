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
    },
    {
      path: "dict",
      component: () => import("@/views/base/dictionary/index.vue"),
      name: "BaseDict",
      meta: {
        title: "字典管理",
        svgIcon: "dictionary",
        roles: ["BaseDict"]
      }
    },
    {
      path: "dynamic",
      component: () => import("@/views/base/dynamic/index.vue"),
      name: "BaseDynamic",
      meta: {
        title: "组件管理",
        svgIcon: "crown",
        roles: ["BaseDynamic"]
      }
    }
  ]
}

export default base
