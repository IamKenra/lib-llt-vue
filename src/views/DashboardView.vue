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
import contentLansia from './contents/lansia/contentLansia.vue'
import contentUsers from './contents/users/contentUsers.vue'
import contentWelcome from './contents/welcome/contentWelcome.vue'
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
