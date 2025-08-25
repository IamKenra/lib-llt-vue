<template>
  <div class="grid grid-cols-12 !gap-6 !mb-8">
    <!-- Total Lansia Card -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <div class="stat-card blue-card">
        <div class="stat-number">{{ totalLansia }}</div>
        <div class="stat-title">Total Lansia</div>
        <i class="pi pi-users card-icon"></i>
      </div>
    </div>

    <!-- Level 1 Card -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <div class="stat-card green-card">
        <div class="stat-number">{{ lansiaLevel1 }}</div>
        <div class="stat-title">Level 1</div>
        <i class="pi pi-heart card-icon"></i>
      </div>
    </div>

    <!-- Level 2 Card -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <div class="stat-card yellow-card">
        <div class="stat-number">{{ lansiaLevel2 }}</div>
        <div class="stat-title">Level 2</div>
        <i class="pi pi-exclamation-triangle card-icon"></i>
      </div>
    </div>

    <!-- Level 3 Card -->
    <div class="col-span-12 md:col-span-6 xl:col-span-3">
      <div class="stat-card red-card">
        <div class="stat-number">{{ lansiaLevel3 }}</div>
        <div class="stat-title">Level 3</div>
        <i class="pi pi-shield card-icon"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'primeicons/primeicons.css'

interface Props {
  totalLansia: number
  lansiaLevel1: number
  lansiaLevel2: number
  lansiaLevel3: number
}

defineProps<Props>()
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