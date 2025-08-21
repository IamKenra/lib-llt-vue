<template>
  <div class="bg-white rounded-2xl border shadow-sm !p-4">
    <!-- Top bar -->
    <div class="flex justify-between items-center !p-4 !mb-10">
      <h2 class="!text-2xl text-gray-900">Users Management</h2>
      <div class="flex space-x-2">

      </div>
    </div>

    <div class="!mb-4 flex justify-between items-center">
      <!-- Search Bar -->
      <div class="relative max-w-sm w-full">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <InputText
          v-model="search"
          placeholder="Search..."
          class="w-full !pl-10 !pr-4 !py-2 text-sm border !border-gray-300 !rounded-full !focus:outline-none !focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- New Button -->
      <div class="ml-4">
        <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full px-5 py-2 flex items-center gap-2 shadow">
          <i class="pi pi-plus text-base" />
          <span>New</span>
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <DataTable
      :value="filteredUsers"
      tableStyle="min-width: 50rem"
      dataKey="id"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
    >
      <Column selectionMode="multiple" headerStyle="width: 3em" />
      <Column field="id" header="ID" sortable />
      <Column header="Avatar">
        <template #body>
          <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <i class="pi pi-user text-gray-500" />
          </div>
        </template>
      </Column>

      <Column field="name" header="Name" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="phone" header="Phone" />

      <Column header="Role">
        <template #body="slotProps">
          <Tag :value="slotProps.data.role" :severity="roleSeverity(slotProps.data.role)" />
        </template>
      </Column>

      <Column header="Actions">
        <template #body>
          <div class="flex !space-x-2">
            <Button icon="pi pi-eye" rounded outlined class="p-button-info" title="View" />
            <Button icon="pi pi-pencil" rounded outlined class="p-button-primary" title="Edit" />
            <Button icon="pi pi-trash" rounded outlined class="p-button-danger" title="Delete" />
          </div>
        </template>
      </Column>

      <template #footer> In total there are {{ filteredUsers.length }} users. </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'

interface Category {
  id: string
  name: string
}

const props = defineProps<{ category: Category | null }>()
const search = ref('')
const selectedCategoryName = ref(props.category?.name || '')

watch(
  () => props.category,
  (newCategory) => {
    selectedCategoryName.value = newCategory?.name || ''
  }
)

const users = [
  {
    id: 'USR-001',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '081234567890',
    role: 'Super Admin',
  },
  {
    id: 'USR-002',
    name: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@email.com',
    phone: '081234567891',
    role: 'Admin',
  },
  {
    id: 'USR-003',
    name: 'Ahmad Wijaya',
    email: 'ahmad.wijaya@email.com',
    phone: '081234567892',
    role: 'Surveyor',
  },
  {
    id: 'USR-004',
    name: 'Dewi Kartika',
    email: 'dewi.kartika@email.com',
    phone: '081234567893',
    role: 'Admin',
  },
  {
    id: 'USR-005',
    name: 'Rudi Hermawan',
    email: 'rudi.hermawan@email.com',
    phone: '081234567894',
    role: 'Surveyor',
  },
]

const filteredUsers = computed(() => {
  return users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.value.toLowerCase()) ||
      user.email.toLowerCase().includes(search.value.toLowerCase()) ||
      user.id.toLowerCase().includes(search.value.toLowerCase())
    return matchesSearch
  })
})

function roleSeverity(role: string) {
  switch (role) {
    case 'Super Admin':
      return 'danger'
    case 'Admin':
      return 'warning'
    case 'Surveyor':
      return 'info'
    default:
      return 'secondary'
  }
}

</script>

<style scoped>
.p-datatable .p-datatable-thead > tr > th {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>
