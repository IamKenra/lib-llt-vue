<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    header="Edit Informasi Pribadi"
    :style="{ width: '600px' }"
    :closable="true"
    :draggable="false"
  >
    <div class="space-y-6">
        
        <!-- Basic Info Section -->
        <div class="bg-white rounded-2xl border border-gray-200 !p-5 !mb-6">
          <h3 class="text-lg font-semibold text-gray-800 !mb-4">
            <i class="pi pi-user text-blue-600 !mr-2"></i>
            Informasi Dasar
          </h3>
          
          <div class="grid grid-cols-2 gap-5">
            <!-- First Name -->
            <div class="space-y-2">
              <label for="firstName" class="block text-sm font-semibold text-gray-700">Nama Depan *</label>
              <InputText
                id="firstName"
                v-model="formData.firstName"
                :class="{ 'p-invalid': errors.firstName }"
                class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                placeholder="Masukkan nama depan"
              />
              <small v-if="errors.firstName" class="text-red-500 text-xs !mt-1">{{ errors.firstName }}</small>
            </div>

            <!-- Last Name -->
            <div class="space-y-2">
              <label for="lastName" class="block text-sm font-semibold text-gray-700">Nama Belakang *</label>
              <InputText
                id="lastName"
                v-model="formData.lastName"
                :class="{ 'p-invalid': errors.lastName }"
                class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                placeholder="Masukkan nama belakang"
              />
              <small v-if="errors.lastName" class="text-red-500 text-xs !mt-1">{{ errors.lastName }}</small>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- NIK -->
            <div class="space-y-2">
              <label for="nik" class="block text-sm font-semibold text-gray-700">NIK *</label>
              <InputText
                id="nik"
                v-model="formData.nik"
                :class="{ 'p-invalid': errors.nik }"
                class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                placeholder="16 digit NIK"
                maxlength="16"
              />
              <small v-if="errors.nik" class="text-red-500 text-xs !mt-1">{{ errors.nik }}</small>
            </div>

            <!-- Gender -->
            <div class="space-y-2">
              <label for="gender" class="block text-sm font-semibold text-gray-700">Jenis Kelamin *</label>
              <Dropdown
                id="gender"
                v-model="formData.gender"
                :options="genderOptions"
                optionLabel="label"
                optionValue="value"
                :class="{ 'p-invalid': errors.gender }"
                class="w-full !rounded-xl !border-gray-300"
                placeholder="Pilih jenis kelamin"
              />
              <small v-if="errors.gender" class="text-red-500 text-xs !mt-1">{{ errors.gender }}</small>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Date of Birth -->
            <div class="space-y-2">
              <label for="dateOfBirth" class="block text-sm font-semibold text-gray-700">Tanggal Lahir *</label>
              <Calendar
                id="dateOfBirth"
                v-model="formData.dateOfBirth"
                :class="{ 'p-invalid': errors.dateOfBirth }"
                placeholder="DD/MM/YYYY"
                dateFormat="dd/mm/yy"
                :maxDate="new Date()"
                showIcon
                iconDisplay="input"
                inputClass="!rounded-xl !border-gray-300 !py-3 !pl-3 !pr-10 text-sm"
                :pt="{
                  root: { class: 'relative w-full' },
                  input: { class: '!rounded-xl !border-gray-300 !py-3 !pl-3 !pr-10 text-sm w-full' },
                  inputIcon: { class: 'absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center' }
                }"
              />
              <small v-if="errors.dateOfBirth" class="text-red-500 text-xs !mt-1">{{ errors.dateOfBirth }}</small>
            </div>

            <!-- Job -->
            <div class="space-y-2">
              <label for="job" class="block text-sm font-semibold text-gray-700">Pekerjaan</label>
              <InputText
                id="job"
                v-model="formData.job"
                class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                placeholder="Masukkan pekerjaan"
              />
            </div>
          </div>
        </div>

        <!-- Address Section -->
        <div class="bg-white rounded-2xl border border-gray-200 !p-5 !mb-6">
          <h3 class="text-lg font-semibold text-gray-800 !mb-4">
            <i class="pi pi-map-marker text-green-600 !mr-2"></i>
            Alamat
          </h3>
          
          <!-- Address -->
          <div class="space-y-2">
            <label for="address" class="block text-sm font-semibold text-gray-700">Alamat Lengkap *</label>
            <Textarea
              id="address"
              v-model="formData.address"
              :class="{ 'p-invalid': errors.address }"
              class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
              placeholder="Masukkan alamat lengkap"
              rows="3"
            />
            <small v-if="errors.address" class="text-red-500 text-xs !mt-1">{{ errors.address }}</small>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- RT -->
            <div class="space-y-2">
              <label for="rt" class="block text-sm font-semibold text-gray-700">RT *</label>
              <InputText
                id="rt"
                v-model="formData.rt"
                :class="{ 'p-invalid': errors.rt }"
                class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                placeholder="RT (contoh: 001)"
                maxlength="3"
              />
              <small v-if="errors.rt" class="text-red-500 text-xs !mt-1">{{ errors.rt }}</small>
            </div>

            <!-- RW -->
            <div class="space-y-2">
              <label for="rw" class="block text-sm font-semibold text-gray-700">RW *</label>
              <InputText
                id="rw"
                v-model="formData.rw"
                :class="{ 'p-invalid': errors.rw }"
                class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                placeholder="RW (contoh: 003)"
                maxlength="3"
              />
              <small v-if="errors.rw" class="text-red-500 text-xs !mt-1">{{ errors.rw }}</small>
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
  firstName: '',
  lastName: '',
  nik: '',
  gender: '' as 'Laki-laki' | 'Perempuan' | '',
  dateOfBirth: null as Date | null,
  job: '',
  address: '',
  rt: '',
  rw: ''
})

// Form validation errors
const errors = ref({
  firstName: '',
  lastName: '',
  nik: '',
  gender: '',
  dateOfBirth: '',
  address: '',
  rt: '',
  rw: ''
})

// Form state
const isSubmitting = ref(false)

// Options for dropdowns
const genderOptions = [
  { label: 'Laki-laki', value: 'Laki-laki' },
  { label: 'Perempuan', value: 'Perempuan' }
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
    firstName: lansia.firstName || '',
    lastName: lansia.lastName || '',
    nik: lansia.nik || '',
    gender: lansia.gender || '',
    dateOfBirth: lansia.dateOfBirth || null,
    job: lansia.job || '',
    address: lansia.address || '',
    rt: lansia.rt || '',
    rw: lansia.rw || ''
  }
}

// Clear all errors
const clearErrors = () => {
  errors.value = {
    firstName: '',
    lastName: '',
    nik: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    rt: '',
    rw: ''
  }
}

// Validation functions
const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  // First Name validation
  if (!formData.value.firstName.trim()) {
    errors.value.firstName = 'Nama depan wajib diisi'
    isValid = false
  }

  // Last Name validation
  if (!formData.value.lastName.trim()) {
    errors.value.lastName = 'Nama belakang wajib diisi'
    isValid = false
  }

  // NIK validation
  if (!formData.value.nik.trim()) {
    errors.value.nik = 'NIK wajib diisi'
    isValid = false
  } else if (!/^\d{16}$/.test(formData.value.nik)) {
    errors.value.nik = 'NIK harus 16 digit angka'
    isValid = false
  }

  // Gender validation
  if (!formData.value.gender) {
    errors.value.gender = 'Jenis kelamin wajib dipilih'
    isValid = false
  }

  // Date of birth validation
  if (!formData.value.dateOfBirth) {
    errors.value.dateOfBirth = 'Tanggal lahir wajib diisi'
    isValid = false
  }

  // Address validation
  if (!formData.value.address.trim()) {
    errors.value.address = 'Alamat wajib diisi'
    isValid = false
  }

  // RT validation
  if (!formData.value.rt.trim()) {
    errors.value.rt = 'RT wajib diisi'
    isValid = false
  } else if (!/^\d{3}$/.test(formData.value.rt)) {
    errors.value.rt = 'RT harus 3 digit angka (contoh: 001)'
    isValid = false
  }

  // RW validation
  if (!formData.value.rw.trim()) {
    errors.value.rw = 'RW wajib diisi'
    isValid = false
  } else if (!/^\d{3}$/.test(formData.value.rw)) {
    errors.value.rw = 'RW harus 3 digit angka (contoh: 003)'
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
    // Calculate age from date of birth
    const today = new Date()
    const birthDate = formData.value.dateOfBirth!
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    // Prepare data for saving
    const updatedData: Partial<Lansia> = {
      firstName: formData.value.firstName.trim(),
      lastName: formData.value.lastName.trim(),
      nik: formData.value.nik.trim(),
      gender: formData.value.gender as 'Laki-laki' | 'Perempuan',
      dateOfBirth: formData.value.dateOfBirth!,
      age,
      job: formData.value.job.trim() || undefined,
      address: formData.value.address.trim(),
      rt: formData.value.rt.trim(),
      rw: formData.value.rw.trim()
    }

    emit('save', updatedData)
    visible.value = false
  } catch (error) {
    console.error('Error saving personal info:', error)
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
/* No custom calendar styling needed - using PassThrough props */
</style>
