<template>
  <Line :data="chartData" :options="options" class="w-full h-15" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler)

const props = defineProps<{
  data: number[]
  borderColor?: string
}>()

const chartData = {
  labels: props.data.map(() => ''),
  datasets: [
    {
      data: props.data,
      borderColor: props.borderColor || '#2b7fff',
      backgroundColor: (ctx: any) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 80)
        gradient.addColorStop(0, `${props.borderColor || '#2b7fff'}33`)
        gradient.addColorStop(1, `${props.borderColor || '#2b7fff'}00`)
        return gradient
      },
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0
    }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  scales: {
    x: {
      display: false,
      grid: { display: false }
    },
    y: {
      display: false,
      grid: { display: false },
      suggestedMin: Math.min(...props.data) - 2,
      suggestedMax: Math.max(...props.data) + 2
    }
  }
}
</script>
