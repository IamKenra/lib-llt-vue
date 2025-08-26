<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    header="Edit Foto Profil"
    :style="{ width: '500px' }"
    :closable="true"
    :draggable="false"
  >
    <div class="space-y-6">
      
      <!-- Current Profile Picture Display -->
      <div class="bg-white rounded-2xl border border-gray-200 !p-5 !mb-6">
        <h3 class="text-lg font-semibold text-gray-800 !mb-4">
          <i class="pi pi-image text-blue-600 !mr-2"></i>
          Foto Profil Saat Ini
        </h3>
        
        <div class="flex justify-center mb-4">
          <div class="relative">
            <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200 overflow-hidden">
              <img 
                v-if="currentImage" 
                :src="currentImage" 
                alt="Current Profile" 
                class="w-full h-full object-cover rounded-full" 
              />
              <i v-else class="pi pi-user text-gray-400 text-4xl" />
            </div>
            <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <i class="pi pi-camera text-white text-sm"></i>
            </div>
          </div>
        </div>
        
        <p class="text-center text-sm text-gray-600">
          {{ props.lansia?.firstName }} {{ props.lansia?.lastName }}
        </p>
      </div>

      <!-- File Upload Section -->
      <div class="bg-white rounded-2xl border border-gray-200 !p-5">
        <h3 class="text-lg font-semibold text-gray-800 !mb-4">
          <i class="pi pi-upload text-green-600 !mr-2"></i>
          Upload Foto Baru
        </h3>

        <!-- File Upload Area -->
        <div 
          class="upload-area"
          :class="{ 'drag-over': isDragOver, 'has-error': uploadError }"
          @dragenter.prevent="handleDragEnter"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <input 
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />

          <div v-if="!previewImage" class="upload-content">
            <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-4"></i>
            <p class="text-lg font-medium text-gray-700 mb-2">Pilih atau seret foto ke sini</p>
            <p class="text-sm text-gray-500 mb-4">Format yang didukung: JPG, PNG, GIF (Maksimal 5MB)</p>
            <Button
              label="Pilih Foto"
              icon="pi pi-folder-open"
              outlined
              class="p-button-primary"
            />
          </div>

          <!-- Preview Section -->
          <div v-else class="preview-content">
            <div class="preview-image-wrapper">
              <img :src="previewImage" alt="Preview" class="preview-image" />
              <div class="preview-overlay">
                <Button
                  icon="pi pi-times"
                  rounded
                  severity="danger"
                  class="remove-preview-btn"
                  title="Hapus foto"
                  @click.stop="removePreview"
                />
              </div>
            </div>
            <div class="preview-info">
              <p class="text-sm font-medium text-gray-700">{{ selectedFileName }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(selectedFileSize) }}</p>
            </div>
          </div>
        </div>

        <!-- Upload Error -->
        <div v-if="uploadError" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
            <p class="text-sm text-red-600 font-medium">{{ uploadError }}</p>
          </div>
        </div>

        <!-- Upload Options -->
        <div v-if="previewImage" class="bg-gray-50 rounded-xl border border-gray-200 !p-4 mt-4">
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Opsi Crop</h4>
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <input 
                  id="crop-square" 
                  v-model="cropType" 
                  type="radio" 
                  value="square" 
                  class="mr-2"
                />
                <label for="crop-square" class="text-sm text-gray-600">Persegi (1:1)</label>
              </div>
              <div class="flex items-center">
                <input 
                  id="crop-original" 
                  v-model="cropType" 
                  type="radio" 
                  value="original" 
                  class="mr-2"
                />
                <label for="crop-original" class="text-sm text-gray-600">Asli</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="isUploading" class="upload-progress mt-4">
          <div class="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <i class="pi pi-spin pi-spinner text-blue-600"></i>
            <div class="flex-1">
              <p class="text-sm font-medium text-blue-700">Mengupload foto...</p>
              <div class="w-full bg-blue-200 rounded-full h-2 mt-1">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
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
          :disabled="isUploading"
          @click="handleCancel"
        />
        <Button
          label="Simpan Foto"
          icon="pi pi-check"
          :loading="isUploading"
          :disabled="!previewImage"
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
import type { Lansia } from '../composables/useLansiaManagement'

interface Props {
  visible: boolean
  lansia?: Lansia | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'save', data: { profileImage: string }): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Refs
const fileInput = ref<HTMLInputElement>()
const previewImage = ref<string>('')
const currentImage = ref<string>('')
const selectedFileName = ref<string>('')
const selectedFileSize = ref<number>(0)
const uploadError = ref<string>('')
const isUploading = ref(false)
const uploadProgress = ref(0)
const isDragOver = ref(false)
const cropType = ref<'square' | 'original'>('square')

// Computed properties
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Watch for lansia data changes
watch(() => props.lansia, (newLansia) => {
  if (newLansia) {
    currentImage.value = newLansia.profileImage || ''
  }
}, { immediate: true })

// Watch for visible changes to reset form
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    resetForm()
  }
})

// Reset form
const resetForm = () => {
  previewImage.value = ''
  selectedFileName.value = ''
  selectedFileSize.value = 0
  uploadError.value = ''
  isUploading.value = false
  uploadProgress.value = 0
  isDragOver.value = false
  cropType.value = 'square'
  currentImage.value = props.lansia?.profileImage || ''
}

// File validation
const validateFile = (file: File): string | null => {
  // File size check (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return 'Ukuran file terlalu besar. Maksimal 5MB.'
  }

  // File type check
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return 'Format file tidak didukung. Gunakan JPG, PNG, atau GIF.'
  }

  return null
}

// Create preview from file
const createPreview = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string
    selectedFileName.value = file.name
    selectedFileSize.value = file.size
  }
  reader.readAsDataURL(file)
}

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const validationError = validateFile(file)
    if (validationError) {
      uploadError.value = validationError
      return
    }
    
    uploadError.value = ''
    createPreview(file)
  }
}

// Trigger file input
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Drag and drop handlers
const handleDragEnter = () => {
  isDragOver.value = true
}

const handleDragOver = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  
  if (files && files.length > 0) {
    const file = files[0]
    const validationError = validateFile(file)
    
    if (validationError) {
      uploadError.value = validationError
      return
    }
    
    uploadError.value = ''
    createPreview(file)
  }
}

// Remove preview
const removePreview = () => {
  previewImage.value = ''
  selectedFileName.value = ''
  selectedFileSize.value = 0
  uploadError.value = ''
  
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Simulate file upload process
const simulateUpload = (): Promise<string> => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      uploadProgress.value += 10
      if (uploadProgress.value >= 100) {
        clearInterval(interval)
        // In real implementation, this would be the URL from the server
        resolve(previewImage.value)
      }
    }, 200)
  })
}

// Handle form submission
const handleSubmit = async () => {
  if (!previewImage.value) {
    return
  }

  isUploading.value = true
  uploadProgress.value = 0

  try {
    // Simulate upload process
    const uploadedImageUrl = await simulateUpload()
    
    // In real implementation, you would upload to server here
    // const uploadedImageUrl = await uploadToServer(previewImage.value, cropType.value)
    
    emit('save', { profileImage: uploadedImageUrl })
    visible.value = false
  } catch (error) {
    console.error('Error uploading image:', error)
    uploadError.value = 'Gagal mengupload foto. Silakan coba lagi.'
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

// Handle cancel
const handleCancel = () => {
  visible.value = false
  emit('close')
}
</script>

<style scoped>

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 200ms;
}

.upload-area:hover {
  border-color: #60a5fa;
  background-color: #eff6ff;
}

.upload-area.drag-over {
  border-color: #3b82f6;
  background-color: #dbeafe;
}

.upload-area.has-error {
  border-color: #fca5a5;
  background-color: #fef2f2;
}

.upload-content > * + * {
  margin-top: 1rem;
}

.preview-content > * + * {
  margin-top: 1rem;
}

.preview-image-wrapper {
  position: relative;
  display: inline-block;
}

.preview-image {
  width: 8rem;
  height: 8rem;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
}

.preview-overlay {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
}

.remove-preview-btn {
  width: 2rem;
  height: 2rem;
}

.preview-info {
  text-align: center;
}

.upload-progress > * + * {
  margin-top: 0.5rem;
}

/* Hide default file input */
.hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Radio button styling */
input[type="radio"] {
  width: 1rem;
  height: 1rem;
  color: #2563eb;
  border-color: #d1d5db;
}

input[type="radio"]:focus {
  --tw-ring-color: #3b82f6;
}
</style>