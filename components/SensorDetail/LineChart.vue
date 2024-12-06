<!--
 * LineChart Component
 * 
 * This component renders a line chart for sensor data using D3.js.
 * It supports zooming, brushing, and dynamic updates based on global date range changes.
 * 
 * @displayName LineChart
 * @usage
 * <LineChart
 *   :metric="{ label: 'Temperature (°C)' }"
 *   :data="{ data: [...], min: 0, max: 100 }"
 *   :width="600"
 *   :height="300"
 *   :margin="{ top: 20, right: 20, bottom: 30, left: 40 }"
 * />
 -->

<template>
  <div
    :id="chartId"
    class="relative w-full"
    :style="{ height: `${height}px` }"
    data-testid="chart-container"
    ref="chartContainer"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useDashboardStore } from '../../stores/dashboard'
import { storeToRefs } from 'pinia'
import { useResizeObserver } from '@vueuse/core'

const props = defineProps({
  metric: {
    type: Object,
    required: true,
    default: () => ({ label: '' }),
  },
  data: {
    type: Object,
    required: true,
    default: () => ({
      data: [],
      min: 0,
      max: 100,
    }),
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 300,
  },
})

const emit = defineEmits(['date-range-update'])

const store = useDashboardStore()
const { dataDashboardValues, dateRangeUpdate } = storeToRefs(store)
const { updateDataDashboardValues } = store

const chartId = ref(`chart-${Date.now()}`)
let chartInstance: echarts.ECharts | null = null

const chartContainer = ref<HTMLElement | null>(null)

useResizeObserver(chartContainer, (entries) => {
  const entry = entries[0]
  if (entry && chartInstance) {
    nextTick(() => {
      chartInstance.resize()
    })
  }
})

const createChart = () => {
  if (!props.data?.data || props.data.data.length === 0) {
    console.warn('Invalid or empty data received:', props.data)
    return
  }

  nextTick(async () => {
    if (!chartContainer.value) return

    if (chartInstance) {
      chartInstance.dispose()
    }

    await nextTick()

    chartInstance = echarts.init(chartContainer.value)

    const START_YEAR = 2020
    const minValidDate = new Date(START_YEAR, 0, 1).getTime()

    const chartData = props.data.data
      .filter((d) => {
        if (!d || !d.date || d.value === undefined || isNaN(Number(d.value))) {
          return false
        }

        const date =
          typeof d.date === 'string'
            ? /^\d+$/.test(d.date)
              ? new Date(parseInt(d.date))
              : new Date(d.date)
            : new Date(d.date)

        return !isNaN(date.getTime()) && date.getTime() >= minValidDate
      })
      .map((d) => {
        const date =
          typeof d.date === 'string'
            ? /^\d+$/.test(d.date)
              ? new Date(parseInt(d.date))
              : new Date(d.date)
            : new Date(d.date)
        return [date.getTime(), d.value]
      })
      .sort((a, b) => a[0] - b[0])

    if (chartData.length === 0) {
      console.warn('No valid data after 2020')
      return
    }

    const startTime = chartData[0]?.[0]
    const endTime = chartData[chartData.length - 1]?.[0]

    const option: echarts.EChartsOption = {
      grid: {
        top: 60,
        right: 20,
        bottom: 60,
        left: 50,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%']
        },
        formatter: function (params: any) {
          const date = new Date(params[0].value[0])
          const value = params[0].value[1]
          return `${date.toLocaleString()}<br/>${
            props.metric.label
          }: ${value.toFixed(2)}`
        },
      },
      title: {
        left: 'center',
        text: props.metric.label,
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        min: startTime,
        max: endTime,
        axisLabel: {
          formatter: function (value: number) {
            const date = new Date(value)
            return date.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
            })
          },
          interval: 'auto',
          rotate: 0,
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          alignWithLabel: true,
          interval: 'auto',
        },
        axisPointer: {
          label: {
            formatter: function (params: any) {
              const date = new Date(params.value)
              return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min: props.data.min,
        max: props.data.max,
        axisLabel: {
          formatter: function (value: number) {
            return value.toFixed(1)
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          onZoom: handleZoom,
        },
        {
          type: 'slider',
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          name: props.metric.label,
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {
            opacity: 0.3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(55, 162, 255)',
              },
              {
                offset: 1,
                color: 'rgb(116, 21, 219)',
              },
            ]),
          },
          lineStyle: {
            width: 1,
          },
          data: chartData,
        },
      ],
    }

    chartInstance.setOption(option)

    nextTick(() => {
      chartInstance?.resize()
    })
  })
}

const handleZoom = (params: any) => {
  if (!chartInstance) return

  const option = chartInstance.getOption()
  const xAxis = option.xAxis as any
  if (!xAxis?.[0]?.data) return

  const startValue =
    xAxis[0].data[Math.floor((params.start * xAxis[0].data.length) / 100)]
  const endValue =
    xAxis[0].data[Math.floor((params.end * xAxis[0].data.length) / 100)]

  emit('date-range-update', [new Date(startValue), new Date(endValue)])
  updateDataDashboardValues('dateRange', [
    new Date(startValue),
    new Date(endValue),
  ])
}

const handleResize = () => {
  if (chartInstance) {
    nextTick(() => {
      chartInstance.resize()
    })
  }
}

const resetChart = () => {
  if (!chartInstance) return

  chartInstance.dispatchAction({
    type: 'dataZoom',
    start: 0,
    end: 100,
  })

  updateDataDashboardValues('dateRange', [])
}

watch(
  [() => props.data, () => props.width, () => props.height],
  () => {
    if (props.data?.data) {
      nextTick(() => {
        createChart()
      })
    }
  },
  { deep: true }
)

watch(dateRangeUpdate, () => {
  if (chartInstance && dataDashboardValues.value.dateRange.length === 2) {
    const dates = dataDashboardValues.value.dateRange
    const option = chartInstance.getOption()
    const data = (option.series as any)[0].data

    const startIndex = data.findIndex((d: any) => d[0] >= dates[0].getTime())
    const endIndex = data.findIndex((d: any) => d[0] >= dates[1].getTime())

    const start = (startIndex / data.length) * 100
    const end = (endIndex / data.length) * 100

    chartInstance.dispatchAction({
      type: 'dataZoom',
      start,
      end,
    })
  }
})

onMounted(() => {
  nextTick(async () => {
    await createChart()
    setTimeout(() => {
      chartInstance?.resize()
    }, 100)
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>
