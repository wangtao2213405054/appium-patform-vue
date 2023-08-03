<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import introduce from './components/introduce.vue'
import { useUserStore } from "@/store/modules/user"
import { Plus } from "@element-plus/icons-vue"
import {b} from "vitest/dist/types-198fd1d9";
import Project from './components/Project.vue';
// import Timeline from './components/Timeline.vue';
// import Account from './components/AccountTree.vue';
// import PermissionsMenu from '@/views/home/components/PermissionsMenu.vue';
// import Role from '@/views/home/components/Role.vue';

const userStore = useUserStore()
const activeTab = ref<string>('activity')
const dialogVisible = ref<boolean>(true)

interface permissionInterface {
  userControl: boolean
  roleControl: boolean
  menuControl: boolean
}
const permissionInfo: permissionInterface = reactive({
  userControl: false,
  roleControl: false,
  menuControl: false,
})

onMounted(() => {
  getRoles();
})

const getRoles = () => {
  if (userStore.roles.includes('admin')) {
    for (const key in permissionInfo) {
      permissionInfo[key] = true
    }
  } else {
    // 新增页面时需要向此list中添加绑定
    const permissions = [
      { identifier: 'user', value: 'userControl' },
      { identifier: 'role', value: 'roleControl' },
      { identifier: 'menu', value: 'menuControl' },
    ];
    permissions.forEach((items) => {
      const { identifier, value } = items;
      if (userStore.roles.includes(identifier)) {
        permissionInfo[value] = true;
      }
    })
  }
}

const createProject = () => {
  dialogVisible.value = false
}
</script>

<template>
  <div class="home-page">
    <div>
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <introduce />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="项目列表" name="activity">
                <project v-model:dialogVisible="dialogVisible" />
              </el-tab-pane>
              <el-tab-pane label="更新日志" name="timeline">
<!--                <timeline />-->
              </el-tab-pane>
<!--              <el-tab-pane v-if="permissionInfo.userControl" label="用户管理" name="account">-->
<!--                <account />-->
<!--              </el-tab-pane>-->
<!--              <el-tab-pane v-if="permissionInfo.roleControl" label="角色管理" name="role">-->
<!--                <role />-->
<!--              </el-tab-pane>-->
<!--              <el-tab-pane v-if="permissionInfo.menuControl" label="菜单管理" name="menu">-->
<!--                <permissions-menu />-->
<!--              </el-tab-pane>-->
            </el-tabs>
            <div v-if="activeTab === 'activity'" class="new-project">
              <div>
                <el-button type="primary" :icon="Plus" plain @click="createProject">新建</el-button>
              </div>
            </div>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  padding: 20px
}
.new-project {
  position: absolute;
  right: 30px;
  top: 23px;
  font-weight: 600;
  font-size: 14px;
}
</style>
