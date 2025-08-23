<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    :header="null"
    :style="{ width: '580px' }"
    :closable="false"
    :draggable="false"
  >
    <div v-if="user" class="modern-user-detail">
      <!-- Custom Header with Close Button -->
      <div class="flex justify-between items-center !mb-6">
        <h2 class="text-xl font-bold text-gray-900">User Profile</h2>
        <Button
          icon="pi pi-times"
          text
          rounded
          severity="secondary"
          @click="handleClose"
          class="!w-8 !h-8 !p-0"
        />
      </div>

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
              <i class="pi pi-user text-white text-3xl" />
            </div>
            <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white flex items-center justify-center">
              <i class="pi pi-check text-white text-xs" />
            </div>
          </div>
          
          <h1 class="text-2xl font-bold !mb-2">{{ user.name }}</h1>
          <div class="inline-flex items-center !px-3 !py-1 rounded-full bg-white/20 backdrop-blur-sm">
            <i class="pi pi-shield text-yellow-300 text-sm !mr-2" />
            <span class="text-sm font-medium">{{ user.role }}</span>
          </div>
        </div>
      </div>

      <!-- Information Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 !mb-6">
        <!-- Contact Card -->
        <div class="group bg-white border border-gray-200 rounded-xl !p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300">
          <div class="flex items-center gap-3 !mb-4">
            <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <i class="pi pi-envelope text-blue-600 text-lg" />
            </div>
            <h3 class="font-semibold text-gray-900">Contact</h3>
          </div>
          <div class="space-y-3">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Email</p>
              <p class="text-sm text-gray-900 font-medium">{{ user.email }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Phone</p>
              <p class="text-sm text-gray-900 font-medium">{{ user.phone }}</p>
            </div>
          </div>
        </div>

        <!-- Account Card -->
        <div class="group bg-white border border-gray-200 rounded-xl !p-5 hover:shadow-lg hover:border-purple-300 transition-all duration-300">
          <div class="flex items-center gap-3 !mb-4">
            <div class="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <i class="pi pi-id-card text-purple-600 text-lg" />
            </div>
            <h3 class="font-semibold text-gray-900">Account</h3>
          </div>
          <div class="space-y-3">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">User ID</p>
              <p class="text-sm text-gray-900 font-mono font-medium">{{ user.id }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-1">Member Since</p>
              <p class="text-sm text-gray-900 font-medium">{{ formatDate(user.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end">
        <Button
          label="Edit Profile"
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

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  createdAt: Date
}

interface Props {
  visible: boolean
  user?: User | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'edit', user: User): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Computed properties
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Utility functions
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long' 
  })
}

// Event handlers
const handleClose = () => {
  emit('close')
  visible.value = false
}

const handleEdit = () => {
  if (props.user) {
    emit('edit', props.user)
    visible.value = false
  }
}
</script>

<style src="@/styles/modal.css" scoped></style>

<style scoped>
.modern-user-detail {
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

.bg-gradient-to-r {
  background: linear-gradient(90deg, var(--tw-gradient-stops));
}

.from-gray-50 {
  --tw-gradient-from: #f9fafb;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(249, 250, 251, 0));
}

.to-blue-50 {
  --tw-gradient-to: #eff6ff;
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

/* Modern button styling override */
:deep(.p-button.flex-1) {
  border-radius: 12px !important;
  font-weight: 600;
  padding: 12px 24px !important;
  transition: all 0.3s ease;
}

:deep(.p-button.flex-1:hover) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Custom close button */
:deep(.p-button[class*="!w-8"]) {
  background: transparent !important;
  border: none !important;
  color: #6b7280 !important;
  transition: all 0.2s ease !important;
}

:deep(.p-button[class*="!w-8"]:hover) {
  background: #f3f4f6 !important;
  color: #374151 !important;
  transform: scale(1.1);
}
</style>