<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    header="Confirm Delete"
    :style="{ width: '400px' }"
    :closable="true"
    :draggable="false"
  >
    <div class="confirm-delete-content">
      <!-- Icon and Message -->
      <div class="flex flex-col items-center text-center mb-6">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <i class="pi pi-exclamation-triangle text-red-600 text-2xl" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h3>
        <p class="text-gray-600 text-sm">
          {{ message || `This action cannot be undone. This will permanently delete the ${itemType || 'item'}.` }}
        </p>
      </div>

      <!-- Item Details (if provided) -->
      <div v-if="itemName" class="bg-gray-50 rounded-lg p-3 mb-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <i :class="itemIcon || 'pi pi-file'" class="text-gray-500 text-sm" />
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ itemName }}</p>
            <p v-if="itemDescription" class="text-xs text-gray-500">{{ itemDescription }}</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          label="Cancel"
          severity="secondary"
          outlined
          @click="handleCancel"
          :disabled="isDeleting"
        />
        <Button
          label="Delete"
          severity="danger"
          :loading="isDeleting"
          @click="handleConfirm"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

interface Props {
  visible: boolean
  itemType?: string
  itemName?: string
  itemDescription?: string
  itemIcon?: string
  message?: string
  isDeleting?: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  itemType: 'item',
  itemName: '',
  itemDescription: '',
  itemIcon: 'pi pi-file',
  message: '',
  isDeleting: false
})

const emit = defineEmits<Emits>()

// Computed properties
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Methods
const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}
</script>

<style src="@/styles/modal.css" scoped></style>

<style scoped>
.confirm-delete-content {
  padding: 1rem 0;
}

/* Danger button styling */
:deep(.p-button.p-button-danger) {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
}

:deep(.p-button.p-button-danger:hover) {
  background: #dc2626;
  border-color: #dc2626;
}

:deep(.p-button.p-button-danger:focus) {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}
</style>