<template>
  <div class="stock-chart">
    <div class="stock-chart-box">
      <!-- 分时图 -->
      <v-chart ref="vchart" class="chart" v-if="showCharts" :option="options" :update-options="{ notMerge: true }" />

      <div class="fix-up up" v-if="showCharts">
        <div>{{ limitUp }}</div>
        <div>{{ pctChangeUp }}%</div>
      </div>

      <div class="fix-down down" v-if="showCharts">
        <div>{{ limitDown }}</div>
        <div>{{ pctChangeDown }}%</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick, onBeforeMount, onBeforeUnmount, onMounted } from "vue"
import "echarts"
import VChart from "vue-echarts"
import { apiGetTestTime } from "@/api/test/test"

onMounted(() => {
  initChart()
})

// vchart组件的引用
const vchart = ref<any>(null)
// 昨日收盘价
const close = ref<number>(0)
// 最高价
const limitUp = ref<number>(0)
// 最低价
const limitDown = ref<number>(0)
// 最高涨幅
const pctChangeUp = ref<number>(0)
// 最低跌幅
const pctChangeDown = ref<number>(0)

// 控制图表展示
const showCharts = ref<boolean>(false)

// 图表配置项
const options = reactive({
  animation: false,
  grid: [
    {
      show: false,
      id: "gd1",
      top: "4%",
      left: "4%",
      right: "4%",
      bottom: "40%"
    },
    {
      show: false,
      id: "gd2",
      top: "4%",
      left: "4%",
      right: "4%",
      bottom: "40%"
    },
    {
      show: false,
      id: "gd3",
      top: "60%",
      left: "4%",
      right: "4%",
      bottom: "8%"
    },
    {
      show: true,
      id: "gd4",
      top: "4%",
      left: "4%",
      right: "4%",
      bottom: "8%",
      borderColor: "#2b2f39"
    }
  ],
  color: ["#FFFFFF", "#E6A23C"],
  blendMode: "source-over",
  xAxis: [] as any[],
  yAxis: [] as any[],
  series: [] as any[],
  tooltip: {}
})

function fomatFloat(src: any, pos = 2) {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos)
}

const initChart = async () => {
  limitUp.value = 12.18
  limitDown.value = 11.83
  const { time, prices, avgPrices, ratios, ratiosValue, volume } = (await apiGetTestTime()).data
  const xTimes = time
  const volumes = volume

  // 现价图图表四角的数据
  // 最大差值：昨日收盘价 - 股票信息中的最高价 对比 昨日收盘价 - 股票信息中的最低价 取绝对值 ，两者哪个相差比较大就用哪个差值
  // 最高价：昨日收盘价 + 最大差值
  // 最低价：昨日收盘价 - 最大差值
  // 最高涨幅：((昨日收盘价 + 最大差值) - 1) * 100
  // 最低跌幅：-((昨日收盘价 + 最大差值) - 1) * 100
  const maxSplit =
    Math.abs(limitUp.value - close.value) > Math.abs(close.value - limitDown.value)
      ? Math.abs(limitUp.value - close.value)
      : Math.abs(close.value - limitDown.value)
  limitUp.value = fomatFloat(Number(close.value + maxSplit))
  limitDown.value = fomatFloat(Number(close.value - maxSplit))
  pctChangeUp.value = fomatFloat((limitUp.value / close.value - 1) * 100)
  pctChangeDown.value = pctChangeUp.value > 0 ? fomatFloat(0 - pctChangeUp.value) : fomatFloat(pctChangeUp.value)

  options["xAxis"] = [
    {
      //主图
      gridIndex: 0,
      show: true,
      type: "category",
      splitNumber: 4,
      data: xTimes,
      axisLine: {
        lineStyle: {
          color: "#2b2f39"
        }
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisPointer: {
        fontSize: 10,
        label: {
          show: false
        }
      },
      splitLine: {
        show: true,
        interval: 60,
        lineStyle: {
          color: "#2b2f39",
          width: 1
        }
      }
    },
    {
      gridIndex: 1,
      show: false,
      splitNumber: 20,
      data: xTimes,
      axisLabel: {
        show: false
      },
      axisPointer: {
        label: {
          color: "#ffffff",
          backgroundColor: "#6E7079",
          fontSize: 10
        }
      },
      splitLine: {
        show: false
      }
    },
    {
      //交易量图
      show: true,
      gridIndex: 2,
      type: "category",
      max: 240,
      axisLabel: {
        color: "#bcbcbc",
        fontSize: 10,
        interval: 59
      },
      data: xTimes,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisPointer: {
        show: true,
        label: {
          color: "#ffffff",
          backgroundColor: "#6E7079",
          fontSize: 10
        },
        lineStyle: {
          type: "solid",
          width: 0.5
        }
      },
      splitLine: {
        show: true,
        interval: 60,
        lineStyle: {
          color: "#2b2f39",
          width: 1
        }
      }
    },
    {
      //交易量图
      show: false,
      gridIndex: 3,
      type: "category",
      axisLabel: {
        fontSize: 10,
        color: "#bcbcbc",
        interval: 29 //时间间隔29个元素显示
      },
      data: xTimes,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisPointer: {
        show: true,
        label: {
          color: "#ffffff",
          backgroundColor: "#6E7079",
          fontSize: 10
        },
        lineStyle: {
          type: "solid",
          width: 0.5
        }
      }
    }
  ]
  options["yAxis"] = [
    {
      show: true,
      scale: true,
      gridIndex: 0,
      boundaryGap: false,
      min: limitDown.value,
      max: limitUp.value,
      axisLabel: {
        show: false,
        inside: false,
        fontSize: 10,
        color: "#FFFFFF"
      },
      z: 2,
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisPointer: {
        show: true,
        label: {
          color: "#ffffff",
          backgroundColor: "#6E7079",
          fontSize: 10,
          formatter: function ({ value }: any) {
            return fomatFloat(value, 2)
          }
        },
        lineStyle: {
          type: "solid",
          width: 0.5
        }
      }
    },
    {
      show: false,
      scale: true,
      gridIndex: 1,
      min: pctChangeDown.value,
      max: pctChangeUp.value,
      position: "right",
      z: 3,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        inside: false,
        fontSize: 10,
        color: "#FFFFFF",
        formatter: function (value: any) {
          return value + "%"
        }
      },
      splitLine: {
        show: false
      },
      axisPointer: {
        show: true,
        label: {
          color: "#ffffff",
          backgroundColor: "#6E7079",
          fontSize: 10,
          formatter: function ({ value }: any) {
            return fomatFloat(value, 2) + "%"
          }
        },
        lineStyle: {
          type: "solid",
          width: 0.5
        }
      }
    },
    {
      gridIndex: 2,
      z: 4,
      scale: true,
      type: "value",
      splitNumber: 1,
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisPointer: {
        fontSize: 10,
        label: {
          formatter: function ({ value }: any) {
            return fomatFloat(value / 10000, 0) + "万"
          }
        },
        lineStyle: {
          type: "solid",
          width: 0.5
        }
      }
    },
    {
      position: "right",
      gridIndex: 3,
      z: 5,
      scale: true,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    }
  ]
  options["series"] = [
    {
      name: "涨幅",
      type: "line",
      data: ratios,
      smooth: true,
      symbol: "none",
      gridIndex: 3,
      z: 2,
      lineStyle: {
        opacity: 0.8,
        color: "#FFFFFF",
        width: 1
      },
      markLine: {
        silent: true,
        symbol: "none",
        label: {
          show: true,
          distance: [-30, 0]
        },
        lineStyle: {
          color: "#2B2F39",
          opacity: 1,
          type: "dashed"
        },
        data: [
          {
            yAxis: close.value,
            lineStyle: {
              color: "#2b2f39"
            },
            label: {
              position: "end",
              color: "#999999",
              fontWeight: "bold",
              fontSize: 10,
              formatter: function () {
                return "0.00%"
              }
            }
          },
          {
            yAxis: close.value,
            lineStyle: {
              color: "#2b2f39"
            },
            label: {
              fontSize: 10,
              fontWeight: "bold",
              color: "#999999",
              position: "start",
              formatter: function (params: any) {
                return fomatFloat(params.value, 2)
              }
            }
          }
        ]
      },
      emphasis: {
        focus: "none",
        scale: false,
        disabled: "none",
        lineStyle: {
          width: 1
        }
      }
    },
    {
      name: "均价",
      type: "line",
      data: avgPrices,
      smooth: true,
      symbol: "none",
      gridIndex: 0,
      xAxisIndex: 0,
      yAxisIndex: 0,
      z: 5,
      lineStyle: {
        opacity: 0.8,
        color: "#E6A23C",
        width: 1
      },
      emphasis: {
        focus: "none",
        scale: false,
        disabled: "none",
        lineStyle: {
          width: 1
        }
      }
    },
    {
      name: "涨跌",
      type: "line",
      data: ratiosValue,
      smooth: true,
      color: "#67C23A",
      symbol: "none",
      lineStyle: {
        width: 0
      }
    },
    {
      name: "当前价格",
      type: "line",
      data: prices,
      smooth: true,
      color: "#FFFFFF",
      symbol: "none",
      lineStyle: {
        width: 0
      }
    },
    {
      name: "成交额",
      type: "bar",
      smooth: true,
      symbol: "none",
      gridIndex: 2,
      xAxisIndex: 2,
      yAxisIndex: 2,
      data: volumes,
      barWidth: "10%",
      itemStyle: {
        color: function ({ dataIndex }: any) {
          if (prices[dataIndex] > prices[dataIndex - 1]) {
            /** 黄色 */
            return "#E6A23C"
          } else if (prices[dataIndex] === prices[dataIndex - 1]) {
            return "#FFFFFF"
          } else {
            return "#67C23A"
          }
        }
      }
    }
  ]
  options["tooltip"] = {
    trigger: "axis", // 触发类型，根据需要选择，这里以鼠标悬停触发
    axisPointer: {
      type: "cross", // 设置指示器类型为十字准星指示器
      label: {
        backgroundColor: "#6a7985" // 设置标签背景颜色
      }
    },
    backgroundColor: "#141923"
  }
  nextTick(() => {
    showCharts.value = true
  })
}

const resizeTheChart = () => {
  if (vchart.value) {
    vchart.value.resize && vchart.value.resize()
  }
}

onBeforeMount(() => {
  window.addEventListener("resize", resizeTheChart, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeTheChart)
})
</script>
<style scoped>
.stock-chart {
  width: 100vw;
  height: 100vh;
  background-color: #141923;
}
.stock-chart-box {
  position: relative;
  width: 100%;
  height: 6rem;
  z-index: 9;
}
.chart {
  height: 93vh;
}
.fix-up,
.fix-down {
  position: absolute;
  left: 0;
  right: 0;
  color: #414141;
  font-size: 0.24rem;
  width: 100%;
  padding-left: 5%;
  padding-right: 5%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fix-up {
  top: 5%;
}
.fix-down {
  bottom: 40%;
}
</style>
