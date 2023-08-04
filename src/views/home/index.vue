<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue"
import introduce from "./components/introduce.vue"
import { useUserStore } from "@/store/modules/user"
import { Plus } from "@element-plus/icons-vue"
import Project from "./components/project.vue"
import Timeline from "./components/timeline.vue"
import Permissions from "./components/permissions.vue"
import Role from "./components/role.vue"
import { RightMenu } from "@/layouts/components"
import {useAppStore} from "@/store/modules/app";

const userStore = useUserStore()
// 当前所选Tab
const activeTab = ref<string>("activity")
const dialogVisible = ref<boolean>(false)
const showSidebar = ref<boolean>(false)

interface permissionInterface {
  [key: string]: any
}
const permissionInfo: permissionInterface = reactive({
  userControl: false,
  roleControl: false,
  menuControl: false
})

onMounted(() => {
  getRoles()
})

// 获取权限信息
const getRoles = () => {
  if (userStore.roles.includes("admin")) {
    for (const key in permissionInfo) {
      permissionInfo[key] = true
    }
  } else {
    // 新增页面时需要向此list中添加绑定
    const permissions = [
      { identifier: "user", value: "userControl" },
      { identifier: "role", value: "roleControl" },
      { identifier: "menu", value: "menuControl" }
    ]
    permissions.forEach((items) => {
      const { identifier, value } = items
      if (userStore.roles.includes(identifier)) {
        permissionInfo[value] = true
      }
    })
  }
}

const createProject = () => {
  dialogVisible.value = true
}

const appStore = useAppStore()

/** 定义计算属性 layoutClasses，用于控制布局的类名 */
const layoutClasses = computed(() => {
  return {
    hideSidebar: !appStore.sidebar.opened
  }
})
</script>

<template>
  <el-container class="home-page">
    <el-aside style="width: 350px">
      <introduce />
    </el-aside>
    <el-container>
      <el-header :class="layoutClasses" class="app-wrapper">
        <RightMenu v-model:showSidebar="showSidebar" class="navigation-bar" />
      </el-header>
      <el-main>
        <el-card>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="项目列表" name="activity">
            <project v-model:dialogVisible="dialogVisible" />
          </el-tab-pane>
          <el-tab-pane label="更新日志" name="timeline">
            <timeline />
          </el-tab-pane>
          <!--              <el-tab-pane v-if="permissionInfo.userControl" label="用户管理" name="account">-->
          <!--                <account />-->
          <!--              </el-tab-pane>-->
          <el-tab-pane v-if="permissionInfo.roleControl" label="角色管理" name="role">
            <role />
          </el-tab-pane>
          <el-tab-pane v-if="permissionInfo.menuControl" label="菜单管理" name="menu">
            <permissions />
          </el-tab-pane>
        </el-tabs>
        <div v-if="activeTab === 'activity'" class="new-project">
          <div>
            <el-button type="primary" :icon="Plus" plain @click="createProject">新建</el-button>
          </div>
        </div>
      </el-card>
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
.new-project {
  position: absolute;
  right: 30px;
  top: 80px;
  font-weight: 600;
  font-size: 14px;
}
.el-header {
  --el-header-padding: 0;
  --el-header-height: 50px;
}
.el-main {
  --el-main-padding: 6px;
}
.navigation-bar {
  flex: 1;
  display: flex;
  justify-content: flex-end; // 将pagination组件右对齐
  background: var(--v3-header-bg-color);
  margin-right: 0
}
</style>
