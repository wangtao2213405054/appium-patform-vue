import { RouteRecordRaw } from "vue-router"

const Homes = () => import("@/views/home/index.vue")

const project: RouteRecordRaw = {
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
}

export default project
