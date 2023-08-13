import { RouteRecordRaw } from "vue-router"

const Homes = () => import("@/views/home/index.vue")

const permission: RouteRecordRaw = {
  path: "/permission",
  component: Homes,
  redirect: "/permission/role",
  name: "Permission",
  meta: {
    title: "权限管理",
    svgIcon: "lock",
    roles: ["Permission"], // 可以在根路由中设置角色
    home: true
  },
  children: [
    {
      path: "role",
      component: () => import("@/views/role/index.vue"),
      name: "PermissionRole",
      meta: {
        title: "角色管理",
        roles: ["PermissionRole"],
        home: true,
        svgIcon: "user"
      }
    },
    {
      path: "menu",
      component: () => import("@/views/permissions/index.vue"),
      name: "PermissionMenu",
      meta: {
        title: "菜单管理",
        roles: ["PermissionMenu"],
        home: true,
        svgIcon: "menu"
      }
    }
  ]
}

export default permission
