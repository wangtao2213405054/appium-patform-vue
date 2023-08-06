import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layouts = () => import("@/layouts/index.vue")
const Homes = () => import("@/views/home/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Homes,
    name: "Home",
    redirect: "/project",
    meta: {
      title: "项目列表",
      svgIcon: "project",
      home: true
    },
    children: [
      {
        path: "project",
        component: () => import("@/views/home/components/project.vue"),
        name: "Project",
        meta: {
          title: "项目列表",
          svgIcon: "project",
          home: true
        }
      }
    ]
  },
  {
    path: "/timeline",
    component: Homes,
    name: "Timeline",
    meta: {
      title: "更新日志",
      svgIcon: "github-fill",
      home: true
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/home/components/timeline.vue"),
        name: "TimelineLog",
        meta: {
          title: "更新日志",
          svgIcon: "github-fill",
          home: true
        }
      }
    ]
  },
  {
    path: "/dashboard",
    component: Layouts,
    redirect: "/dashboard/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/unocss",
    component: Layouts,
    redirect: "/unocss/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/unocss/index.vue"),
        name: "UnoCSS",
        meta: {
          title: "unocss",
          svgIcon: "unocss"
        }
      }
    ]
  },
  {
    path: "/table",
    component: Layouts,
    redirect: "/table/element-plus",
    name: "Table",
    meta: {
      title: "表格",
      elIcon: "Grid"
    },
    children: [
      {
        path: "element-plus",
        component: () => import("@/views/table/element-plus/index.vue"),
        name: "ElementPlus",
        meta: {
          title: "Element Plus",
          keepAlive: true
        }
      },
      {
        path: "vxe-table",
        component: () => import("@/views/table/vxe-table/index.vue"),
        name: "VxeTable",
        meta: {
          title: "Vxe Table",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/menu",
    component: Layouts,
    redirect: "/menu/menu1",
    name: "Menu",
    meta: {
      title: "多级菜单",
      svgIcon: "menu"
    },
    children: [
      {
        path: "menu1",
        component: () => import("@/views/menu/menu1/index.vue"),
        redirect: "/menu/menu1/menu1-1",
        name: "Menu1",
        meta: {
          title: "menu1"
        },
        children: [
          {
            path: "menu1-1",
            component: () => import("@/views/menu/menu1/menu1-1/index.vue"),
            name: "Menu1-1",
            meta: {
              title: "menu1-1"
            }
          },
          {
            path: "menu1-2",
            component: () => import("@/views/menu/menu1/menu1-2/index.vue"),
            redirect: "/menu/menu1/menu1-2/menu1-2-1",
            name: "Menu1-2",
            meta: {
              title: "menu1-2"
            },
            children: [
              {
                path: "menu1-2-1",
                component: () => import("@/views/menu/menu1/menu1-2/menu1-2-1/index.vue"),
                name: "Menu1-2-1",
                meta: {
                  title: "menu1-2-1"
                }
              },
              {
                path: "menu1-2-2",
                component: () => import("@/views/menu/menu1/menu1-2/menu1-2-2/index.vue"),
                name: "Menu1-2-2",
                meta: {
                  title: "menu1-2-2"
                }
              }
            ]
          },
          {
            path: "menu1-3",
            component: () => import("@/views/menu/menu1/menu1-3/index.vue"),
            name: "Menu1-3",
            meta: {
              title: "menu1-3"
            }
          }
        ]
      },
      {
        path: "menu2",
        component: () => import("@/views/menu/menu2/index.vue"),
        name: "Menu2",
        meta: {
          title: "menu2"
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
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
  },
  {
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
        component: () => import("@/views/home/components/role.vue"),
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
        component: () => import("@/views/home/components/permissions.vue"),
        name: "PermissionMenu",
        meta: {
          title: "菜单管理",
          roles: ["PermissionMenu"],
          home: true,
          svgIcon: "menu"
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
