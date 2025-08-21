<template>
  <body>
    <div class="top-navbar">
      <topnav />
    </div>

    <div class="main-container">
      <div class="side-navbar">
        <sidenav/>
      </div>

      <div class="content">
        <div v-if="route.query.content" class="breadcrumb-wrapper">
          <breadbrumb/>
        </div>

        <component :is="currentContent" />
      </div>
    </div>
  </body>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import 'primeicons/primeicons.css'
import breadbrumb from '../components/breadcrumb.vue'
import contentDashboardAdmin from './contents/dashboard/contentDashboard.vue'
// import contentLansia from './contents/lansia/contentLansia.vue'
import contentUsers from './contents/users/contentUsers.vue'
import contentWelcome from './contents/welcome/contentWelcome.vue'

// Temporary fallback component for lansia
const contentLansia = {
  template: `
    <div class="bg-white rounded-2xl border shadow-sm p-4">
      <div class="flex justify-between items-center p-4 mb-10">
        <h2 class="text-2xl text-gray-900">Data Lansia</h2>
      </div>
      <div class="text-center py-8">
        <i class="pi pi-users text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">Fitur Data Lansia</p>
        <p class="text-gray-400">Akan dikembangkan dengan map visualization</p>
      </div>
    </div>
  `
}
import sidenav from '../components/sideNav.vue'
import topnav from '../components/topNav.vue'
const route = useRoute()

type MenuKey = 'dashboard' | 'lansia' | 'users'

const contentMap: Record<MenuKey, any> = {
  dashboard: contentDashboardAdmin,
  lansia: contentLansia,
  users: contentUsers,
}

const currentContent = computed(() => {
  const key = route.query.content as string

  if (key === 'dashboard' || key === 'lansia' || key === 'users') {
    return contentMap[key]
  } else {
    // Show welcome screen when no content query parameter (first login)
    return contentWelcome
  }
})

</script>

<style src="@/styles/dashboard.css" lang="css" scoped></style>
