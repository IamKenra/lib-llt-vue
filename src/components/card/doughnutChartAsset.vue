<template>
  <Card>
    <template #content>
      <div class="p-4">
        <h2 class="!text-xl !font-medium !text-gray-700 !p-2 !mb-2">Asset Overview</h2>

      <!-- Doughnut Chart -->
      <div class="flex justify-center p-4 mb-6">
        <Doughnut :data="chartData" :options="chartOptions" class="" />
      </div>

      <!-- Summary List -->
      <div class="space-y-2">
        <div
          v-for="item in summaryItems"
          :key="item.label"
          class="flex justify-between items-center bg-gray-50 rounded-md px-4 py-2 text-sm !mb-2 shadow-sm"
        >
          <span class="text-gray-600 font-medium">{{ item.label }}</span>
          <span class="text-gray-800 font-semibold">{{ item.value }}</span>
        </div>
      </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartData,
  ChartOptions
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartData: ChartData<'doughnut'> = {
  labels: ['Functional', 'Need Attention', 'Not Functional'],
  datasets: [
    {
      data: [100, 15, 5],
      backgroundColor: ['#4BD983', '#F2C23A', '#FB4C55'],
      borderWidth: 2
    }
  ]
}

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  cutout: '70%',
  plugins: {
    legend: { display: false }
  }
}

const summaryItems = [
  { label: 'Total Assets', value: 120 },
  { label: 'Functional', value: 100 },
  { label: 'Need Attention', value: 15 },
  { label: 'Not Functional', value: 5 }
]
</script>
