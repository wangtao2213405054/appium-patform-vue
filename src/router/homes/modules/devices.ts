import { RouteRecordRaw } from "vue-router"

const Homes = () => import("@/views/home/index.vue")

const devices: RouteRecordRaw = {
  path: "/devices",
  component: Homes,
  redirect: "noRedirect",
  name: "Devices",
  meta: {
    title: "设备管理",
    svgIcon: "sever",
    roles: ["Devices"],
    home: true
  },
  children: [
    {
      path: "master",
      component: () => import("@/views/devices/master.vue"),
      name: "DevicesMaster",
      meta: {
        title: "控制设备",
        svgIcon: "laptop",
        roles: ["DevicesMaster"]
      }
    },
    {
      path: "worker",
      component: () => import("@/views/devices/worker.vue"),
      name: "DevicesWorker",
      meta: {
        title: "执行设备",
        svgIcon: "mobile",
        roles: ["DevicesWorker"]
      }
    },
    {
      path: "/property/:masterId/:id",
      component: () => import("@/views/devices/components/charts.vue"),
      name: "DevicesProperty",
      meta: {
        title: "性能监控",
        activeMenu: "/devices/master",
        hidden: true
      }
    }
  ]
}

export default devices
