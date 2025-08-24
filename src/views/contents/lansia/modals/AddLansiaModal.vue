<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    :header="isEdit ? 'Edit Data Lansia' : getStepTitle()"
    :style="{ width: '500px' }"
    :closable="true"
    :draggable="false"
  >
    <!-- Step Progress Indicator -->
    <div class="!mb-6" v-if="!isEdit">
      <div class="flex items-center justify-center space-x-4">
        <div v-for="step in 3" :key="step" class="flex items-center">
          <div :class="getStepCircleClass(step)" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
            <i v-if="step < currentStep" class="pi pi-check text-white"></i>
            <span v-else>{{ step }}</span>
          </div>
          <div v-if="step < 3" :class="getStepLineClass(step)" class="w-12 h-0.5 mx-2"></div>
        </div>
      </div>
      <div class="flex justify-center !mt-3">
        <span class="text-sm text-gray-600">{{ getStepDescription() }}</span>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Step 1: Personal Information -->
      <div v-if="currentStep === 1 || isEdit">
        <h3 v-if="!isEdit" class="text-lg font-semibold text-gray-800 !mb-4">Informasi Pribadi</h3>
        
        <!-- NIK Field -->
        <div class="space-y-2">
          <label for="nik" class="block text-sm font-semibold text-gray-700">NIK *</label>
          <InputText
            id="nik"
            v-model="formData.nik"
            :class="{ 'p-invalid': errors.nik }"
            placeholder="Masukkan NIK (16 digit)"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            required
          />
          <small v-if="errors.nik" class="text-red-500 text-xs !mt-1">{{ errors.nik }}</small>
        </div>

        <!-- First Name Field -->
        <div class="space-y-2">
          <label for="firstName" class="block text-sm font-semibold text-gray-700">Nama Depan *</label>
          <InputText
            id="firstName"
            v-model="formData.firstName"
            :class="{ 'p-invalid': errors.firstName }"
            placeholder="Masukkan nama depan"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            required
          />
          <small v-if="errors.firstName" class="text-red-500 text-xs !mt-1">{{ errors.firstName }}</small>
        </div>

        <!-- Last Name Field -->
        <div class="space-y-2">
          <label for="lastName" class="block text-sm font-semibold text-gray-700">Nama Belakang *</label>
          <InputText
            id="lastName"
            v-model="formData.lastName"
            :class="{ 'p-invalid': errors.lastName }"
            placeholder="Masukkan nama belakang"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            required
          />
          <small v-if="errors.lastName" class="text-red-500 text-xs !mt-1">{{ errors.lastName }}</small>
        </div>

        <!-- Date of Birth Field -->
        <div class="space-y-2">
          <label for="dateOfBirth" class="block text-sm font-semibold text-gray-700">Tanggal Lahir *</label>
          <InputText
            id="dateOfBirth"
            v-model="formData.dateOfBirth"
            :class="{ 'p-invalid': errors.dateOfBirth }"
            placeholder="YYYY-MM-DD"
            type="date"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            required
          />
          <small v-if="errors.dateOfBirth" class="text-red-500 text-xs !mt-1">{{ errors.dateOfBirth }}</small>
        </div>

        <!-- Gender Field -->
        <div class="space-y-2">
          <label for="gender" class="block text-sm font-semibold text-gray-700">Jenis Kelamin *</label>
          <Dropdown
            id="gender"
            v-model="formData.gender"
            :options="genderOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Pilih jenis kelamin"
            :class="{ 'p-invalid': errors.gender }"
            class="w-full !rounded-xl !border-gray-300"
            required
          />
          <small v-if="errors.gender" class="text-red-500 text-xs !mt-1">{{ errors.gender }}</small>
        </div>

        <!-- Address Field -->
        <div class="space-y-2">
          <label for="address" class="block text-sm font-semibold text-gray-700">Alamat *</label>
          <Textarea
            id="address"
            v-model="formData.address"
            :class="{ 'p-invalid': errors.address }"
            placeholder="Masukkan alamat lengkap"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            rows="3"
            required
          />
          <small v-if="errors.address" class="text-red-500 text-xs !mt-1">{{ errors.address }}</small>
        </div>

        <!-- RT Field -->
        <div class="space-y-2">
          <label for="rt" class="block text-sm font-semibold text-gray-700">RT *</label>
          <InputText
            id="rt"
            v-model="formData.rt"
            :class="{ 'p-invalid': errors.rt }"
            placeholder="Masukkan RT (contoh: 001)"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            required
          />
          <small v-if="errors.rt" class="text-red-500 text-xs !mt-1">{{ errors.rt }}</small>
        </div>

        <!-- RW Field -->
        <div class="space-y-2">
          <label for="rw" class="block text-sm font-semibold text-gray-700">RW *</label>
          <InputText
            id="rw"
            v-model="formData.rw"
            :class="{ 'p-invalid': errors.rw }"
            placeholder="Masukkan RW (contoh: 003)"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            required
          />
          <small v-if="errors.rw" class="text-red-500 text-xs !mt-1">{{ errors.rw }}</small>
        </div>

        <!-- Additional fields for edit mode -->
        <template v-if="isEdit">
          <!-- Phone Field -->
          <div class="space-y-2">
            <label for="phone" class="block text-sm font-semibold text-gray-700">Nomor Telepon</label>
            <InputText
              id="phone"
              v-model="formData.phone"
              :class="{ 'p-invalid': errors.phone }"
              placeholder="Masukkan nomor telepon"
              class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            />
            <small v-if="errors.phone" class="text-red-500 text-xs !mt-1">{{ errors.phone }}</small>
          </div>

          <!-- Emergency Contact -->
          <div class="space-y-2">
            <label for="emergencyContact" class="block text-sm font-semibold text-gray-700">Kontak Darurat</label>
            <InputText
              id="emergencyContact"
              v-model="formData.emergencyContact"
              :class="{ 'p-invalid': errors.emergencyContact }"
              placeholder="Nama kontak darurat"
              class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            />
            <small v-if="errors.emergencyContact" class="text-red-500 text-xs !mt-1">{{ errors.emergencyContact }}</small>
          </div>

          <!-- Health Status -->
          <div class="space-y-2">
            <label for="healthStatus" class="block text-sm font-semibold text-gray-700">Status Kesehatan</label>
            <Dropdown
              id="healthStatus"
              v-model="formData.healthStatus"
              :options="healthStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Pilih status kesehatan"
              :class="{ 'p-invalid': errors.healthStatus }"
              class="w-full !rounded-xl !border-gray-300"
            />
            <small v-if="errors.healthStatus" class="text-red-500 text-xs !mt-1">{{ errors.healthStatus }}</small>
          </div>
        </template>
      </div>

      <!-- Step 2: Contact & Emergency -->
      <div v-if="currentStep === 2 && !isEdit">
        <h3 class="text-lg font-semibold text-gray-800 !mb-4">Kontak & Darurat</h3>
        
        <!-- Phone Field -->
        <div class="space-y-2">
          <label for="phone" class="block text-sm font-semibold text-gray-700">Nomor Telepon</label>
          <InputText
            id="phone"
            v-model="formData.phone"
            :class="{ 'p-invalid': errors.phone }"
            placeholder="Masukkan nomor telepon"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
          />
          <small v-if="errors.phone" class="text-red-500 text-xs !mt-1">{{ errors.phone }}</small>
        </div>

        <!-- Emergency Contact -->
        <div class="space-y-2">
          <label for="emergencyContact" class="block text-sm font-semibold text-gray-700">Kontak Darurat *</label>
          <InputText
            id="emergencyContact"
            v-model="formData.emergencyContact"
            :class="{ 'p-invalid': errors.emergencyContact }"
            placeholder="Nama kontak darurat (contoh: Ahmad Fauzi - Anak)"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            required
          />
          <small v-if="errors.emergencyContact" class="text-red-500 text-xs !mt-1">{{ errors.emergencyContact }}</small>
        </div>

        <!-- Emergency Phone -->
        <div class="space-y-2">
          <label for="emergencyPhone" class="block text-sm font-semibold text-gray-700">Nomor Kontak Darurat *</label>
          <InputText
            id="emergencyPhone"
            v-model="formData.emergencyPhone"
            :class="{ 'p-invalid': errors.emergencyPhone }"
            placeholder="Masukkan nomor telepon kontak darurat"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            required
          />
          <small v-if="errors.emergencyPhone" class="text-red-500 text-xs !mt-1">{{ errors.emergencyPhone }}</small>
        </div>

        <!-- Caregiver Status -->
        <div class="space-y-2">
          <label for="caregiverStatus" class="block text-sm font-semibold text-gray-700">Status Caregiver *</label>
          <Dropdown
            id="caregiverStatus"
            v-model="formData.caregiverStatus"
            :options="caregiverStatusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Pilih status caregiver"
            :class="{ 'p-invalid': errors.caregiverStatus }"
            class="w-full !rounded-xl !border-gray-300"
            required
          />
          <small v-if="errors.caregiverStatus" class="text-red-500 text-xs !mt-1">{{ errors.caregiverStatus }}</small>
        </div>
      </div>

      <!-- Step 3: Health Information -->
      <div v-if="currentStep === 3 && !isEdit">
        <h3 class="text-lg font-semibold text-gray-800 !mb-4">Informasi Kesehatan</h3>
        
        <!-- Health Status -->
        <div class="space-y-2">
          <label for="healthStatus" class="block text-sm font-semibold text-gray-700">Status Kesehatan *</label>
          <Dropdown
            id="healthStatus"
            v-model="formData.healthStatus"
            :options="healthStatusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Pilih status kesehatan"
            :class="{ 'p-invalid': errors.healthStatus }"
            class="w-full !rounded-xl !border-gray-300"
            required
          />
          <small v-if="errors.healthStatus" class="text-red-500 text-xs !mt-1">{{ errors.healthStatus }}</small>
        </div>

        <!-- Medical Conditions -->
        <div class="space-y-2">
          <label for="medicalConditions" class="block text-sm font-semibold text-gray-700">Kondisi Medis</label>
          <Textarea
            id="medicalConditions"
            v-model="medicalConditionsText"
            :class="{ 'p-invalid': errors.medicalConditions }"
            placeholder="Masukkan kondisi medis (pisahkan dengan koma jika lebih dari satu)"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            rows="3"
          />
          <small v-if="errors.medicalConditions" class="text-red-500 text-xs !mt-1">{{ errors.medicalConditions }}</small>
          <small class="text-gray-500 text-xs">Contoh: Hipertensi, Diabetes, Osteoporosis</small>
        </div>

        <!-- Last Checkup -->
        <div class="space-y-2">
          <label for="lastCheckup" class="block text-sm font-semibold text-gray-700">Terakhir Periksa</label>
          <InputText
            id="lastCheckup"
            v-model="formData.lastCheckup"
            :class="{ 'p-invalid': errors.lastCheckup }"
            placeholder="YYYY-MM-DD"
            type="date"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
          />
          <small v-if="errors.lastCheckup" class="text-red-500 text-xs !mt-1">{{ errors.lastCheckup }}</small>
        </div>

        <!-- Profile Image -->
        <div class="space-y-2">
          <label for="profileImage" class="block text-sm font-semibold text-gray-700">Foto Profil (Optional)</label>
          <InputText
            id="profileImage"
            v-model="formData.profileImage"
            :class="{ 'p-invalid': errors.profileImage }"
            placeholder="URL foto profil (opsional)"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
          />
          <small v-if="errors.profileImage" class="text-red-500 text-xs !mt-1">{{ errors.profileImage }}</small>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between !mt-8">
      <!-- Left side - Previous/Cancel -->
      <div>
        <Button
          v-if="currentStep > 1 && !isEdit"
          label="Sebelumnya"
          severity="secondary"
          outlined
          @click="previousStep"
        />
        <Button
          v-else
          label="Batal"
          severity="secondary"
          outlined
          @click="handleCancel"
        />
      </div>

      <!-- Right side - Next/Finish -->
      <div>
        <Button
          v-if="currentStep < 3 && !isEdit"
          label="Selanjutnya"
          @click="nextStep"
        />
        <Button
          v-else
          :label="isEdit ? 'Update Data' : 'Simpan Data'"
          :loading="isLoading"
          @click="handleSubmit"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import type { Lansia } from '../composables/useLansiaManagement'

// Form data interface - handles string dates from HTML inputs
interface LansiaFormData {
  id?: string
  nik: string
  firstName: string
  lastName: string
  dateOfBirth: string  // HTML date inputs return strings
  age?: number
  gender: 'Laki-laki' | 'Perempuan'
  address: string
  rt: string
  rw: string
  phone: string
  emergencyContact: string
  emergencyPhone: string
  caregiverStatus: 'Ada' | 'Tidak Ada'
  healthStatus: 1 | 2 | 3
  medicalConditions: string[]
  lastCheckup: string  // HTML date inputs return strings
  profileImage?: string
  createdAt?: Date
}

interface Props {
  visible: boolean
  lansia?: Lansia | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', lansia: Omit<Lansia, 'id' | 'age' | 'createdAt'>): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Step management for wizard flow
const currentStep = ref(1)
const medicalConditionsText = ref('')

// Form data
const formData = ref<LansiaFormData>({
  nik: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'Laki-laki',
  address: '',
  rt: '',
  rw: '',
  phone: '',
  emergencyContact: '',
  emergencyPhone: '',
  caregiverStatus: 'Ada',
  healthStatus: 1,
  medicalConditions: [],
  lastCheckup: '',
  profileImage: ''
})

// Form validation errors
const errors = ref({
  nik: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  rt: '',
  rw: '',
  phone: '',
  emergencyContact: '',
  emergencyPhone: '',
  caregiverStatus: '',
  healthStatus: '',
  medicalConditions: '',
  lastCheckup: '',
  profileImage: ''
})

// Loading state
const isLoading = ref(false)

// Options
const genderOptions = [
  { label: 'Laki-laki', value: 'Laki-laki' },
  { label: 'Perempuan', value: 'Perempuan' }
]

const healthStatusOptions = [
  { label: 'Level 1 (Baik)', value: 1 },
  { label: 'Level 2 (Cukup)', value: 2 },
  { label: 'Level 3 (Perlu Perhatian)', value: 3 }
]

const caregiverStatusOptions = [
  { label: 'Ada', value: 'Ada' },
  { label: 'Tidak Ada', value: 'Tidak Ada' }
]

// Computed properties
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isEdit = computed(() => !!props.lansia?.id)

// Watchers
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    resetForm()
    if (props.lansia) {
      // Edit mode - populate form with existing lansia data
      const lansiaData = { ...props.lansia }
      
      // Convert Lansia to LansiaFormData format
      const formDataConverted: LansiaFormData = {
        ...lansiaData,
        dateOfBirth: lansiaData.dateOfBirth instanceof Date 
          ? lansiaData.dateOfBirth.toISOString().split('T')[0] 
          : String(lansiaData.dateOfBirth),
        lastCheckup: lansiaData.lastCheckup instanceof Date 
          ? lansiaData.lastCheckup.toISOString().split('T')[0] 
          : String(lansiaData.lastCheckup)
      }
      
      formData.value = formDataConverted
      medicalConditionsText.value = lansiaData.medicalConditions?.join(', ') || ''
    }
  }
})

// Methods
const resetForm = () => {
  currentStep.value = 1
  medicalConditionsText.value = ''
  formData.value = {
    nik: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Laki-laki',
    address: '',
    rt: '',
    rw: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    caregiverStatus: 'Ada',
    healthStatus: 1,
    medicalConditions: [],
    lastCheckup: '',
    profileImage: ''
  }
  errors.value = {
    nik: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    rt: '',
    rw: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    caregiverStatus: '',
    healthStatus: '',
    medicalConditions: '',
    lastCheckup: '',
    profileImage: ''
  }
}

// Step-related methods
const getStepTitle = () => {
  switch (currentStep.value) {
    case 1:
      return 'Tambah Lansia - Informasi Pribadi'
    case 2:
      return 'Tambah Lansia - Kontak & Darurat'
    case 3:
      return 'Tambah Lansia - Informasi Kesehatan'
    default:
      return 'Tambah Lansia'
  }
}

const getStepDescription = () => {
  switch (currentStep.value) {
    case 1:
      return 'Masukkan informasi dasar'
    case 2:
      return 'Masukkan informasi kontak darurat'
    case 3:
      return 'Masukkan informasi kesehatan'
    default:
      return ''
  }
}

const getStepCircleClass = (step: number) => {
  if (step < currentStep.value) {
    return 'bg-green-500 text-white'
  } else if (step === currentStep.value) {
    return 'bg-blue-500 text-white'
  } else {
    return 'bg-gray-300 text-gray-600'
  }
}

const getStepLineClass = (step: number) => {
  if (step < currentStep.value) {
    return 'bg-green-500'
  } else {
    return 'bg-gray-300'
  }
}

// Step-specific validation
const validateStep = (step: number): boolean => {
  const newErrors = { ...errors.value }

  if (step === 1 || isEdit.value) {
    // Step 1: Personal Information validation
    // NIK validation
    if (!formData.value.nik.trim()) {
      newErrors.nik = 'NIK wajib diisi'
    } else if (!/^\d{16}$/.test(formData.value.nik.trim())) {
      newErrors.nik = 'NIK harus 16 digit angka'
    } else {
      newErrors.nik = ''
    }

    // First Name validation
    if (!formData.value.firstName.trim()) {
      newErrors.firstName = 'Nama depan wajib diisi'
    } else if (formData.value.firstName.trim().length < 2) {
      newErrors.firstName = 'Nama depan minimal 2 karakter'
    } else {
      newErrors.firstName = ''
    }

    // Last Name validation
    if (!formData.value.lastName.trim()) {
      newErrors.lastName = 'Nama belakang wajib diisi'
    } else if (formData.value.lastName.trim().length < 2) {
      newErrors.lastName = 'Nama belakang minimal 2 karakter'
    } else {
      newErrors.lastName = ''
    }

    // Date of Birth validation
    if (!formData.value.dateOfBirth) {
      newErrors.dateOfBirth = 'Tanggal lahir wajib diisi'
    } else {
      newErrors.dateOfBirth = ''
    }

    // Gender validation
    if (!formData.value.gender) {
      newErrors.gender = 'Jenis kelamin wajib dipilih'
    } else {
      newErrors.gender = ''
    }

    // Address validation
    if (!formData.value.address.trim()) {
      newErrors.address = 'Alamat wajib diisi'
    } else {
      newErrors.address = ''
    }

    // RT validation
    if (!formData.value.rt.trim()) {
      newErrors.rt = 'RT wajib diisi'
    } else {
      newErrors.rt = ''
    }

    // RW validation
    if (!formData.value.rw.trim()) {
      newErrors.rw = 'RW wajib diisi'
    } else {
      newErrors.rw = ''
    }
  }

  if (step === 2 || isEdit.value) {
    // Step 2: Contact & Emergency validation
    // Phone validation (optional)
    if (formData.value.phone && !/^[0-9+\-\s()]{10,15}$/.test(formData.value.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format nomor telepon tidak valid'
    } else {
      newErrors.phone = ''
    }

    // Emergency Contact validation
    if (!formData.value.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Kontak darurat wajib diisi'
    } else {
      newErrors.emergencyContact = ''
    }

    // Emergency Phone validation
    if (!formData.value.emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Nomor kontak darurat wajib diisi'
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.value.emergencyPhone.replace(/\s/g, ''))) {
      newErrors.emergencyPhone = 'Format nomor telepon tidak valid'
    } else {
      newErrors.emergencyPhone = ''
    }

    // Caregiver Status validation
    if (!formData.value.caregiverStatus) {
      newErrors.caregiverStatus = 'Status caregiver wajib dipilih'
    } else {
      newErrors.caregiverStatus = ''
    }
  }

  if (step === 3) {
    // Step 3: Health Information validation
    // Health Status validation
    if (!formData.value.healthStatus) {
      newErrors.healthStatus = 'Status kesehatan wajib dipilih'
    } else {
      newErrors.healthStatus = ''
    }

    // Profile image validation (optional)
    if (formData.value.profileImage && formData.value.profileImage.trim()) {
      const urlRegex = /^(https?:\/\/)?[\da-z.-]+\.[a-z.]{2,6}[/\w .-]*\/?$/
      if (!urlRegex.test(formData.value.profileImage)) {
        newErrors.profileImage = 'Format URL tidak valid'
      } else {
        newErrors.profileImage = ''
      }
    } else {
      newErrors.profileImage = ''
    }
  }

  errors.value = newErrors

  // Check if current step has no errors
  if (step === 1 || isEdit.value) {
    return !newErrors.nik && !newErrors.firstName && !newErrors.lastName && !newErrors.dateOfBirth && !newErrors.gender && !newErrors.address && !newErrors.rt && !newErrors.rw
  } else if (step === 2) {
    return !newErrors.phone && !newErrors.emergencyContact && !newErrors.emergencyPhone && !newErrors.caregiverStatus
  } else if (step === 3) {
    return !newErrors.healthStatus && !newErrors.profileImage
  }

  return true
}

// Full form validation for final submission
const validateForm = (): boolean => {
  return validateStep(1) && validateStep(2) && validateStep(3)
}

// Step navigation
const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < 3) {
      currentStep.value++
    }
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Process medical conditions
    const medicalConditions = medicalConditionsText.value
      ? medicalConditionsText.value.split(',').map(condition => condition.trim()).filter(condition => condition)
      : []
    
    const lansiaData: Omit<Lansia, 'id' | 'age' | 'createdAt'> = {
      ...formData.value,
      // Convert string dates to Date objects
      dateOfBirth: new Date(formData.value.dateOfBirth),
      lastCheckup: formData.value.lastCheckup ? new Date(formData.value.lastCheckup) : new Date(),
      medicalConditions,
      // Convert empty string to undefined for optional fields
      profileImage: formData.value.profileImage?.trim() || undefined,
    }

    emit('submit', lansiaData)
    visible.value = false
  } catch (error) {
    console.error('Error submitting lansia:', error)
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}
</script>