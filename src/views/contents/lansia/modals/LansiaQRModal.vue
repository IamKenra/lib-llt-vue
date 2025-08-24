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
      <!-- Lansia Info Header -->
      <div class="text-center mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-2">{{ getFullName(lansia.firstName, lansia.lastName) }}</h3>
        <p class="text-sm text-gray-600 mb-1">NIK: {{ lansia.nik }}</p>
        <div :class="getHealthStatusBadgeClasses(lansia.healthStatus)" class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold">
          <i :class="getHealthStatusIcon(lansia.healthStatus)" class="text-sm"></i>
          <span>{{ getHealthStatusLabel(lansia.healthStatus) }}</span>
        </div>
      </div>

      <!-- QR Code Display -->
      <div class="flex justify-center mb-6">
        <div class="qr-container bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
          <canvas ref="qrCanvas" class="qr-canvas"></canvas>
        </div>
      </div>

      <!-- QR Info -->
      <div class="text-center mb-6">
        <p class="text-sm text-gray-600 mb-2">Scan QR Code untuk melihat informasi lengkap</p>
        <p class="text-xs text-gray-500">Data ID: {{ lansia.id }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center gap-3">
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
import { useLansiaManagement, type Lansia } from '../composables/useLansiaManagement'

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

// Use health status functions from composable
const { getHealthStatusBadgeClasses, getHealthStatusIcon, getHealthStatusLabel, getFullName } = useLansiaManagement()

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
  const lansiaName = getFullName(props.lansia.firstName, props.lansia.lastName)
  const printDate = new Date().toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const htmlContent = 
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<title>QR Code - ' + lansiaName + '<' + '/title>' +
    '<style>' +
    'body { font-family: "Segoe UI", sans-serif; margin: 0; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f9fafb; }' +
    '.print-container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center; max-width: 500px; width: 100%; }' +
    '.header { margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }' +
    '.title { color: #1f2937; font-size: 24px; font-weight: bold; margin: 0 0 10px 0; }' +
    '.subtitle { color: #6b7280; font-size: 16px; margin: 0 0 10px 0; }' +
    '.nik { color: #374151; font-size: 14px; font-family: monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; display: inline-block; }' +
    '.qr-section { margin: 30px 0; }' +
    '.qr-code { border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; display: inline-block; background: white; }' +
    '.info { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }' +
    '.info-text { color: #6b7280; font-size: 14px; margin: 5px 0; }' +
    '.footer { margin-top: 30px; font-size: 12px; color: #9ca3af; }' +
    '@media print { body { background: white; } .print-container { box-shadow: none; border: 1px solid #e5e7eb; } }' +
    '<' + '/style>' +
    '<' + '/head>' +
    '<body>' +
    '<div class="print-container">' +
    '<div class="header">' +
    '<h1 class="title">' + lansiaName + '<' + '/h1>' +
    '<p class="subtitle">Data Lansia Kotabaru<' + '/p>' +
    '<div class="nik">NIK: ' + props.lansia.nik + '<' + '/div>' +
    '<' + '/div>' +
    '<div class="qr-section">' +
    '<div class="qr-code">' +
    '<img src="' + dataURL + '" alt="QR Code" />' +
    '<' + '/div>' +
    '<' + '/div>' +
    '<div class="info">' +
    '<p class="info-text">Scan QR Code untuk melihat informasi lengkap<' + '/p>' +
    '<p class="info-text">Data ID: ' + props.lansia.id + '<' + '/p>' +
    '<p class="info-text">Umur: ' + props.lansia.age + ' tahun<' + '/p>' +
    '<p class="info-text">Status: ' + getHealthStatusLabel(props.lansia.healthStatus) + '<' + '/p>' +
    '<' + '/div>' +
    '<div class="footer">' +
    '<p>Dicetak pada: ' + printDate + '<' + '/p>' +
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