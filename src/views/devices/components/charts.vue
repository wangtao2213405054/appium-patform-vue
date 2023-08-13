<script setup lang="ts">
import * as echarts from "echarts/core"
import {onMounted, inject, onBeforeUnmount, ref} from "vue"
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption
} from "echarts/components"
import { LineChart, LineSeriesOption } from "echarts/charts"
import { UniversalTransition } from "echarts/features"
import { CanvasRenderer } from "echarts/renderers"
import { Socket } from "socket.io-client"
import { useRoute } from "vue-router"
import { MasterSocketChartsData } from "@/api/devices/types/master"
import { Warning } from "@element-plus/icons-vue"

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
>

const option: EChartsOption = {
  title: {
    text: "性能表"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#606266"
      }
    }
  },
  color: ["#67C23A", "#E6A23C"],
  textStyle: {
    color: "#606266"
  },
  legend: {
    data: ["处理器", "运行内存"]
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: []
    }
  ],
  yAxis: [
    {
      type: "value",
      name: "( % )"
    }
  ],
  series: [
    {
      name: "处理器",
      type: "line",
      stack: "Total",
      emphasis: {
        focus: "series"
      },
      data: [],
      areaStyle: {}
    },
    {
      name: "运行内存",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: []
    }
  ]
}
const socket: Socket = inject("socket")
const route = useRoute()
const roomId = route.params.id
const masterId = route.params.masterId
let performanceChart: echarts.EChartsType = null
const free = ref<string>("")
const used = ref<string>("")
const total = ref<string>("")
const usedPercent = ref<number>(null)
const freePercent = ref<number>(null)
const send = ref<number>(null)
const recv = ref<number>(null)
const virtualTotal = ref<string>("")
const available = ref<string>("")
const availablePercent = ref<number>(null)
const cpuCount = ref<number>(null)
const cpuPercent = ref<number>(null)
const datePart = ref<string>("")
const timePart = ref<string>("")
const virtualUsed = ref<number>(null)
const loading = ref<boolean>(true)

onMounted(() => {
  loading.value = true
  const chartDom = document.getElementById("main")!
  performanceChart = echarts.init(chartDom)

  socket.emit("joinRoom", { roomId: roomId })
  socket.on(`clientSystemInfo${masterId}`, (data: MasterSocketChartsData) => {
    if (option.xAxis[0].data.length >= 300) {
      option.xAxis[0].data.splice(0, 1)
      option.series[0].data.splice(0, 1)
      option.series[1].data.splice(0, 1)
    }
    option.xAxis[0].data.push(data.currentTime)
    option.series[0].data.push(data.cpu.percent)
    option.series[1].data.push(data.virtual.percent)
    performanceChart.setOption(option)
    // 磁盘
    free.value = data.disk.free
    used.value = data.disk.used
    total.value = data.disk.total
    usedPercent.value = data.disk.percent * 100
    freePercent.value = parseFloat((100 - data.disk.percent * 100).toFixed(2))
    // 网络
    send.value = data.network.send
    recv.value = data.network.recv
    // 内存
    virtualTotal.value = data.virtual.total
    available.value = data.virtual.available
    virtualUsed.value = data.virtual.percent
    availablePercent.value = parseFloat((100 - data.virtual.percent).toFixed(2))
    // CPU
    cpuCount.value = data.cpu.count
    cpuPercent.value = parseFloat((100 - data.cpu.percent).toFixed(2))
    // 开机时间
    const [_datePart, _timePart] = data.startedTime.split(" ")
    datePart.value = _datePart
    timePart.value = _timePart
  })
  loading.value = false
})

onBeforeUnmount(() => {
  if (performanceChart) {
    performanceChart.dispose()
  }
  socket.emit("leaveRoom", { roomId: roomId })
  socket.off(`clientSystemInfo${masterId}`)
})
</script>

<template>
  <el-card v-loading="loading">
    <el-row :gutter="16">
      <el-col :span="6">
        <div class="el-statistic">
          <div class="el-statistic__head" style="display: inline-flex; align-items: center">
            网络情况
            <el-tooltip effect="dark" content="当前控制机网络使用情况 上传/下载 单位 KB" placement="top">
              <el-icon style="margin-left: 4px" :size="12">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
          <div class="el-statistic__content">{{ send }}KB/s / {{ recv }}KB/s</div>
        </div>
        <div class="countdown-footer">
          <span>上传 / 下载</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="el-statistic">
          <div class="el-statistic__head" style="display: inline-flex; align-items: center">
            磁盘空间
            <el-tooltip effect="dark" content="当前控制机磁盘空间总容量" placement="top">
              <el-icon style="margin-left: 4px" :size="12">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
          <div class="el-statistic__content">{{ total }}</div>
        </div>
        <div class="countdown-footer">
          <span>强迫症需要点什么 ...</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="el-statistic">
          <div class="el-statistic__head" style="display: inline-flex; align-items: center">
            已用空间
            <el-tooltip effect="dark" content="当前控制机磁盘空间已用容量" placement="top">
              <el-icon style="margin-left: 4px" :size="12">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
          <div class="el-statistic__content">{{ used }}</div>
        </div>
        <div class="countdown-footer">
          <span>已用空间占比</span>
          <span class="red">{{ usedPercent }}%</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="el-statistic">
          <div class="el-statistic__head" style="display: inline-flex; align-items: center">
            剩余空间
            <el-tooltip effect="dark" content="当前控制机磁盘空间剩余容量" placement="top">
              <el-icon style="margin-left: 4px" :size="12">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
          <div class="el-statistic__content">{{ free }}</div>
        </div>
        <div class="countdown-footer">
          <span>剩余空间占比</span>
          <span class="green">{{ freePercent }}%</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="el-statistic">
          <div class="el-statistic__head" style="display: inline-flex; align-items: center">
            开机时间
            <el-tooltip effect="dark" content="当前控制机开机时间" placement="top">
              <el-icon style="margin-left: 4px" :size="12">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
          <div class="el-statistic__content">{{ timePart }}</div>
        </div>
        <div class="countdown-footer">
          {{ datePart }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="el-statistic">
          <div class="el-statistic__head" style="display: inline-flex; align-items: center">
            运行内存
            <el-tooltip effect="dark" content="当前控制机运行内存容量" placement="top">
              <el-icon style="margin-left: 4px" :size="12">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
          <div class="el-statistic__content">{{ virtualTotal }}</div>
        </div>
        <div class="countdown-footer">
          <span>已用内存占比</span>
          <span :class="virtualUsed < 50 ? 'green' : 'red'">{{ virtualUsed }}%</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="el-statistic">
          <div class="el-statistic__head" style="display: inline-flex; align-items: center">
            逻辑核心
            <el-tooltip effect="dark" content="当前控制机CPU的逻辑核心数量" placement="top">
              <el-icon style="margin-left: 4px" :size="12">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
          <div class="el-statistic__content">{{ cpuCount }}</div>
        </div>
        <div class="countdown-footer">
          <span>可用处理器占比</span>
          <span :class="cpuPercent > 50 ? 'green' : 'red'">{{ cpuPercent }}%</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="el-statistic">
          <div class="el-statistic__head" style="display: inline-flex; align-items: center">
            可用内存
            <el-tooltip effect="dark" content="当前控制机可使用的运行内存" placement="top">
              <el-icon style="margin-left: 4px" :size="12">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
          <div class="el-statistic__content">{{ available }}</div>
        </div>
        <div class="countdown-footer">
          <span>可用内存占比</span>
          <span :class="availablePercent > 50 ? 'green' : 'red'">{{ availablePercent }}%</span>
        </div>
      </el-col>
    </el-row>
    <div id="main" style="height: 300px" />
  </el-card>
</template>

<style scoped lang="scss">
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.green {
  color: var(--el-color-success);
  margin-left: 4px;
}

.red {
  color: var(--el-color-error);
  margin-left: 4px;
}

.el-col {
  text-align: center;
  padding: 10px;
}
.el-row {
  margin-bottom: 20px;
}

.countdown-footer {
  margin-top: 12px;
  font-size: 12px;
  color: var(--el-text-color-regular);
}
</style>
