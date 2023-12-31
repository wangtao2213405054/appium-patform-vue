<script lang="ts" setup>
import { ref, computed } from "vue"
import Introduce from "./components/introduce.vue"
import { AppMain, RightMenu, TagsView } from "@/layouts/components"
import SidebarItem from "@/layouts/components/Sidebar/SidebarItem.vue"
import { useRoute } from "vue-router"
import { usePermissionStore } from "@/store/modules/permission"

const showSidebar = ref<boolean>(false)

const route = useRoute()
const activeMenu = computed(() => {
  const {
    meta: { activeMenu },
    path
  } = route
  return activeMenu ? activeMenu : path
})

const permissionStore = usePermissionStore()
</script>

<template>
  <div class="app-wrapper">
    <!-- 左侧内容描述 -->
    <Introduce class="sidebar-container" />
    <!-- 主容器 -->
    <div class="main-container">
      <!-- 头部导航栏和标签栏 -->
      <div class="fixed-header layout-header">
        <div class="navigation-bar">
          <el-menu
            class="sidebar layout-header"
            :default-active="activeMenu"
            :unique-opened="true"
            :collapse-transition="false"
            mode="horizontal"
          >
            <SidebarItem
              v-for="route in permissionStore.homeRoutes"
              :key="route.path"
              :item="route"
              :base-path="route.path"
              :is-top="true"
            />
          </el-menu>
          <RightMenu class="layout-header" v-model:showSidebar="showSidebar" />
        </div>
        <TagsView :is-home="true" />
      </div>
      <!-- 页面主体内容 -->
      <AppMain class="app-main" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/mixins.scss";
$transition-time: 0.35s;

.app-wrapper {
  @include clearfix;
  position: relative;
  width: 100%;
}

.navigation-bar {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  height: var(--v3-navigationbar-height);

  .sidebar {
    border: none;
    flex: 1;
    // 设置 min-width 是为了让 Sidebar 里的 el-menu 宽度自适应
    min-width: 0;
  }
}

.sidebar-container {
  transition: width $transition-time;
  width: var(--v3-introduce-width) !important;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.main-container {
  min-height: 100%;
  transition: margin-left $transition-time;
  margin-left: var(--v3-introduce-width);
  position: relative;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - var(--v3-introduce-width));
  transition: width $transition-time;
}

.layout-header {
  background-color: var(--v3-header-bg-color);
}

.app-main {
  min-height: calc(100vh - var(--v3-navigationbar-height));
  position: relative;
  overflow: hidden;
  padding: 10px;
}

.fixed-header + .app-main {
  padding-top: calc(var(--v3-header-height) + 10px);
  padding-bottom: 10px;
  height: 100vh;
  overflow: auto;
}
.el-menu {
  border: none;
  min-height: 100%;
  width: 100% !important;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title),
:deep(.el-sub-menu .el-menu-item),
:deep(.el-menu--horizontal .el-menu-item) {
  height: var(--v3-navigationbar-height);
  line-height: var(--v3-navigationbar-height);
  &.is-active,
  &:hover {
    background-color: transparent;
  }
  display: block;
  * {
    vertical-align: middle;
  }
}

:deep(.el-sub-menu) {
  &.is-active {
    .el-sub-menu__title {
      color: var(--el-menu-active-color);
    }
  }
}

@mixin tip-line {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: var(--v3-sidebar-menu-tip-line-bg-color);
  }
}

:deep(.el-menu-item) {
  &.is-active {
    @include tip-line;
  }
}

.el-menu--collapse {
  :deep(.el-sub-menu) {
    &.is-active {
      .el-sub-menu__title {
        @include tip-line;
      }
    }
  }
}
</style>
