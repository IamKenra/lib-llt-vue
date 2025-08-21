<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <div class="welcome-animation">
        <img src="@/assets/logo.png" alt="LLT Logo" class="logo-animation" />
        <div class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
      
      <div class="welcome-text">
        <h1 class="welcome-title">Selamat Datang!</h1>
        <p class="welcome-subtitle">{{ userName }}</p>
        <p class="welcome-description">Sistem Informasi Lansia Terpadu</p>
      </div>
      
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      
      <p class="loading-text">Memuat dashboard...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWelcome } from '../../../composables/useWelcome'

const { progress, userName } = useWelcome()
</script>

<style src="@/styles/welcome.css" scoped></style>