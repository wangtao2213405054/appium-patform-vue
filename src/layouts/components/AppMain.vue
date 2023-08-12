<script lang="ts" setup>
import { useRoute } from "vue-router"
import { useTagsViewStore } from "@/store/modules/tags-view"
import { computed } from "vue"
// import { onMounted, onUnmounted, computed } from "vue"
// import { mark } from "@/utils/watermark"
// import { useUserStore } from "@/store/modules/user"

const route = useRoute()
const tagsViewStore = useTagsViewStore()
// const userStore = useUserStore()

const key = computed(() => {
  // 返回 route.path 和 route.fullPath 有着不同的效果，大多数时候 path 更通用
  return route.path
})

// const { watermark } = mark()
// onMounted(() => {
//   watermark(userStore.username) //水印名
// })
//
// onUnmounted(() => {
//   watermark("")
// })
</script>

<template>
  <section class="app-main">
    <div class="app-scrollbar">
      <router-view v-slot="{ Component }">
        <transition name="el-fade-in" mode="out-in">
          <keep-alive :include="tagsViewStore.cachedViews">
            <component :is="Component" :key="key" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.app-main {
  width: 100%;
  background-color: var(--v3-body-bg-color);
}

.app-scrollbar {
  height: 100%;
  overflow: auto;
  @include scrollbar;
}
</style>
