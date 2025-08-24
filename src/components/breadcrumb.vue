<template>
    <Breadcrumb :model="breadcrumbItems" :home="homeItem" />
</template>

<script setup lang="ts">
import Breadcrumb from 'primevue/breadcrumb'
import { useRoute } from 'vue-router'
import { ref,computed } from 'vue'

const labelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  assets: 'Assets',
  users: 'Users',
  lansia: 'Lansia',
}
const route = useRoute()

const homeItem = ref({
  icon: 'pi pi-home',
  to: { query: { content: 'dashboard' } }
})

const breadcrumbItems = computed(() => {
  const key = route.query.content as string

  if (!key || !(key in labelMap)) return []

  return [
    {
      label: labelMap[key],
      to: { query: { content: key } }
    }
  ]
})
</script>
