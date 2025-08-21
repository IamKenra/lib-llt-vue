<template>
  <div class="bg-white rounded-2xl border shadow-sm !p-4">
    <!-- Top bar -->
    <div class="flex justify-between items-center !mb-8 !p-4">
      <h2 class="!text-2xl text-gray-900">{{ props.category?.name || 'All Assets' }}</h2>
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
      :value="filteredAssets"
      tableStyle="min-width: 50rem"
      dataKey="id"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
    >
      <Column selectionMode="multiple" headerStyle="width: 3em" />
      <Column field="key" header="Key" sortable />
      <Column field="name" header="Name" sortable />

      <Column header="Image">
        <template #body>
          <div class="w-10 h-10 bg-gray-200 rounded" />
        </template>
      </Column>

      <Column field="location" header="Location" sortable>
      </Column>

      <Column field="category" header="Category"/>

      <Column header="Status">
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" :severity="statusSeverity(slotProps.data.status)" />
        </template>
      </Column>

      <Column header="Actions">
        <template #body>
          <div class="flex !space-x-2">
            <Button icon="pi pi-pencil" rounded outlined class="p-button-primary" />
            <Button icon="pi pi-trash" rounded outlined class="p-button-danger" />
          </div>
        </template>
      </Column>

      <template #footer> In total there are {{ filteredAssets.length }} assets. </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

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

const assets = [
  {
    id: 'BSI-1',
    key: 'BSI-1',
    name: 'Server Dell',
    location: 'GKU Building',
    category: 'Servers',
    status: 'INSTOCK',
  },
  {
    id: 'LTP-2',
    key: 'LTP-2',
    name: 'Laptop Asus',
    location: 'GKU Building',
    category: 'Laptops',
    status: 'LOWSTOCK',
  },
]

const filteredAssets = computed(() => {
  const categoryName = props.category?.name?.toLowerCase() || ''
  return assets.filter((asset) => {
    const matchesCategory = !categoryName || asset.category.toLowerCase() === categoryName
    const matchesSearch =
      asset.name.toLowerCase().includes(search.value.toLowerCase()) ||
      asset.key.toLowerCase().includes(search.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

function statusSeverity(status: string) {
  switch (status) {
    case 'INSTOCK':
      return 'success'
    case 'LOWSTOCK':
      return 'warning'
    case 'OUTOFSTOCK':
      return 'danger'
    default:
      return 'info'
  }
}

</script>

<style scoped>
.p-datatable .p-datatable-thead > tr > th {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>
