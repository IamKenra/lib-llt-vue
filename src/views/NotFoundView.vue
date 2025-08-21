<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
    <div class="max-w-2xl mx-auto text-center">
      <!-- Logo -->
      <div class="flex justify-center !mb-8">
        <img src="@/assets/logo.png" alt="Logo" class="h-20 w-auto" />
      </div>
      
      <!-- 404 Number -->
      <div class="!mb-8">
        <h1 class="text-9xl font-bold text-gray-800 !mb-4">404</h1>
        <div class="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>
      
      <!-- Error Message -->
      <div class="!mb-8">
        <h2 class="text-3xl font-bold text-gray-800 !mb-4">Halaman Tidak Ditemukan</h2>
        <p class="text-gray-600 text-lg !mb-2">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <p class="text-gray-500">
          Mungkin halaman telah dipindahkan, dihapus, atau URL yang dimasukkan salah.
        </p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          @click="goHome"
          label="Kembali ke Beranda"
          icon="pi pi-home"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300"
        />
        
        <Button 
          @click="goBack"
          label="Halaman Sebelumnya" 
          icon="pi pi-arrow-left"
          severity="secondary"
          class="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gray-300"
        />
      </div>
      
      <!-- Help Text -->
      <div class="!mt-12 text-center">
        <p class="text-gray-500 text-sm">
          Butuh bantuan? 
          <a href="#" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
            Hubungi Support
          </a>
        </p>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div class="absolute top-3/4 right-1/4 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 left-3/4 w-16 h-16 bg-blue-300 rounded-full opacity-20 animate-pulse" style="animation-delay: 2s;"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>