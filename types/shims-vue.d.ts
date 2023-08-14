declare module "*.scss" {
  const scss: Record<string, string>
  export default scss
}

import VueRouter from "vue-router"
import { Route } from "vue-router"
import { Store } from "vuex"
declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter
    $route: Route
    $store: Store<any>
  }
}

// src/shims-vue.d.ts
declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}

declare module "store"
