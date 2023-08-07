import { RouteRecordRaw } from "vue-router"

const Homes = () => import("@/views/home/index.vue")

const timeline: RouteRecordRaw = {
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
}

export default timeline
