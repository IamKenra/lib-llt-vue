<template>
  <Card class="relative p-4">

      <template #title>
        <div class="!text-xl !font-medium !text-center !text-gray-700 !p-2">Overall Condition</div>
      </template>

    <!-- Tombol Switch Chart -->
    <!-- <Button
      icon="pi pi-chart-bar"
      class="absolute top-2 right-2 p-button-text"
      @click="switchChart"
      v-tooltip.bottom="'Switch to bar chart'"
    /> -->

    <!-- Content -->
    <template #content>
      <!-- Semi Doughnut Chart -->
      <div class="flex justify-center relative mb-6">
        <Doughnut
          :data="chartData"
          :options="chartOptions"
          class="p-4"
        />
        <div class="absolute inset-10 flex items-center justify-center">
          <div class="text-4xl !mt-10 !font-bold text-gray-700">{{ percentage }}%</div>
        </div>
      </div>

      <!-- divider -->
      <div class="p-4 flex justify-center">
        <div class="border-t border-gray-300 w-[75%]"></div>
      </div>

      <!-- Health Recommendation Text -->
      <p class="text-center text-sm italic text-gray-600">
        {{ recommendation }}
      </p>



      <!-- Task List -->
      <!-- <div class="space-y-4">
        <div
          v-for="task in tasks"
          :key="task.label"
          class="flex items-start gap-3"
        >
          <div class="text-yellow-500 bg-yellow-100 rounded-full p-2">
            <i :class="task.icon" class="text-xl"></i>
          </div>
          <div class="text-sm">
            <p class="font-medium text-gray-700">{{ task.label }}</p>
            <a :href="task.link" class="text-blue-500 hover:underline">{{ task.action }}</a>
          </div>
        </div>
      </div> -->
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const emit = defineEmits(['switch'])

const percentage = 50
const recommendation = 'System requires moderate maintenance soon.'

const chartData: ChartData<'doughnut'> = {
  labels: ['Completed', 'Remaining'],
  datasets: [
    {
      data: [percentage, 100 - percentage],
      backgroundColor: ['#4BD983', '#e5e7eb'],
      borderWidth: 0
    }
  ]
}

const chartOptions: ChartOptions<'doughnut'> = {
  rotation: -90,
  circumference: 180,
  cutout: '85%',
  plugins: {
    legend: { display: false }
  },
}

const tasks = [
  {
    icon: 'pi pi-user-edit',
    label: 'Add your personal information',
    action: 'Go Profile Edit',
    link: '#'
  },
  {
    icon: 'pi pi-send',
    label: 'Verify your phone',
    action: 'Send Verification SMS',
    link: '#'
  },
  {
    icon: 'pi pi-video',
    label: 'Verify your Face ID',
    action: 'Upload Pictures',
    link: '#'
  },
  {
    icon: 'pi pi-briefcase',
    label: 'Give permission for personal data',
    action: 'View Agreement',
    link: '#'
  }
]

function switchChart() {
  emit('switch') // biar bisa dikontrol dari parent
}
</script>
