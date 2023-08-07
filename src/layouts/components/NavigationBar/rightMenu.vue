<script setup lang="ts">
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useSettingsStore } from "@/store/modules/settings"
import { useUserStore } from "@/store/modules/user"
import { UserFilled } from "@element-plus/icons-vue"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"
import Screenfull from "@/components/Screenfull/index.vue"
import Notify from "@/components/Notify/index.vue"
import { ref, watch, onMounted } from "vue"
import { ProjectInfoResponseData } from "@/api/business/types/project"
import { apiGetProjectList } from "@/api/business"

const router = useRouter()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

const { showNotify, showThemeSwitch, showScreenfull } = storeToRefs(settingsStore)

/** 登出 */
const logout = () => {
  userStore.logout()
  router.push("/login")
}

// 返回首页
const toHome = () => {
  router.push("/")
}
const props = defineProps({
  showSidebar: {
    type: Boolean,
    default: true
  }
})

const projectList = ref<ProjectInfoResponseData[]>([])
const projectId = ref<number>(JSON.parse(localStorage.getItem("projectId") || "0"))

// id 变化后刷新页面
watch(projectId, (newId: number) => {
  if (!newId || !props.showSidebar) return
  localStorage.setItem("projectId", String(newId))
  const { mold } = projectList.value.find((item) => {
    return item.id === newId
  })
  localStorage.setItem("mold", mold)
  window.location.reload()
})

onMounted(async () => {
  await getProjectList(props.showSidebar)
})

// 获取项目列表
const getProjectList = async (value: boolean) => {
  if (value) {
    const { items } = (await apiGetProjectList({name: "", total: 0, page: 1, pageSize: 99999 })).data
    projectList.value = items
  }
}
</script>

<template>
  <div class="right-menu">
    <Screenfull v-if="showScreenfull" class="right-menu-item" />
    <ThemeSwitch v-if="showThemeSwitch" class="right-menu-item" />
    <Notify v-if="showNotify" class="right-menu-item" />
    <el-select
      v-if="props.showSidebar"
      v-model="projectId"
      placeholder="切换项目"
      size="small"
      class="right-menu-item"
      style="width: 100px"
      filterable
      @visible-change="getProjectList"
    >
      <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-dropdown class="right-menu-item">
      <div class="right-menu-avatar">
        <el-avatar :icon="UserFilled" :src="userStore.avatar ? userStore.avatar : ''" :size="36" />
        <span>{{ userStore.username }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <a target="_blank" href="https://juejin.cn/post/7089377403717287972">
            <el-dropdown-item>中文文档</el-dropdown-item>
          </a>
          <a target="_blank" href="https://github.com/un-pany/v3-admin-vite">
            <el-dropdown-item>GitHub</el-dropdown-item>
          </a>
          <a target="_blank" href="https://gitee.com/un-pany/v3-admin-vite">
            <el-dropdown-item>Gitee</el-dropdown-item>
          </a>
          <el-dropdown-item v-if="props.showSidebar" divided @click="toHome">
            <span style="display: block">返回首页</span>
          </el-dropdown-item>
          <el-dropdown-item :divided="!props.showSidebar" @click="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped lang="scss">
.right-menu {
  height: 100%;
  display: flex;
  align-items: center;
  color: #606266;
  .right-menu-item {
    padding: 0 10px;
    cursor: pointer;
    .right-menu-avatar {
      display: flex;
      align-items: center;
      margin-right: 10px;
      .el-avatar {
        margin-right: 10px;
      }
      span {
        font-size: 16px;
      }
    }
  }
}
</style>
