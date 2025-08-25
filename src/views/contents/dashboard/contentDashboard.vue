<template>
  <div class="grid grid-cols-12 !gap-6 !mb-4">
    <!-- Total Lansia Card -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <div class="stat-card blue-card">
        <div class="stat-number">440</div>
        <div class="stat-title">Total Lansia</div>
        <i class="pi pi-users card-icon"></i>
      </div>
    </div>

    <!-- Level 1 Card -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <div class="stat-card green-card">
        <div class="stat-number">413</div>
        <div class="stat-title">Level 1</div>
        <i class="pi pi-heart card-icon"></i>
      </div>
    </div>

    <!-- Level 2 Card -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <div class="stat-card yellow-card">
        <div class="stat-number">5</div>
        <div class="stat-title">Level 2</div>
        <i class="pi pi-exclamation-triangle card-icon"></i>
      </div>
    </div>

    <!-- Level 3 Card -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <div class="stat-card red-card">
        <div class="stat-number">32</div>
        <div class="stat-title">Level 3</div>
        <i class="pi pi-shield card-icon"></i>
      </div>
    </div>
  </div>

  <!-- Chart and Map Section -->
  <div class="grid grid-cols-12 !gap-6 !mt-4">
    <!-- Health Statistics Chart Card -->
    <div class="col-span-12 lg:col-span-4">
      <div class="stat-card bg-white border border-gray-200 !h-[580px]">
        <div class="!p-4 !h-full flex flex-col">
          <div class="flex items-center justify-between !mb-3">
            <div>
              <h3 class="!text-lg !font-semibold !text-gray-900 !mb-1">Status Kesehatan</h3>
              <p class="!text-xs !text-gray-600">Distribusi level kesehatan lansia</p>
            </div>
            <i class="pi pi-chart-pie !text-xl !text-green-500 !opacity-70"></i>
          </div>
          
          <!-- Doughnut Chart -->
          <div class="flex justify-center !mb-4 flex-grow flex items-center">
            <Doughnut :data="healthChartData" :options="healthChartOptions" class="max-h-64" />
          </div>

          <!-- Health Statistics Summary -->
          <div class="space-y-1">
            <div class="flex justify-between items-center bg-blue-50 rounded-lg px-3 py-1.5 text-xs">
              <div class="flex items-center">
                <div class="w-2.5 h-2.5 bg-blue-500 rounded-full !mr-2"></div>
                <span class="text-gray-700 font-medium">Total Lansia</span>
              </div>
              <span class="text-blue-700 font-semibold">440</span>
            </div>
            <div class="flex justify-between items-center bg-green-50 rounded-lg px-3 py-1.5 text-xs">
              <div class="flex items-center">
                <div class="w-2.5 h-2.5 bg-green-500 rounded-full !mr-2"></div>
                <span class="text-gray-700 font-medium">Level 1 (Baik)</span>
              </div>
              <span class="text-green-700 font-semibold">413</span>
            </div>
            <div class="flex justify-between items-center bg-yellow-50 rounded-lg px-3 py-1.5 text-xs">
              <div class="flex items-center">
                <div class="w-2.5 h-2.5 bg-yellow-500 rounded-full !mr-2"></div>
                <span class="text-gray-700 font-medium">Level 2 (Cukup)</span>
              </div>
              <span class="text-yellow-700 font-semibold">5</span>
            </div>
            <div class="flex justify-between items-center bg-red-50 rounded-lg px-3 py-1.5 text-xs">
              <div class="flex items-center">
                <div class="w-2.5 h-2.5 bg-red-500 rounded-full !mr-2"></div>
                <span class="text-gray-700 font-medium">Level 3 (Perhatian)</span>
              </div>
              <span class="text-red-700 font-semibold">32</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Card -->
    <div class="col-span-12 lg:col-span-8">
      <div class="stat-card bg-white border border-gray-200 !h-[580px]">
        <!-- Header Section -->
        <div class="!px-4 !pt-4 !pb-3">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="!text-lg !font-semibold !text-gray-900 !mb-1">Peta Sebaran Lansia</h3>
              <p class="!text-xs !text-gray-600">Distribusi lansia berdasarkan RW di Kotabaru</p>
            </div>
            <i class="pi pi-map !text-xl !text-blue-500 !opacity-70"></i>
          </div>
        </div>
        
        <!-- Map Content Container - Now takes more space -->
        <div class="!px-3 !pb-3" style="height: calc(100% - 70px);">
          <div class="w-full h-full rounded-lg overflow-hidden">
            <KotabaruMap />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'primeicons/primeicons.css'
import KotabaruMap from '../../../components/KotabaruMap.vue'
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

// Health Chart Data
const healthChartData: ChartData<'doughnut'> = {
  labels: ['Level 1 (Baik)', 'Level 2 (Cukup)', 'Level 3 (Perhatian)'],
  datasets: [
    {
      data: [413, 5, 32],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0,
      hoverBorderWidth: 2,
      hoverBorderColor: '#ffffff'
    }
  ]
}

const healthChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { 
      display: false 
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#374151',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: function(context) {
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((context.parsed / total) * 100).toFixed(1)
          return `${context.label}: ${context.parsed} (${percentage}%)`
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'nearest'
  }
}
</script>

<style lang="css" scoped>
/* Simple Stat Cards */
.stat-card {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 120px;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Card Icon */
.card-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 3.5rem;
  opacity: 0.8;
}

/* Stat Number */
.stat-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

/* Stat Title */
.stat-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Color Themes */
.blue-card {
  border-left: 4px solid #3b82f6;
}

.blue-card .stat-number {
  color: #1e40af;
}

.blue-card .card-icon {
  color: #3b82f6;
}

.green-card {
  border-left: 4px solid #10b981;
}

.green-card .stat-number {
  color: #047857;
}

.green-card .card-icon {
  color: #10b981;
}

.yellow-card {
  border-left: 4px solid #f59e0b;
}

.yellow-card .stat-number {
  color: #d97706;
}

.yellow-card .card-icon {
  color: #f59e0b;
}

.red-card {
  border-left: 4px solid #ef4444;
}

.red-card .stat-number {
  color: #dc2626;
}

.red-card .card-icon {
  color: #ef4444;
}

/* Hover Effects */
.stat-card:hover .card-icon {
  opacity: 1;
  transform: scale(1.1);
}

.stat-card:hover .stat-number {
  transform: scale(1.02);
}

/* Responsive */
@media (max-width: 768px) {
  .stat-card {
    padding: 1rem;
    min-height: 100px;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .stat-title {
    font-size: 0.8rem;
  }
  
  .card-icon {
    font-size: 2.5rem;
  }
}
</style>
