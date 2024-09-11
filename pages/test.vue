<template>
  <div class="nvidia-analysis-preview">
    <div ref="chart" style="width: 100%; height: 400px"></div>
    <div class="controls">
      <div>
        <label for="priceAdjust">Adjust Price:</label>
        <input
          id="priceAdjust"
          type="range"
          min="-50"
          max="50"
          v-model="priceAdjust"
          @input="updateChart"
        />
        <span>{{ priceAdjust }}%</span>
      </div>
      <div>
        <label for="timeRange">Time Range:</label>
        <select id="timeRange" v-model="timeRange" @change="updateChart">
          <option value="3">3 months</option>
          <option value="6">6 months</option>
          <option value="12">1 year</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'NvidiaTechnicalAnalysisPreview',
  setup() {
    const chart = ref(null)
    let chartInstance = null
    const priceAdjust = ref(0)
    const timeRange = ref(6)

    const originalData = [
      {
        date: '2023-09',
        price: 450,
        rsi: 70,
        macd: 15,
        upperBand: 480,
        lowerBand: 420,
      },
      {
        date: '2023-10',
        price: 470,
        rsi: 75,
        macd: 18,
        upperBand: 500,
        lowerBand: 440,
      },
      {
        date: '2023-11',
        price: 490,
        rsi: 80,
        macd: 20,
        upperBand: 520,
        lowerBand: 460,
      },
      {
        date: '2023-12',
        price: 480,
        rsi: 65,
        macd: 10,
        upperBand: 510,
        lowerBand: 450,
      },
      {
        date: '2024-01',
        price: 500,
        rsi: 72,
        macd: 16,
        upperBand: 530,
        lowerBand: 470,
      },
      {
        date: '2024-02',
        price: 520,
        rsi: 78,
        macd: 22,
        upperBand: 550,
        lowerBand: 490,
      },
      {
        date: '2024-03',
        price: 510,
        rsi: 70,
        macd: 18,
        upperBand: 540,
        lowerBand: 480,
      },
      {
        date: '2024-04',
        price: 530,
        rsi: 76,
        macd: 20,
        upperBand: 560,
        lowerBand: 500,
      },
      {
        date: '2024-05',
        price: 550,
        rsi: 82,
        macd: 24,
        upperBand: 580,
        lowerBand: 520,
      },
      {
        date: '2024-06',
        price: 540,
        rsi: 68,
        macd: 14,
        upperBand: 570,
        lowerBand: 510,
      },
      {
        date: '2024-07',
        price: 560,
        rsi: 74,
        macd: 19,
        upperBand: 590,
        lowerBand: 530,
      },
      {
        date: '2024-08',
        price: 580,
        rsi: 80,
        macd: 25,
        upperBand: 610,
        lowerBand: 550,
      },
    ]

    const adjustData = (data, adjustment) => {
      return data.map((item) => ({
        ...item,
        price: item.price * (1 + adjustment / 100),
        upperBand: item.upperBand * (1 + adjustment / 100),
        lowerBand: item.lowerBand * (1 + adjustment / 100),
      }))
    }

    const updateChart = () => {
      if (!chartInstance) return

      const adjustedData = adjustData(originalData, priceAdjust.value)
      const displayData = adjustedData.slice(-timeRange.value)

      const option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: [
            'Price',
            'RSI',
            'MACD',
            'Upper Bollinger Band',
            'Lower Bollinger Band',
          ],
        },
        xAxis: {
          type: 'category',
          data: displayData.map((item) => item.date),
        },
        yAxis: [
          {
            type: 'value',
            name: 'Price',
            position: 'left',
          },
          {
            type: 'value',
            name: 'Indicators',
            position: 'right',
          },
        ],
        series: [
          {
            name: 'Price',
            type: 'line',
            data: displayData.map((item) => item.price),
            yAxisIndex: 0,
          },
          {
            name: 'RSI',
            type: 'line',
            data: displayData.map((item) => item.rsi),
            yAxisIndex: 1,
          },
          {
            name: 'MACD',
            type: 'line',
            data: displayData.map((item) => item.macd),
            yAxisIndex: 1,
          },
          {
            name: 'Upper Bollinger Band',
            type: 'line',
            data: displayData.map((item) => item.upperBand),
            yAxisIndex: 0,
          },
          {
            name: 'Lower Bollinger Band',
            type: 'line',
            data: displayData.map((item) => item.lowerBand),
            yAxisIndex: 0,
          },
        ],
      }

      chartInstance.setOption(option)
    }

    onMounted(() => {
      chartInstance = echarts.init(chart.value)
      updateChart()
      window.addEventListener('resize', () => {
        chartInstance.resize()
      })
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.dispose()
      }
    })

    watch([priceAdjust, timeRange], updateChart)

    return {
      chart,
      priceAdjust,
      timeRange,
      updateChart,
    }
  },
}
</script>

<style scoped>
.nvidia-analysis-preview {
  font-family: Arial, sans-serif;
}
.controls {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
.controls div {
  display: flex;
  align-items: center;
}
.controls label {
  margin-right: 10px;
}
</style>
