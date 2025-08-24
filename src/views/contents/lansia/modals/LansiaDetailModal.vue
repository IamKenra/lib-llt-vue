<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    header="Detail Data Lansia"
    :style="{ width: '580px' }"
    :closable="true"
    :draggable="false"
  >
    <div v-if="lansia" class="modern-lansia-detail">
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl !p-8 !mb-6 overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20"></div>
          <div class="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10"></div>
          <div class="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-white/10"></div>
        </div>
        
        <!-- Profile Content -->
        <div class="relative flex flex-col items-center text-center text-white">
          <!-- Avatar with Ring -->
          <div class="relative !mb-4">
            <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30">
              <img v-if="lansia.profileImage" :src="lansia.profileImage" alt="Profile" class="w-20 h-20 rounded-full object-cover" />
              <i v-else class="pi pi-user text-white text-3xl" />
            </div>
            <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center"
                 :class="getHealthStatusColor(lansia.healthStatus)">
              <i :class="getHealthStatusIcon(lansia.healthStatus)" class="text-white text-xs" />
            </div>
          </div>
          
          <h1 class="text-2xl font-bold !mb-2">{{ getFullName(lansia.firstName, lansia.lastName) }}</h1>
          <div :class="getHealthStatusBadgeClasses(lansia.healthStatus)" class="inline-flex items-center gap-2 !px-3 !py-1.5 rounded-full text-sm font-semibold">
            <i :class="getHealthStatusIcon(lansia.healthStatus)" class="text-sm"></i>
            <span>{{ getHealthStatusLabel(lansia.healthStatus) }}</span>
          </div>
        </div>
      </div>

      <!-- Information Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 !mb-6">
        <!-- Personal Information Card -->
        <div class="group bg-white border border-gray-200 rounded-xl !p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
          <div class="flex items-center gap-3 !mb-4">
            <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <i class="pi pi-id-card text-blue-600 text-lg" />
            </div>
            <h3 class="font-semibold text-gray-900">Informasi Pribadi</h3>
          </div>
          <div class="space-y-3">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">NIK</p>
              <p class="text-sm text-gray-900 font-mono font-medium">{{ lansia.nik }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Umur</p>
              <p class="text-sm text-gray-900 font-medium">{{ lansia.age }} tahun</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Jenis Kelamin</p>
              <p class="text-sm text-gray-900 font-medium">{{ lansia.gender }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Tanggal Lahir</p>
              <p class="text-sm text-gray-900 font-medium">{{ formatDate(lansia.dateOfBirth) }}</p>
            </div>
          </div>
        </div>

        <!-- Contact Card -->
        <div class="group bg-white border border-gray-200 rounded-xl !p-5 hover:shadow-lg hover:border-green-300 transition-all duration-300">
          <div class="flex items-center gap-3 !mb-4">
            <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <i class="pi pi-phone text-green-600 text-lg" />
            </div>
            <h3 class="font-semibold text-gray-900">Kontak</h3>
          </div>
          <div class="space-y-3">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Alamat</p>
              <p class="text-sm text-gray-900 font-medium">{{ lansia.address }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">RT</p>
                <p class="text-sm text-gray-900 font-medium">{{ lansia.rt }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">RW</p>
                <p class="text-sm text-gray-900 font-medium">{{ lansia.rw }}</p>
              </div>
            </div>
            <div v-if="lansia.phone">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Telepon</p>
              <p class="text-sm text-gray-900 font-medium">{{ lansia.phone }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Kontak Darurat</p>
              <p class="text-sm text-gray-900 font-medium">{{ lansia.emergencyContact }}</p>
              <p class="text-sm text-blue-600 font-medium">{{ lansia.emergencyPhone }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Status Caregiver</p>
              <div :class="getCaregiverStatusBadgeClasses(lansia.caregiverStatus)" class="inline-flex items-center gap-2 !px-3 !py-1 rounded-full text-xs font-semibold !mt-1">
                <i :class="getCaregiverStatusIcon(lansia.caregiverStatus)" class="text-sm"></i>
                <span>{{ lansia.caregiverStatus }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Health Information Card -->
        <div class="group bg-white border border-gray-200 rounded-xl !p-5 hover:shadow-lg hover:border-red-300 transition-all duration-300 md:col-span-2">
          <div class="flex items-center gap-3 !mb-4">
            <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <i class="pi pi-heart text-red-600 text-lg" />
            </div>
            <h3 class="font-semibold text-gray-900">Informasi Kesehatan</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Status Kesehatan</p>
              <div :class="getHealthStatusBadgeClasses(lansia.healthStatus)" class="inline-flex items-center gap-2 !px-3 !py-1 rounded-full text-xs font-semibold !mt-1">
                <i :class="getHealthStatusIcon(lansia.healthStatus)" class="text-sm"></i>
                <span>{{ getHealthStatusLabel(lansia.healthStatus) }}</span>
              </div>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Terakhir Periksa</p>
              <p class="text-sm text-gray-900 font-medium">{{ formatDate(lansia.lastCheckup) }}</p>
            </div>
            <div v-if="lansia.medicalConditions?.length > 0" class="md:col-span-2">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-2">Kondisi Medis</p>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="condition in lansia.medicalConditions" 
                  :key="condition"
                  class="inline-flex items-center !px-2 !py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200 text-xs font-medium"
                >
                  <i class="pi pi-exclamation-triangle !mr-1 text-xs"></i>
                  {{ condition }}
                </span>
              </div>
            </div>
            <div v-else class="md:col-span-2">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Kondisi Medis</p>
              <p class="text-sm text-gray-500 italic">Tidak ada kondisi medis khusus</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end">
        <Button
          label="Edit Data"
          icon="pi pi-pencil"
          @click="handleEdit"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { useLansiaManagement, type Lansia } from '../composables/useLansiaManagement'

interface Props {
  visible: boolean
  lansia?: Lansia | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'edit', lansia: Lansia): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use health status functions from composable
const { getHealthStatusBadgeClasses, getHealthStatusIcon, getHealthStatusLabel, getFullName, getCaregiverStatusBadgeClasses, getCaregiverStatusIcon } = useLansiaManagement()

// Computed properties
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Utility functions
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  })
}

const getHealthStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return 'bg-green-500'
    case 2:
      return 'bg-yellow-500'
    case 3:
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

// Event handlers
const handleEdit = () => {
  if (props.lansia) {
    emit('edit', props.lansia)
    visible.value = false
  }
}
</script>

<style scoped>
.modern-lansia-detail {
  padding: 0;
}

/* Custom gradients */
.bg-gradient-to-br {
  background: linear-gradient(135deg, var(--tw-gradient-stops));
}

.from-blue-500 {
  --tw-gradient-from: #3b82f6;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(59, 130, 246, 0));
}

.via-purple-600 {
  --tw-gradient-to: #9333ea;
}

.to-indigo-700 {
  --tw-gradient-to: #4338ca;
}

/* Modern card shadows and animations */
.group:hover {
  transform: translateY(-2px);
}

/* Backdrop blur effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Ring effect */
.ring-4 {
  box-shadow: 0 0 0 4px var(--tw-ring-color);
}

.ring-white\/30 {
  --tw-ring-color: rgba(255, 255, 255, 0.3);
}

/* Border widths */
.border-3 {
  border-width: 3px;
}

/* White with opacity */
.bg-white\/20 {
  background-color: rgba(255, 255, 255, 0.2);
}

.bg-white\/10 {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>