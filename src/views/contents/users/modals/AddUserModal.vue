<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    :header="isEdit ? 'Edit User' : getStepTitle()"
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
      <!-- Step 1: Basic Information -->
      <div v-if="currentStep === 1 || isEdit">
        <h3 v-if="!isEdit" class="text-lg font-semibold text-gray-800 !mb-4">Informasi Diri</h3>
        
        <!-- Name Field -->
        <div class="space-y-2">
          <label for="name" class="block text-sm font-semibold text-gray-700">Nama *</label>
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
          <label for="phone" class="block text-sm font-semibold text-gray-700">Nomor Telepon *</label>
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
          <label for="role" class="block text-sm font-semibold text-gray-700">Otoritas *</label>
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

        <!-- Additional fields for edit mode -->
        <template v-if="isEdit">
          <!-- Username Field -->
          <div class="space-y-2">
            <label for="username" class="block text-sm font-semibold text-gray-700">Username *</label>
            <InputText
              id="username"
              v-model="formData.username"
              :class="{ 'p-invalid': errors.username }"
              placeholder="Enter username"
              class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
              required
            />
            <small v-if="errors.username" class="text-red-500 text-xs !mt-1">{{ errors.username }}</small>
          </div>

          <!-- Password Field (optional for edit) -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-semibold text-gray-700">New Password (leave blank to keep current)</label>
            <InputText
              id="password"
              v-model="formData.password"
              :class="{ 'p-invalid': errors.password }"
              placeholder="Enter new password"
              type="password"
              class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            />
            <small v-if="errors.password" class="text-red-500 text-xs !mt-1">{{ errors.password }}</small>
          </div>

          <!-- Profile Image Field -->
          <div class="space-y-2">
            <label for="profileImage" class="block text-sm font-semibold text-gray-700">Profile Image URL</label>
            <InputText
              id="profileImage"
              v-model="formData.profileImage"
              :class="{ 'p-invalid': errors.profileImage }"
              placeholder="Enter profile image URL (optional)"
              class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            />
            <small v-if="errors.profileImage" class="text-red-500 text-xs !mt-1">{{ errors.profileImage }}</small>
          </div>
        </template>
      </div>

      <!-- Step 2: Account Setup -->
      <div v-if="currentStep === 2 && !isEdit">
        <h3 class="text-lg font-semibold text-gray-800 !mb-4">Account Setup</h3>
        
        <!-- Username Field -->
        <div class="space-y-2">
          <label for="username" class="block text-sm font-semibold text-gray-700">Username *</label>
          <InputText
            id="username"
            v-model="formData.username"
            :class="{ 'p-invalid': errors.username }"
            placeholder="Enter username"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            required
          />
          <small v-if="errors.username" class="text-red-500 text-xs !mt-1">{{ errors.username }}</small>
        </div>

        <!-- Password Field -->
        <div class="space-y-2">
          <label for="password" class="block text-sm font-semibold text-gray-700">Password *</label>
          <InputText
            id="password"
            v-model="formData.password"
            :class="{ 'p-invalid': errors.password }"
            placeholder="Enter password"
            type="password"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            required
          />
          <small v-if="errors.password" class="text-red-500 text-xs !mt-1">{{ errors.password }}</small>
        </div>

        <!-- Confirm Password Field -->
        <div class="space-y-2">
          <label for="confirmPassword" class="block text-sm font-semibold text-gray-700">Confirm Password *</label>
          <InputText
            id="confirmPassword"
            v-model="confirmPassword"
            :class="{ 'p-invalid': errors.confirmPassword }"
            placeholder="Confirm password"
            type="password"
            class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            required
          />
          <small v-if="errors.confirmPassword" class="text-red-500 text-xs !mt-1">{{ errors.confirmPassword }}</small>
        </div>
      </div>

      <!-- Step 3: Profile Image -->
      <div v-if="currentStep === 3 && !isEdit">
        <h3 class="text-lg font-semibold text-gray-800 !mb-4">Profile Image</h3>
        
        <div class="text-center">
          <!-- Profile Preview -->
          <div class="!mb-6">
            <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto !mb-4">
              <img v-if="formData.profileImage" :src="formData.profileImage" alt="Profile" class="w-24 h-24 rounded-full object-cover" />
              <i v-else class="pi pi-user text-gray-500 text-3xl" />
            </div>
            <p class="text-sm text-gray-600">{{ formData.profileImage ? 'Profile image preview' : 'Default profile image' }}</p>
          </div>

          <!-- Profile Image URL Field -->
          <div class="space-y-2">
            <label for="profileImage" class="block text-sm font-semibold text-gray-700">Profile Image URL (Optional)</label>
            <InputText
              id="profileImage"
              v-model="formData.profileImage"
              :class="{ 'p-invalid': errors.profileImage }"
              placeholder="Enter profile image URL or leave blank for default"
              class="w-full !rounded-xl !border-gray-300 !p-3 text-sm"
            />
            <small v-if="errors.profileImage" class="text-red-500 text-xs !mt-1">{{ errors.profileImage }}</small>
          </div>

          <div class="!mt-4">
            <p class="text-xs text-gray-500">You can upload an image URL or skip this step to use the default profile image.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between !mt-8">
      <!-- Left side - Previous/Cancel -->
      <div>
        <Button
          v-if="currentStep > 1 && !isEdit"
          label="Previous"
          severity="secondary"
          outlined
          @click="previousStep"
        />
        <Button
          v-else
          label="Cancel"
          severity="secondary"
          outlined
          @click="handleCancel"
        />
      </div>

      <!-- Right side - Next/Finish -->
      <div>
        <Button
          v-if="currentStep < 3 && !isEdit"
          label="Next"
          @click="nextStep"
        />
        <Button
          v-else
          :label="isEdit ? 'Update User' : 'Create User'"
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
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

interface User {
  id?: string
  name: string
  username: string
  email: string
  phone: string
  role: string
  password?: string
  profileImage?: string
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

// Step management for wizard flow
const currentStep = ref(1)
const confirmPassword = ref('')

// Form data
const formData = ref<User>({
  name: '',
  username: '',
  email: '',
  phone: '',
  role: '',
  password: '',
  profileImage: ''
})

// Form validation errors
const errors = ref({
  name: '',
  username: '',
  email: '',
  phone: '',
  role: '',
  password: '',
  confirmPassword: '',
  profileImage: ''
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
  currentStep.value = 1
  confirmPassword.value = ''
  formData.value = {
    name: '',
    username: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    profileImage: ''
  }
  errors.value = {
    name: '',
    username: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: '',
    profileImage: ''
  }
}

// Step-related methods
const getStepTitle = () => {
  switch (currentStep.value) {
    case 1:
      return 'Add New User - Basic Information'
    case 2:
      return 'Add New User - Account Setup'
    case 3:
      return 'Add New User - Profile Image'
    default:
      return 'Add New User'
  }
}

const getStepDescription = () => {
  switch (currentStep.value) {
    case 1:
      return 'Enter basic personal information'
    case 2:
      return 'Set up login credentials'
    case 3:
      return 'Add profile image (optional)'
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
    // Step 1: Basic Information validation
    // Name validation
    if (!formData.value.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.value.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else {
      newErrors.name = ''
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.value.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.value.email)) {
      newErrors.email = 'Please enter a valid email address'
    } else {
      newErrors.email = ''
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/
    if (!formData.value.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!phoneRegex.test(formData.value.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    } else {
      newErrors.phone = ''
    }

    // Role validation
    if (!formData.value.role) {
      newErrors.role = 'Role is required'
    } else {
      newErrors.role = ''
    }
  }

  if (step === 2 || isEdit.value) {
    // Step 2: Account Setup validation
    // Username validation
    if (!formData.value.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.value.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.value.username)) {
      newErrors.username = 'Username can only contain letters, numbers, dots, hyphens, and underscores'
    } else {
      newErrors.username = ''
    }

    // Password validation
    if (isEdit.value && !formData.value.password) {
      // Password is optional for edit mode
      newErrors.password = ''
    } else if (!formData.value.password || !formData.value.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.value.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else {
      newErrors.password = ''
    }

    // Confirm Password validation (only for add mode)
    if (!isEdit.value) {
      if (!confirmPassword.value.trim()) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (confirmPassword.value !== formData.value.password) {
        newErrors.confirmPassword = 'Passwords do not match'
      } else {
        newErrors.confirmPassword = ''
      }
    }
  }

  if (step === 3) {
    // Step 3: Profile Image validation (optional)
    if (formData.value.profileImage && formData.value.profileImage.trim()) {
      const urlRegex = /^(https?:\/\/)?[\da-z.-]+\.[a-z.]{2,6}[/\w .-]*\/?$/
      if (!urlRegex.test(formData.value.profileImage)) {
        newErrors.profileImage = 'Please enter a valid URL'
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
    return !newErrors.name && !newErrors.email && !newErrors.phone && !newErrors.role
  } else if (step === 2) {
    return !newErrors.username && !newErrors.password && !newErrors.confirmPassword
  } else if (step === 3) {
    return !newErrors.profileImage
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
    
    const userData: User = {
      ...formData.value,
      // Convert empty string to undefined for optional fields
      profileImage: formData.value.profileImage?.trim() || undefined,
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