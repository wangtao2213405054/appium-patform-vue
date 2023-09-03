import { RouteRecordRaw } from "vue-router"

const Layouts = () => import("@/layouts/index.vue")

const testcase: RouteRecordRaw = {
  path: "/testcase",
  component: Layouts,
  redirect: "/testcase/index",
  name: "Testcase",
  meta: {
    title: "测试用例",
    svgIcon: "case",
    roles: ["Testcase"] // 可以在根路由中设置角色
  },
  children: [
    {
      path: "index",
      component: () => import("@/views/case/index.vue"),
      name: "TestcaseIndex",
      meta: {
        title: "测试用例",
        roles: ["TestcaseIndex"],
        svgIcon: "case"
      }
    }
  ]
}

export default testcase
