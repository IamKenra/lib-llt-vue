<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    header="Edit Kontak & Darurat"
    :style="{ width: '520px' }"
    :closable="true"
    :draggable="false"
  >
    <div class="space-y-6">
        
        <!-- Contact Info Section -->
        <div class="bg-white rounded-2xl border border-gray-200 !p-5">
          <h3 class="text-lg font-semibold text-gray-800 !mb-4">
            <i class="pi pi-phone text-green-600 !mr-2"></i>
            Informasi Kontak
          </h3>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- Phone -->
            <div class="space-y-2">
              <label for="phone" class="block text-sm font-semibold text-gray-700">Nomor Telepon</label>
              <InputText
                id="phone"
                v-model="formData.phone"
                :class="{ 'p-invalid': errors.phone }"
                class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                placeholder="08xxxxxxxxxx"
              />
              <small v-if="errors.phone" class="text-red-500 text-xs !mt-1">{{ errors.phone }}</small>
            </div>

            <!-- Caregiver Status -->
            <div class="space-y-2">
              <label for="caregiverStatus" class="block text-sm font-semibold text-gray-700">Status Caregiver *</label>
              <Dropdown
                id="caregiverStatus"
                v-model="formData.caregiverStatus"
                :options="caregiverOptions"
                optionLabel="label"
                optionValue="value"
                :class="{ 'p-invalid': errors.caregiverStatus }"
                class="w-full !rounded-xl !border-gray-300"
                placeholder="Pilih status caregiver"
              />
              <small v-if="errors.caregiverStatus" class="text-red-500 text-xs !mt-1">{{ errors.caregiverStatus }}</small>
            </div>
          </div>
        </div>

        <!-- Emergency Contacts Section -->
        <div class="bg-white rounded-2xl border border-gray-200 !p-5">
          <h3 class="text-lg font-semibold text-gray-800 !mb-4">
            <i class="pi pi-exclamation-triangle text-orange-600 !mr-2"></i>
            Kontak Darurat Utama
          </h3>
          
          <div class="grid grid-cols-1 gap-4">
            <!-- Emergency Contact Name -->
            <div class="space-y-2">
              <label for="emergencyContact" class="block text-sm font-semibold text-gray-700">Nama Kontak Darurat *</label>
              <InputText
                id="emergencyContact"
                v-model="formData.emergencyContact"
                :class="{ 'p-invalid': errors.emergencyContact }"
                class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                placeholder="Nama lengkap kontak darurat"
              />
              <small v-if="errors.emergencyContact" class="text-red-500 text-xs !mt-1">{{ errors.emergencyContact }}</small>
            </div>

            <!-- Emergency Phone -->
            <div class="space-y-2">
              <label for="emergencyPhone" class="block text-sm font-semibold text-gray-700">Nomor Telepon Darurat *</label>
              <InputText
                id="emergencyPhone"
                v-model="formData.emergencyPhone"
                :class="{ 'p-invalid': errors.emergencyPhone }"
                class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                placeholder="08xxxxxxxxxx"
              />
              <small v-if="errors.emergencyPhone" class="text-red-500 text-xs !mt-1">{{ errors.emergencyPhone }}</small>
            </div>

            <!-- Emergency Relationship -->
            <div class="space-y-2">
              <label for="emergencyRelationship" class="block text-sm font-semibold text-gray-700">Hubungan *</label>
              <Dropdown
                id="emergencyRelationship"
                v-model="formData.emergencyRelationship"
                :options="relationshipOptions"
                optionLabel="label"
                optionValue="value"
                :class="{ 'p-invalid': errors.emergencyRelationship }"
                class="w-full !rounded-xl !border-gray-300"
                placeholder="Pilih hubungan"
              />
              <small v-if="errors.emergencyRelationship" class="text-red-500 text-xs !mt-1">{{ errors.emergencyRelationship }}</small>
            </div>
          </div>
        </div>

        <!-- Additional Emergency Contacts Section -->
        <div class="bg-white rounded-2xl border border-gray-200 !p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 !mb-0">
              <i class="pi pi-users text-blue-600 !mr-2"></i>
              Kontak Darurat Tambahan
            </h3>
            <Button
              type="button"
              icon="pi pi-plus"
              size="small"
              rounded
              outlined
              class="p-button-primary"
              title="Tambah kontak darurat"
              @click="addEmergencyContact"
            />
          </div>

          <div v-if="additionalContacts.length === 0" class="text-center py-8 text-gray-500">
            <i class="pi pi-users text-3xl mb-2 block text-gray-400"></i>
            <p class="text-sm">Belum ada kontak darurat tambahan</p>
            <Button
              type="button"
              label="Tambah Kontak"
              icon="pi pi-plus"
              size="small"
              outlined
              class="mt-3"
              @click="addEmergencyContact"
            />
          </div>

          <!-- Additional Emergency Contacts List -->
          <div v-else class="space-y-3">
            <div 
              v-for="(contact, index) in additionalContacts" 
              :key="index"
              class="additional-contact-card"
            >
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-sm font-bold text-blue-600">{{ index + 2 }}</span>
                </div>
                
                <div class="flex-1 space-y-3">
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 !mb-1">Nama Lengkap</label>
                      <InputText
                        v-model="contact.name"
                        class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                        placeholder="Nama kontak"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 !mb-1">Nomor Telepon</label>
                      <InputText
                        v-model="contact.phone"
                        class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 !mb-1">Hubungan</label>
                    <Dropdown
                      v-model="contact.relationship"
                      :options="relationshipOptions"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full !rounded-xl !border-gray-300"
                      placeholder="Pilih hubungan"
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
                  title="Hapus kontak"
                  @click="removeEmergencyContact(index)"
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
import Dropdown from 'primevue/dropdown'
import type { Lansia } from '../composables/useLansiaManagement'

interface EmergencyContact {
  name: string
  phone: string
  relationship: string
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
  phone: '',
  caregiverStatus: '' as 'Ada' | 'Tidak Ada' | '',
  emergencyContact: '',
  emergencyPhone: '',
  emergencyRelationship: ''
})

// Additional emergency contacts
const additionalContacts = ref<EmergencyContact[]>([])

// Form validation errors
const errors = ref({
  phone: '',
  caregiverStatus: '',
  emergencyContact: '',
  emergencyPhone: '',
  emergencyRelationship: ''
})

// Form state
const isSubmitting = ref(false)

// Options for dropdowns
const caregiverOptions = [
  { label: 'Ada', value: 'Ada' },
  { label: 'Tidak Ada', value: 'Tidak Ada' }
]

const relationshipOptions = [
  { label: 'Anak', value: 'Anak' },
  { label: 'Cucu', value: 'Cucu' },
  { label: 'Menantu', value: 'Menantu' },
  { label: 'Saudara', value: 'Saudara' },
  { label: 'Tetangga', value: 'Tetangga' },
  { label: 'Dokter Pribadi', value: 'Dokter Pribadi' },
  { label: 'Perawat', value: 'Perawat' },
  { label: 'Lainnya', value: 'Lainnya' }
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
    phone: lansia.phone || '',
    caregiverStatus: lansia.caregiverStatus || '',
    emergencyContact: lansia.emergencyContact || '',
    emergencyPhone: lansia.emergencyPhone || '',
    emergencyRelationship: 'Keluarga' // Default value, could be extracted from emergencyContact
  }

  // Clear additional contacts for now (could be extended to load from lansia data)
  additionalContacts.value = []
}

// Clear all errors
const clearErrors = () => {
  errors.value = {
    phone: '',
    caregiverStatus: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelationship: ''
  }
}

// Emergency contacts management
const addEmergencyContact = () => {
  additionalContacts.value.push({
    name: '',
    phone: '',
    relationship: ''
  })
}

const removeEmergencyContact = (index: number) => {
  additionalContacts.value.splice(index, 1)
}

// Validation functions
const validatePhoneNumber = (phone: string): boolean => {
  return /^(\+62|62|0)[0-9]{9,13}$/.test(phone.replace(/\s/g, ''))
}

const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  // Phone validation (optional)
  if (formData.value.phone && !validatePhoneNumber(formData.value.phone)) {
    errors.value.phone = 'Format nomor telepon tidak valid'
    isValid = false
  }

  // Caregiver status validation
  if (!formData.value.caregiverStatus) {
    errors.value.caregiverStatus = 'Status caregiver wajib dipilih'
    isValid = false
  }

  // Emergency contact validation
  if (!formData.value.emergencyContact.trim()) {
    errors.value.emergencyContact = 'Nama kontak darurat wajib diisi'
    isValid = false
  }

  // Emergency phone validation
  if (!formData.value.emergencyPhone.trim()) {
    errors.value.emergencyPhone = 'Nomor telepon darurat wajib diisi'
    isValid = false
  } else if (!validatePhoneNumber(formData.value.emergencyPhone)) {
    errors.value.emergencyPhone = 'Format nomor telepon darurat tidak valid'
    isValid = false
  }

  // Emergency relationship validation
  if (!formData.value.emergencyRelationship) {
    errors.value.emergencyRelationship = 'Hubungan dengan kontak darurat wajib dipilih'
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
      phone: formData.value.phone.trim() || undefined,
      caregiverStatus: formData.value.caregiverStatus as 'Ada' | 'Tidak Ada',
      emergencyContact: formData.value.emergencyContact.trim(),
      emergencyPhone: formData.value.emergencyPhone.trim()
    }

    emit('save', updatedData)
    visible.value = false
  } catch (error) {
    console.error('Error saving contact info:', error)
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
.additional-contact-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 200ms;
}

.additional-contact-card:hover {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-color: #d1d5db;
}
</style>