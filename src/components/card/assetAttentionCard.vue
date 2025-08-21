<template>
  <div class="custom-card">
    <div class="relative bg-white rounded-xl shadow p-4 overflow-hidden min-h-[160px]">
    <!-- Judul -->
    <h2 class="!text-xl !font-medium !text-gray-700 !p-2 !mb-2">Need Attention</h2>

    <!-- Watermark Icon (right bottom) -->
    <i
      class="pi pi-exclamation-triangle absolute bottom-4 right-4 text-yellow-300 opacity-20 pointer-events-none z-0"
      style="font-size: 96px;"
    ></i>

    <!-- Jika kosong -->
    <div v-if="assets.length === 0" class="relative z-10 flex justify-center !mb-10">
      <div class="w-[100%] bg-gray-50 bg-opacity-5 max-w-xl rounded-lg border border-gray-200 p-3 shadow-sm text-center">
        <p class="text-sm text-gray-400">No critical assets at the moment. Its all good! :D</p>
      </div>
    </div>

    <!-- Jika ada aset -->
    <div v-else class="relative z-10 flex flex-col gap-4 !mb-14">
      <div
        v-for="asset in assets"
        :key="asset.assetId"
        class="w-full rounded-lg border bg-yellow-50 bg-opacity-5 p-4 shadow-sm"
      >
        <div class="font-semibold text-gray-900 text-base">{{ asset.name }}</div>
        <div class="text-sm text-gray-600">📍 {{ asset.location }}</div>
        <div class="text-sm text-red-600">⚠️ {{ asset.issue }}</div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
interface Asset {
  assetId: string
  name: string
  location: string
  status: string
  issue: string
}

defineProps<{
  assets: Asset[]
}>()
</script>
