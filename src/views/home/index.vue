<script lang="ts" setup>
import { ref, computed } from "vue"
import introduce from "./components/introduce.vue"
import { AppMain, RightMenu } from "@/layouts/components"
import { useAppStore } from "@/store/modules/app"
import SidebarItem from "@/layouts/components/Sidebar/SidebarItem.vue"
import { useRoute } from "vue-router"
import { usePermissionStore } from "@/store/modules/permission"

const showSidebar = ref<boolean>(false)
const appStore = useAppStore()

/** 定义计算属性 layoutClasses，用于控制布局的类名 */
const layoutClasses = computed(() => {
  return {
    hideSidebar: !appStore.sidebar.opened
  }
})

const route = useRoute()
const activeMenu = computed(() => {
  const {
    meta: { activeMenu },
    path
  } = route
  return activeMenu ? activeMenu : path
})

const permissionStore = usePermissionStore()
const routesHomeStore = permissionStore.routes.filter((route) => route.meta?.home === true)
</script>

<template>
  <el-container class="home-page">
    <el-aside style="width: 350px">
      <introduce />
    </el-aside>
    <el-container>
      <el-header :class="layoutClasses" class="app-wrapper">
        <div class="navigation-bar">
          <el-menu
            class="sidebar layout-header"
            :default-active="activeMenu"
            :unique-opened="true"
            :collapse-transition="false"
            mode="horizontal"
          >
            <SidebarItem
              v-for="route in routesHomeStore"
              :key="route.path"
              :item="route"
              :base-path="route.path"
              :home="true"
            />
          </el-menu>
          <RightMenu class="layout-header" v-model:showSidebar="showSidebar" />
        </div>
      </el-header>
      <el-main>
        <AppMain class="app-main" />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
@import "@/styles/mixins.scss";
$transition-time: 0.35s;

.app-wrapper {
  @include clearfix;
  width: 100%;
}
.home-page {
  padding: 0;
}
.el-header {
  --el-header-padding: 0;
  --el-header-height: 50px;
}
.el-main {
  --el-main-padding: 6px;
}
.navigation-bar {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  height: var(--v3-navigationbar-height);

  .sidebar {
    flex: 1;
    // 设置 min-width 是为了让 Sidebar 里的 el-menu 宽度自适应
    min-width: 0;
  }
}
.layout-header {
  background-color: var(--v3-header-bg-color);
}
.el-menu {
  border: none;
  min-height: 100%;
  width: 100% !important;
}
.app-main {
  transition: padding-left $transition-time;
  padding: 10px;
  height: 100vh;
  overflow: auto;
}
</style>
