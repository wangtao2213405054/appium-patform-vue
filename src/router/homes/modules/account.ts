import { RouteRecordRaw } from "vue-router"

const Homes = () => import("@/views/home/index.vue")

const account: RouteRecordRaw = {
  path: "/account",
  component: Homes,
  redirect: "/Account/team",
  name: "Account",
  meta: {
    title: "用户管理",
    svgIcon: "team",
    roles: ["Account"], // 可以在根路由中设置角色
    home: true
  },
  children: [
    {
      path: "team",
      component: () => import("@/views/home/components/organization.vue"),
      name: "AccountTeam",
      meta: {
        title: "用户管理",
        roles: ["AccountTeam"],
        home: true,
        svgIcon: "team"
      }
    }
  ]
}

export default account
