<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    header="Edit Riwayat Kesehatan"
    :style="{ width: '600px' }"
    :closable="true"
    :draggable="false"
  >
    <div class="space-y-6">
        
        <!-- Health Status Section -->
        <div class="bg-white rounded-2xl border border-gray-200 !p-5 !mb-6">
          <h3 class="text-lg font-semibold text-gray-800 !mb-4">
            <i class="pi pi-heart text-red-600 !mr-2"></i>
            Status Kesehatan
          </h3>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- Health Status -->
            <div class="space-y-2">
              <label for="healthStatus" class="block text-sm font-semibold text-gray-700">Level Kesehatan *</label>
              <Dropdown
                id="healthStatus"
                v-model="formData.healthStatus"
                :options="healthStatusOptions"
                optionLabel="label"
                optionValue="value"
                :class="{ 'p-invalid': errors.healthStatus }"
                class="w-full !rounded-xl !border-gray-300"
                placeholder="Pilih level kesehatan"
              />
              <small v-if="errors.healthStatus" class="text-red-500 text-xs !mt-1">{{ errors.healthStatus }}</small>
            </div>

            <!-- Living Status -->
            <div class="space-y-2">
              <label for="livingStatus" class="block text-sm font-semibold text-gray-700">Status Kehidupan *</label>
              <Dropdown
                id="livingStatus"
                v-model="formData.livingStatus"
                :options="livingStatusOptions"
                optionLabel="label"
                optionValue="value"
                :class="{ 'p-invalid': errors.livingStatus }"
                class="w-full !rounded-xl !border-gray-300"
                placeholder="Pilih status kehidupan"
              />
              <small v-if="errors.livingStatus" class="text-red-500 text-xs !mt-1">{{ errors.livingStatus }}</small>
            </div>
          </div>
        </div>


        <!-- Health History Records Section -->
        <div class="bg-white rounded-2xl border border-gray-200 !p-5 !mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 !mb-0">
              <i class="pi pi-calendar text-purple-600 !mr-2"></i>
              Catatan Kesehatan
            </h3>
            <Button
              type="button"
              icon="pi pi-plus"
              size="small"
              rounded
              outlined
              class="p-button-secondary"
              title="Tambah catatan kesehatan"
              @click="addHealthRecord"
            />
          </div>

          <div v-if="healthRecords.length === 0" class="text-center py-8 text-gray-500">
            <i class="pi pi-calendar text-3xl mb-2 block text-gray-400"></i>
            <p class="text-sm">Belum ada catatan kesehatan</p>
            <Button
              type="button"
              label="Tambah Catatan"
              icon="pi pi-plus"
              size="small"
              outlined
              class="mt-3"
              @click="addHealthRecord"
            />
          </div>

          <!-- Health Records List -->
          <div v-else class="space-y-4 mt-4">
            <div 
              v-for="(record, index) in healthRecords" 
              :key="index"
              class="health-record-card"
            >
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <i class="pi pi-calendar text-purple-600 text-sm"></i>
                </div>
                
                <div class="flex-1 space-y-3">
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 !mb-1">Jenis Pemeriksaan</label>
                      <Dropdown
                        v-model="record.type"
                        :options="recordTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full !rounded-xl !border-gray-300"
                        placeholder="Pilih jenis pemeriksaan"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 !mb-1">Tanggal</label>
                      <Calendar
                        v-model="record.date"
                        placeholder="DD/MM/YYYY"
                        dateFormat="dd/mm/yy"
                        :maxDate="new Date()"
                        showIcon
                        iconDisplay="input"
                        :pt="{
                          root: { class: 'relative w-full' },
                          input: { class: '!rounded-xl !border-gray-300 !py-3 !pl-3 !pr-10 text-sm w-full' },
                          inputIcon: { class: 'absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center' }
                        }"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 !mb-1">Hasil/Catatan</label>
                    <Textarea
                      v-model="record.notes"
                      class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                      placeholder="Masukkan hasil pemeriksaan atau catatan"
                      rows="2"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  icon="pi pi-trash"
                  size="small"
                  rounded
                  outlined
                  severity="danger"
                  class="mt-1 flex-shrink-0"
                  title="Hapus catatan"
                  @click="removeHealthRecord(index)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 !mt-8">
          <Button
            label="Batal"
            severity="secondary"
            outlined
            @click="handleCancel"
          />
          <Button
            label="Simpan"
            icon="pi pi-check"
            :loading="isSubmitting"
            @click="handleSubmit"
          />
        </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import type { Lansia } from '../composables/useLansiaManagement'

interface HealthRecord {
  type: string
  date: Date | null
  notes: string
}

interface Props {
  visible: boolean
  lansia?: Lansia | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'save', data: Partial<Lansia>): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form data
const formData = ref({
  healthStatus: null as number | null,
  livingStatus: null as 'Hidup' | 'Meninggal' | null
})

// Health records
const healthRecords = ref<HealthRecord[]>([])

// Form validation errors
const errors = ref({
  healthStatus: '',
  livingStatus: ''
})

// Form state
const isSubmitting = ref(false)

// Options for dropdowns
const healthStatusOptions = [
  { label: 'Level 1 - Sehat', value: 1 },
  { label: 'Level 2 - Perlu Perhatian', value: 2 },
  { label: 'Level 3 - Membutuhkan Perawatan', value: 3 }
]

const livingStatusOptions = [
  { label: 'Hidup', value: 'Hidup' },
  { label: 'Meninggal', value: 'Meninggal' }
]

const recordTypeOptions = [
  { label: 'Pemeriksaan Rutin', value: 'Pemeriksaan Rutin' },
  { label: 'Pemeriksaan Tekanan Darah', value: 'Pemeriksaan Tekanan Darah' },
  { label: 'Pemeriksaan Laboratorium', value: 'Pemeriksaan Laboratorium' },
  { label: 'Konsultasi Dokter', value: 'Konsultasi Dokter' },
  { label: 'Pemeriksaan Mata', value: 'Pemeriksaan Mata' },
  { label: 'Pemeriksaan Jantung', value: 'Pemeriksaan Jantung' },
  { label: 'Pemeriksaan Gigi', value: 'Pemeriksaan Gigi' },
  { label: 'Vaksinasi', value: 'Vaksinasi' },
  { label: 'Pemeriksaan Lainnya', value: 'Pemeriksaan Lainnya' }
]

// Computed properties
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Watch for lansia data changes
watch(() => props.lansia, (newLansia) => {
  if (newLansia) {
    loadLansiaData(newLansia)
  }
}, { immediate: true })

// Watch for visible changes to reset form
watch(() => props.visible, (newVisible) => {
  if (newVisible && props.lansia) {
    loadLansiaData(props.lansia)
    clearErrors()
  }
})

// Load lansia data into form
const loadLansiaData = (lansia: Lansia) => {
  formData.value = {
    healthStatus: lansia.healthStatus || null,
    livingStatus: lansia.livingStatus || 'Hidup'
  }

  // Initialize with some sample health records based on the detail modal
  healthRecords.value = [
    {
      type: 'Pemeriksaan Rutin',
      date: lansia.lastCheckup || new Date(),
      notes: 'Pemeriksaan kesehatan umum - Kondisi stabil'
    },
    {
      type: 'Pemeriksaan Tekanan Darah',
      date: new Date('2024-07-01'),
      notes: 'Tekanan darah: 130/80 mmHg - Normal tinggi'
    },
    {
      type: 'Pemeriksaan Laboratorium',
      date: new Date('2024-06-01'),
      notes: 'Gula darah: 95 mg/dL - Normal'
    }
  ]
}

// Clear all errors
const clearErrors = () => {
  errors.value = {
    healthStatus: '',
    livingStatus: ''
  }
}

// Health records management
const addHealthRecord = () => {
  healthRecords.value.push({
    type: '',
    date: null,
    notes: ''
  })
}

const removeHealthRecord = (index: number) => {
  healthRecords.value.splice(index, 1)
}

// Validation functions
const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  // Health status validation
  if (!formData.value.healthStatus) {
    errors.value.healthStatus = 'Level kesehatan wajib dipilih'
    isValid = false
  }

  // Living status validation
  if (!formData.value.livingStatus) {
    errors.value.livingStatus = 'Status kehidupan wajib dipilih'
    isValid = false
  }

  return isValid
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Prepare data for saving
    const updatedData: Partial<Lansia> = {
      healthStatus: formData.value.healthStatus as 1 | 2 | 3,
      livingStatus: formData.value.livingStatus as 'Hidup' | 'Meninggal'
    }

    emit('save', updatedData)
    visible.value = false
  } catch (error) {
    console.error('Error saving health history:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Handle cancel
const handleCancel = () => {
  visible.value = false
  emit('close')
}
</script>

<style scoped>
/* Health record card styling */

.health-record-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 200ms;
}

.health-record-card:hover {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-color: #d1d5db;
}
</style>