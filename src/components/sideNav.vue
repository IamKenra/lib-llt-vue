<template>
  <div class="side-navbar-inner">
    <div class="nav-menu">
      <div class="pi pi-home nav-item" :class="{ active: activeMenu === 'dashboard' }" @click="navigateTo('dashboard')"></div>
      <div class="pi pi-user nav-item" :class="{ active: activeMenu === 'users' }" @click="navigateTo('users')"></div>
      <div class="pi pi-users nav-item" :class="{ active: activeMenu === 'lansia' }" @click="navigateTo('lansia')"></div>
    </div>
    <div class="pi pi-sign-out nav-item logout" @click="logout"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { logout } = useAuth()
const router = useRouter()
const route = useRoute()

const activeMenu = computed(() => {
  return route.query.content || null // Don't highlight any menu during welcome
})

function navigateTo(content: 'dashboard' | 'lansia'| 'users') {
  router.push({ query: { content } })
}
</script>

<style src="@/styles/sidenav.css" lang="css" scoped></style>
