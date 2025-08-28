<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    header="QR Code Data Lansia"
    :style="{ width: '450px' }"
    :closable="true"
    :draggable="false"
  >
    <div v-if="lansia" class="lansia-qr-modal">
      <!-- LLT Logo Header -->
      <div class="text-center !mb-8">
        <div class="flex justify-center">
          <img src="/src/assets/logo.png" alt="LLT Logo" class="h-16 w-auto" />
        </div>
      </div>

      <!-- QR Code Display -->
      <div class="flex justify-center !mb-8">
        <div class="qr-container bg-white !p-6 rounded-xl border-2 border-gray-200 shadow-sm">
          <canvas ref="qrCanvas" class="qr-canvas"></canvas>
        </div>
      </div>

      <!-- QR Info -->
      <div class="text-center !mb-8">
        <p class="text-sm text-gray-600">Scan QR Code untuk melihat informasi lengkap</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center !gap-4">
        <Button
          label="Print QR"
          icon="pi pi-print"
          severity="primary"
          @click="printQR"
        />
        <Button
          label="Tutup"
          severity="secondary"
          outlined
          @click="visible = false"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import QRCode from 'qrcode'
import type { Lansia } from '../composables/useLansiaManagement'

interface Props {
  visible: boolean
  lansia?: Lansia | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// No health status functions needed anymore since we removed personal info

// Refs
const qrCanvas = ref<HTMLCanvasElement>()

// Computed properties
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Generate QR Code data
const generateQRData = (lansia: Lansia): string => {
  const qrData = {
    id: lansia.id,
    nik: lansia.nik,
    name: `${lansia.firstName} ${lansia.lastName}`,
    age: lansia.age,
    gender: lansia.gender,
    healthStatus: lansia.healthStatus,
    address: lansia.address,
    rt: lansia.rt,
    rw: lansia.rw,
    phone: lansia.phone,
    emergencyContact: lansia.emergencyContact,
    emergencyPhone: lansia.emergencyPhone,
    caregiverStatus: lansia.caregiverStatus,
    lastCheckup: lansia.lastCheckup.toISOString().split('T')[0],
    medicalConditions: lansia.medicalConditions,
    generatedAt: new Date().toISOString()
  }
  return JSON.stringify(qrData)
}

// Generate QR code on canvas
const generateQR = async () => {
  if (!props.lansia || !qrCanvas.value) return

  try {
    const qrData = generateQRData(props.lansia)
    await QRCode.toCanvas(qrCanvas.value, qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#1f2937',  // Dark gray
        light: '#ffffff'  // White background
      }
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

// Watch for modal visibility and lansia changes
watch([visible, () => props.lansia], async ([isVisible]) => {
  if (isVisible && props.lansia) {
    await nextTick()
    generateQR()
  }
}, { immediate: true })

// Print QR code
const printQR = () => {
  if (!props.lansia || !qrCanvas.value) return

  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=600,height=800')
  if (!printWindow) return

  const canvas = qrCanvas.value
  const dataURL = canvas.toDataURL('image/png')
  
  const htmlContent = 
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<title>QR Code Sticker<' + '/title>' +
    '<style>' +
    'body { font-family: "Segoe UI", sans-serif; margin: 0; padding: 10px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f9fafb; }' +
    '.print-container { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); text-align: center; max-width: 200px; width: 100%; }' +
    '.header { margin-bottom: 10px; }' +
    '.logo { height: 32px; width: auto; }' +
    '.qr-section { margin: 10px 0; }' +
    '.qr-code { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; display: inline-block; background: white; }' +
    '.qr-code img { width: 120px; height: 120px; }' +
    '.info { margin-top: 10px; }' +
    '.info-text { color: #6b7280; font-size: 10px; margin: 2px 0; line-height: 1.2; }' +
    '@media print { body { background: white; margin: 0; padding: 0; } .print-container { box-shadow: none; border: none; margin: 0; padding: 10px; max-width: none; } }' +
    '<' + '/style>' +
    '<' + '/head>' +
    '<body>' +
    '<div class="print-container">' +
    '<div class="header">' +
    '<img src="/src/assets/logo.png" alt="LLT Logo" class="logo" />' +
    '<' + '/div>' +
    '<div class="qr-section">' +
    '<div class="qr-code">' +
    '<img src="' + dataURL + '" alt="QR Code" />' +
    '<' + '/div>' +
    '<' + '/div>' +
    '<div class="info">' +
    '<p class="info-text">Scan untuk info lengkap<' + '/p>' +
    '<' + '/div>' +
    '<' + '/div>' +
    '<' + 'script>' +
    'window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };' +
    '<' + '/script>' +
    '<' + '/body>' +
    '<' + '/html>'
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
}
</script>

<style scoped>
.lansia-qr-modal {
  padding: 0;
}

.qr-container {
  display: inline-block;
}

.qr-canvas {
  display: block;
}
</style>