<template>
  <div class="grid grid-cols-12 !gap-8 mb-4">
    <!-- Card 1 -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <Card class="custom-card">
        <template #content>
          <div class="flex items-center !p-4">
            <i class="pi pi-desktop !text-5xl !text-blue-500"></i>
            <div class="!ml-4">
              <p class="!text-blue-500 !block !whitespace-nowrap">TOTAL ASSETS</p>
              <p class="!text-blue-500 !block !text-4xl !font-bold">440</p>
            </div>
          </div>

          <div class="w-full">
            <MiniLineChart :data="chartData" borderColor="#2b7fff" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Card 2 -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <Card class="custom-card">
        <template #content>
          <div class="flex items-center p-4">
            <i class="pi pi-check !text-5xl text-green-500"></i>
            <div class="!ml-4">
              <p class="text-green-500 block whitespace-nowrap">WORKING ASSET</p>
              <p class="text-green-500 block text-4xl !font-bold">413</p>
            </div>
          </div>

          <div class="w-full">
            <MiniLineChart :data="chartData2" borderColor="#00c950" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Card 3 -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <Card class="custom-card">
        <template #content>
          <div class="flex items-center p-4">
            <i class="pi pi-exclamation-triangle !text-5xl !text-yellow-500"></i>
            <div class="!ml-4">
              <p class="!text-yellow-500 !block !whitespace-nowrap">NEED ATTENTION</p>
              <p class="!text-yellow-500 !block !text-4xl !font-bold">5</p>
            </div>
          </div>

          <div class="w-full">
            <MiniLineChart :data="chartData3" borderColor="#efb000" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Card 4 -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <Card class="custom-card">
        <template #content>
          <div class="!flex !items-center !p-4">
            <i class="pi pi-times !text-5xl !text-red-500"></i>
            <div class="!ml-4">
              <p class="!text-red-500 !block !whitespace-nowrap">NOT WORKING ASSETS</p>
              <p class="!text-red-500 !block !text-4xl !font-bold">32</p>
            </div>
          </div>

          <div class="w-full">
            <MiniLineChart :data="chartData4" borderColor="#fa2c37" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Button Menu -->
    <div class="col-span-12 !-mb-4">
      <div class="w-full bg-[#ffffff] rounded-full">
        <div class="flex space-x-6 justify-center gap-100 pt-1 pb-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="currentTab = tab.key"
            :class="[
              'px-4 py-1.5 text-base font-semibold transition-all duration-150',
              currentTab === tab.key
                ? '!bg-[#2b7fff] text-white rounded-full shadow-sm pl-10 pr-10'
                : 'text-gray-500 hover:text-gray-400',
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Dynamic Tab Content -->
    <component :is="currentTabComponent"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MiniLineChart from '../../../components/lineChart.vue'
import dashboardOverview from './dashboardOverview.vue'
import dashboardAnalytics from './dashboardAnalytics.vue'
import Card from 'primevue/card'
import 'primeicons/primeicons.css'

const chartData = [2, 2, 6, 8, 8, 2, 6, 6, 6, 6]
const chartData2 = [5, 7, 6, 8, 4, 2, 6, 6, 6, 6]
const chartData3 = [5, 7, 6, 8, 4, 2, 6, 6, 6, 6]
const chartData4 = [5, 7, 6, 8, 4, 2, 6, 6, 6, 6]

const currentTab = ref('overview')

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'maintenance', label: 'Maintenance' },
]

const currentTabComponent = computed(() => {
  switch (currentTab.value) {
    case 'overview':
      return dashboardOverview
    case 'analytics':
      return dashboardAnalytics
    case 'Maintenance':
      return dashboardAnalytics
    default:
      return dashboardOverview
  }
})
</script>

<style lang="css">
.card {
  margin-bottom: 1rem;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 3px 4px,
    rgba(0, 0, 0, 0.04) 0px 24px 36px;
  background: var(--surface-card);
  padding: 1.5rem;
  border-radius: 14px;
}

.card:last-child {
  margin-bottom: 0px;
}
</style>
