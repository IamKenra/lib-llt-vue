<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    :header="isEdit ? 'Edit User' : 'Add New User'"
    :style="{ width: '450px' }"
    :closable="true"
    :draggable="false"
  >
    <div class="space-y-6">
      <!-- Name Field -->
      <div class="space-y-2">
        <label for="name" class="block text-sm font-semibold text-gray-700">Full Name *</label>
        <InputText
          id="name"
          v-model="formData.name"
          :class="{ 'p-invalid': errors.name }"
          placeholder="Enter full name"
          class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
          required
        />
        <small v-if="errors.name" class="text-red-500 text-xs !mt-1">{{ errors.name }}</small>
      </div>

      <!-- Email Field -->
      <div class="space-y-2">
        <label for="email" class="block text-sm font-semibold text-gray-700">Email *</label>
        <InputText
          id="email"
          v-model="formData.email"
          :class="{ 'p-invalid': errors.email }"
          placeholder="Enter email address"
          type="email"
          class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
          required
        />
        <small v-if="errors.email" class="text-red-500 text-xs !mt-1">{{ errors.email }}</small>
      </div>

      <!-- Phone Field -->
      <div class="space-y-2">
        <label for="phone" class="block text-sm font-semibold text-gray-700">Phone Number *</label>
        <InputText
          id="phone"
          v-model="formData.phone"
          :class="{ 'p-invalid': errors.phone }"
          placeholder="Enter phone number"
          class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
          required
        />
        <small v-if="errors.phone" class="text-red-500 text-xs !mt-1">{{ errors.phone }}</small>
      </div>

      <!-- Role Field -->
      <div class="space-y-2">
        <label for="role" class="block text-sm font-semibold text-gray-700">Role *</label>
        <Dropdown
          id="role"
          v-model="formData.role"
          :options="roleOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a role"
          :class="{ 'p-invalid': errors.role }"
          class="w-full !rounded-xl !border-gray-300"
          required
        />
        <small v-if="errors.role" class="text-red-500 text-xs !mt-1">{{ errors.role }}</small>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-3 !mt-8">
      <Button
        label="Cancel"
        severity="secondary"
        outlined
        @click="handleCancel"
      />
      <Button
        :label="isEdit ? 'Update User' : 'Add User'"
        :loading="isLoading"
        @click="handleSubmit"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

interface User {
  id?: string
  name: string
  email: string
  phone: string
  role: string
  createdAt?: Date
}

interface Props {
  visible: boolean
  user?: User | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', user: User): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form data
const formData = ref<User>({
  name: '',
  email: '',
  phone: '',
  role: ''
})

// Form validation errors
const errors = ref({
  name: '',
  email: '',
  phone: '',
  role: ''
})

// Loading state
const isLoading = ref(false)

// Role options
const roleOptions = [
  { label: 'Super Admin', value: 'Super Admin' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Surveyor', value: 'Surveyor' }
]

// Computed properties
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isEdit = computed(() => !!props.user?.id)

// Watchers
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    resetForm()
    if (props.user) {
      // Edit mode - populate form with existing user data
      formData.value = { ...props.user }
    }
  }
})

// Methods
const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    role: ''
  }
  errors.value = {
    name: '',
    email: '',
    phone: '',
    role: ''
  }
}

const validateForm = (): boolean => {
  const newErrors = {
    name: '',
    email: '',
    phone: '',
    role: ''
  }

  // Name validation
  if (!formData.value.name.trim()) {
    newErrors.name = 'Name is required'
  } else if (formData.value.name.trim().length < 2) {
    newErrors.name = 'Name must be at least 2 characters'
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!emailRegex.test(formData.value.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  // Phone validation
  const phoneRegex = /^[0-9+\-\s()]{10,15}$/
  if (!formData.value.phone.trim()) {
    newErrors.phone = 'Phone number is required'
  } else if (!phoneRegex.test(formData.value.phone.replace(/\s/g, ''))) {
    newErrors.phone = 'Please enter a valid phone number'
  }

  // Role validation
  if (!formData.value.role) {
    newErrors.role = 'Role is required'
  }

  errors.value = newErrors
  return !Object.values(newErrors).some(error => error !== '')
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const userData: User = {
      ...formData.value,
      createdAt: props.user?.createdAt || new Date()
    }
    
    if (isEdit.value && props.user?.id) {
      userData.id = props.user.id
    }

    emit('submit', userData)
    visible.value = false
  } catch (error) {
    console.error('Error submitting user:', error)
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}
</script>

<!-- All modal styles are now global via modal-global.css -->