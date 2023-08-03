<script setup lang="ts">
import { reactive } from "vue"

interface TimelineItem {
  timestamp: string
  title: string
  content: string
}

const timeLine: TimelineItem[] = reactive([
  {
    timestamp: "2019/4/20",
    title: "Update Github template",
    content: "PanJiaChen committed 2019/4/20 20:46"
  },
  {
    timestamp: "2019/4/21",
    title: "Update Github template",
    content: "PanJiaChen committed 2019/4/21 20:46"
  }
])
</script>

<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item, index) of timeLine" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style scoped lang="scss"></style>
