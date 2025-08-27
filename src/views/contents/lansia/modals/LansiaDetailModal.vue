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
          <div class="relative !mb-4 group">
            <div class="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30 relative overflow-hidden">
              <img v-if="lansia.profileImage" :src="lansia.profileImage" alt="Profile" class="w-28 h-28 rounded-full object-cover" />
              <i v-else class="pi pi-user text-white text-4xl" />
              
              <!-- Edit Profile Picture Overlay -->
              <div class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  icon="pi pi-camera"
                  rounded
                  class="p-button-secondary !w-10 !h-10"
                  title="Edit Profile Picture"
                  @click="editProfilePicture"
                />
              </div>
            </div>
            
            <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-3 border-white flex items-center justify-center"
                 :class="getHealthStatusColor(lansia.healthStatus)">
              <i :class="getHealthStatusIcon(lansia.healthStatus)" class="text-white text-sm" />
            </div>
          </div>
          
          <h1 class="text-2xl font-bold !mb-3">{{ getFullName(lansia.firstName, lansia.lastName) }}</h1>
          
          <!-- Status Badges Row - All in One Line -->
          <div class="flex items-center justify-center gap-2 flex-wrap">
            <div :class="getHealthStatusBadgeClasses(lansia.healthStatus)" class="inline-flex items-center !px-2 !py-1 rounded-full text-xs font-medium">
              <span>{{ getHealthStatusLabel(lansia.healthStatus) }}</span>
            </div>
            <div class="inline-flex items-center gap-1 !px-2 !py-1 rounded-full text-xs font-medium"
                 :class="getEconomicStatusBadgeClasses(lansia.economicStatus)">
              <i :class="getEconomicStatusIcon(lansia.economicStatus)" class="text-xs"></i>
              <span>{{ lansia.economicStatus }}</span>
            </div>
            <div class="inline-flex items-center gap-1 !px-2 !py-1 rounded-full text-xs font-medium"
                 :class="getLivingStatusBadgeClasses(lansia.livingStatus)">
              <i :class="getLivingStatusIcon(lansia.livingStatus)" class="text-xs"></i>
              <span>{{ lansia.livingStatus }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Information Cards - Single Column -->
      <div class="space-y-6 !mb-8">
        <!-- Personal Information Card -->
        <div class="group bg-white border border-gray-200 rounded-xl !p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 !mb-4">
          <div class="flex items-center justify-between !mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <i class="pi pi-id-card text-blue-600 text-lg" />
              </div>
              <h3 class="font-semibold text-gray-900">Informasi Pribadi</h3>
            </div>
            <Button
              icon="pi pi-pencil"
              size="small"
              rounded
              outlined
              class="p-button-primary"
              title="Edit Informasi Pribadi"
              @click="editPersonalInfo"
            />
          </div>
          <div class="grid grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-1">
              <div class="!pb-2">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">NIK</p>
                <p class="text-sm text-gray-900 font-mono font-medium">{{ lansia.nik }}</p>
              </div>
              <div class="!pb-2">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">Umur</p>
                <p class="text-sm text-gray-900 font-medium">{{ lansia.age }} tahun</p>
              </div>
              <div class="!pb-2">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">Jenis Kelamin</p>
                <p class="text-sm text-gray-900 font-medium">{{ lansia.gender }}</p>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">RT</p>
                  <p class="text-sm text-gray-900 font-medium">{{ lansia.rt }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">RW</p>
                  <p class="text-sm text-gray-900 font-medium">{{ lansia.rw }}</p>
                </div>
              </div>
            </div>
            <!-- Right Column -->
            <div class="space-y-1">
              <div class="!pb-2">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">Tanggal Lahir</p>
                <p class="text-sm text-gray-900 font-medium">{{ formatDate(lansia.dateOfBirth) }}</p>
              </div>
              <div class="!pb-2">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">Pekerjaan</p>
                <p class="text-sm text-gray-900 font-medium">{{ lansia.job || 'Tidak bekerja' }}</p>
              </div>
              <div class="!pb-2">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">Alamat</p>
                <p class="text-sm text-gray-900 font-medium">{{ lansia.address }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Card -->
        <div class="group bg-white border border-gray-200 rounded-xl !p-5 hover:shadow-lg hover:border-green-300 transition-all duration-300 !mb-4">
          <div class="flex items-center justify-between !mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <i class="pi pi-phone text-green-600 text-lg" />
              </div>
              <h3 class="font-semibold text-gray-900">Kontak</h3>
            </div>
            <Button
              icon="pi pi-pencil"
              size="small"
              rounded
              outlined
              class="p-button-success"
              title="Edit Kontak"
              @click="editContactInfo"
            />
          </div>
          <!-- Main Contact Info -->
          <div class="grid grid-cols-2 gap-6 !mb-4">
            <!-- Left Column -->
            <div class="space-y-1">
              <div v-if="lansia.phone" class="!pb-2">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">Telepon</p>
                <p class="text-sm text-gray-900 font-medium">{{ lansia.phone }}</p>
              </div>
              <div class="!pb-2">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">Status Caregiver</p>
                <div :class="getCaregiverStatusBadgeClasses(lansia.caregiverStatus)" class="inline-flex items-center gap-2 !px-3 !py-1 rounded-full text-xs font-semibold">
                  <i :class="getCaregiverStatusIcon(lansia.caregiverStatus)" class="text-sm"></i>
                  <span>{{ lansia.caregiverStatus }}</span>
                </div>
              </div>
            </div>
            <!-- Right Column -->
            <div class="space-y-1">
              <div class="!pb-2">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">Terakhir Periksa</p>
                <p class="text-sm text-gray-900 font-medium">{{ formatDate(lansia.lastCheckup) }}</p>
              </div>
              <div class="!pb-2">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide !mb-0">Kondisi Medis</p>
                <div v-if="lansia.medicalConditions?.length > 0" class="flex flex-wrap gap-2">
                  <span 
                    v-for="condition in lansia.medicalConditions" 
                    :key="condition"
                    class="inline-flex items-center !px-2 !py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-200 text-xs font-medium"
                  >
                    <i class="pi pi-exclamation-triangle !mr-1 text-xs"></i>
                    {{ condition }}
                  </span>
                </div>
                <p v-else class="text-sm text-gray-500 italic">Tidak ada kondisi medis khusus</p>
              </div>
            </div>
          </div>

          <!-- Emergency Contacts Section -->
          <div class="border-t border-gray-100 !pt-4">
            <h4 class="text-xs font-semibold text-gray-600 uppercase tracking-wide !mb-3">Kontak Darurat</h4>
            <div class="space-y-3">
              <!-- Emergency Contact Card 1 -->
              <div class="group bg-white border border-gray-200 rounded-lg !p-3 hover:shadow-sm hover:border-blue-300 transition-all duration-300 !mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <span class="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <h5 class="text-sm font-medium text-gray-900">{{ lansia.emergencyContact }}</h5>
                      <span class="text-xs text-gray-500">Keluarga</span>
                    </div>
                    <div class="flex items-center gap-1 !mt-1">
                      <i class="pi pi-phone text-blue-600 text-xs"></i>
                      <span class="text-xs text-gray-600">{{ lansia.emergencyPhone }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Emergency Contact Card 2 -->
              <div class="group bg-white border border-gray-200 rounded-lg !p-3 hover:shadow-sm hover:border-green-300 transition-all duration-300">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-green-50 rounded-md flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <span class="text-xs font-bold text-green-600">2</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <h5 class="text-sm font-medium text-gray-900">Dr. Siti Nurhaliza</h5>
                      <span class="text-xs text-gray-500">Dokter Pribadi</span>
                    </div>
                    <div class="flex items-center gap-1 !mt-1">
                      <i class="pi pi-phone text-green-600 text-xs"></i>
                      <span class="text-xs text-gray-600">+62 812-3456-7890</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Health History Card -->
        <div class="group bg-white border border-gray-200 rounded-xl !p-5 hover:shadow-lg hover:border-purple-300 transition-all duration-300">
          <div class="flex items-center justify-between !mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <i class="pi pi-calendar text-purple-600 text-lg" />
              </div>
              <h3 class="font-semibold text-gray-900">Riwayat Kesehatan</h3>
            </div>
            <Button
              icon="pi pi-pencil"
              size="small"
              rounded
              outlined
              class="p-button-secondary"
              title="Edit Riwayat Kesehatan"
              @click="editHealthHistory"
            />
          </div>
          <div class="space-y-3">
            <!-- Medical Checkup Records -->
            <div class="flex items-start gap-3 !p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
              <div class="w-2 h-2 bg-blue-400 rounded-full !mt-2"></div>
              <div class="flex-1">
                <div class="flex items-center justify-between !mb-1">
                  <span class="text-sm font-medium text-gray-900">Pemeriksaan Rutin</span>
                  <span class="text-xs text-gray-500">{{ formatDate(lansia.lastCheckup) }}</span>
                </div>
                <p class="text-xs text-gray-600">Pemeriksaan kesehatan umum - Kondisi stabil</p>
              </div>
            </div>

            <div class="flex items-start gap-3 !p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
              <div class="w-2 h-2 bg-green-400 rounded-full !mt-2"></div>
              <div class="flex-1">
                <div class="flex items-center justify-between !mb-1">
                  <span class="text-sm font-medium text-gray-900">Pemeriksaan Tekanan Darah</span>
                  <span class="text-xs text-gray-500">Jul 2024</span>
                </div>
                <p class="text-xs text-gray-600">Tekanan darah: 130/80 mmHg - Normal tinggi</p>
              </div>
            </div>

            <div class="flex items-start gap-3 !p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border-l-4 border-purple-400">
              <div class="w-2 h-2 bg-purple-400 rounded-full !mt-2"></div>
              <div class="flex-1">
                <div class="flex items-center justify-between !mb-1">
                  <span class="text-sm font-medium text-gray-900">Pemeriksaan Laboratorium</span>
                  <span class="text-xs text-gray-500">Jun 2024</span>
                </div>
                <p class="text-xs text-gray-600">Gula darah: 95 mg/dL - Normal</p>
              </div>
            </div>

            <div class="flex items-start gap-3 !p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-l-4 border-orange-400">
              <div class="w-2 h-2 bg-orange-400 rounded-full !mt-2"></div>
              <div class="flex-1">
                <div class="flex items-center justify-between !mb-1">
                  <span class="text-sm font-medium text-gray-900">Konsultasi Dokter</span>
                  <span class="text-xs text-gray-500">Mei 2024</span>
                </div>
                <p class="text-xs text-gray-600">Kontrol rutin - Disarankan olahraga ringan</p>
              </div>
            </div>

            <div class="flex items-start gap-3 !p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border-l-4 border-pink-400">
              <div class="w-2 h-2 bg-pink-400 rounded-full !mt-2"></div>
              <div class="flex-1">
                <div class="flex items-center justify-between !mb-1">
                  <span class="text-sm font-medium text-gray-900">Pemeriksaan Mata</span>
                  <span class="text-xs text-gray-500">Apr 2024</span>
                </div>
                <p class="text-xs text-gray-600">Pemeriksaan mata rutin - Minus bertambah sedikit</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3">
        <Button
          label="QR Code"
          icon="pi pi-qrcode"
          severity="secondary"
          outlined
          @click="showQR"
        />
        <Button
          label="Edit Data"
          icon="pi pi-pencil"
          @click="handleEdit"
        />
      </div>
    </div>

    <!-- QR Code Modal -->
    <LansiaQRModal
      v-model:visible="showQRModal"
      :lansia="lansia"
      @close="showQRModal = false"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { useLansiaManagement, type Lansia } from '../composables/useLansiaManagement'
import LansiaQRModal from './LansiaQRModal.vue'

interface Props {
  visible: boolean
  lansia?: Lansia | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'edit', lansia: Lansia): void
  (e: 'editPersonalInfo', lansia: Lansia): void
  (e: 'editContactInfo', lansia: Lansia): void
  (e: 'editHealthHistory', lansia: Lansia): void
  (e: 'editProfilePicture', lansia: Lansia): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use health status functions from composable
const { getHealthStatusBadgeClasses, getHealthStatusIcon, getHealthStatusLabel, getFullName, getCaregiverStatusBadgeClasses, getCaregiverStatusIcon } = useLansiaManagement()

// Reactive variables
const showQRModal = ref(false)

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

// Economic status styling
const getEconomicStatusBadgeClasses = (status: string) => {
  switch (status) {
    case 'Kurang Mampu':
      return 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
    case 'Cukup Mampu':
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm'
    case 'Sangat Mampu':
      return 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
  }
}

const getEconomicStatusIcon = (status: string) => {
  switch (status) {
    case 'Kurang Mampu':
      return 'pi pi-wallet'
    case 'Cukup Mampu':
      return 'pi pi-money-bill'
    case 'Sangat Mampu':
      return 'pi pi-dollar'
    default:
      return 'pi pi-circle'
  }
}

// Living status styling
const getLivingStatusBadgeClasses = (status: string) => {
  switch (status) {
    case 'Hidup':
      return 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
    case 'Meninggal':
      return 'bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
  }
}

const getLivingStatusIcon = (status: string) => {
  switch (status) {
    case 'Hidup':
      return 'pi pi-heart'
    case 'Meninggal':
      return 'pi pi-times-circle'
    default:
      return 'pi pi-circle'
  }
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

const showQR = () => {
  showQRModal.value = true
}

// Edit functions for CRUD operations
const editPersonalInfo = () => {
  if (props.lansia) {
    console.log('Edit Personal Information for:', props.lansia.firstName, props.lansia.lastName)
    emit('editPersonalInfo', props.lansia)
  }
}

const editContactInfo = () => {
  if (props.lansia) {
    console.log('Edit Contact Information for:', props.lansia.firstName, props.lansia.lastName)
    emit('editContactInfo', props.lansia)
  }
}

const editHealthHistory = () => {
  if (props.lansia) {
    console.log('Edit Health History for:', props.lansia.firstName, props.lansia.lastName)
    emit('editHealthHistory', props.lansia)
  }
}

const editProfilePicture = () => {
  if (props.lansia) {
    console.log('Edit Profile Picture for:', props.lansia.firstName, props.lansia.lastName)
    emit('editProfilePicture', props.lansia)
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