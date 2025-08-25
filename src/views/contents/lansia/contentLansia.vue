<template>
  <!-- Status Cards Outside -->
  <LansiaStatusCards
    :total-lansia="totalLansia"
    :lansia-level1="lansiaLevel1"
    :lansia-level2="lansiaLevel2"
    :lansia-level3="lansiaLevel3"
  />

  <div class="bg-white rounded-2xl border shadow-sm !p-4">
    <!-- Top bar -->
    <div class="flex justify-between items-center !p-4 !mb-10">
      <h2 class="!text-2xl text-gray-900">Data Lansia Kotabaru</h2>
      <div class="flex space-x-2">

      </div>
    </div>

    <div class="!mb-4 flex justify-between items-center">
      <!-- Search Bar -->
      <div class="relative max-w-sm w-full">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <InputText
          v-model="searchTerm"
          placeholder="Cari lansia..."
          class="w-full !pl-10 !pr-4 !py-2 text-sm border !border-gray-300 !rounded-full !focus:outline-none !focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- New Button -->
      <div class="ml-4">
        <button 
          @click="openAddModal"
          class="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full px-5 py-2 flex items-center gap-2 shadow"
        >
          <i class="pi pi-plus text-base" />
          <span>Tambah Lansia</span>
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <DataTable
      :value="filteredLansia"
      tableStyle="min-width: 50rem"
      dataKey="id"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
    >
      <Column header="No" style="width: 80px">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column header="" style="width: 60px">
        <template #body>
          <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <i class="pi pi-user text-gray-500" />
          </div>
        </template>
      </Column>

      <Column header="Nama">
        <template #body="slotProps">
          {{ getFullName(slotProps.data.firstName, slotProps.data.lastName) }}
        </template>
      </Column>
      <Column field="age" header="Umur" style="width: 80px">
        <template #body="slotProps">
          <span class="text-sm font-medium">{{ slotProps.data.age }} tahun</span>
        </template>
      </Column>
      <Column field="gender" header="Jenis Kelamin" style="width: 120px" />
      <Column field="address" header="Alamat" />
      <Column field="rt" header="RT" style="width: 80px" />
      <Column field="rw" header="RW" style="width: 80px" />
      
      <Column header="Caregiver" style="width: 120px">
        <template #body="slotProps">
          <div :class="getCaregiverStatusBadgeClasses(slotProps.data.caregiverStatus)" class="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold">
            <i :class="getCaregiverStatusIcon(slotProps.data.caregiverStatus)" class="text-sm"></i>
            <span>{{ slotProps.data.caregiverStatus }}</span>
          </div>
        </template>
      </Column>

      <Column header="Status">
        <template #body="slotProps">
          <div :class="getHealthStatusBadgeClasses(slotProps.data.healthStatus)" class="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap">
            <span>{{ getHealthStatusLabel(slotProps.data.healthStatus) }}</span>
          </div>
        </template>
      </Column>

      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex !space-x-2">
            <Button icon="pi pi-eye" rounded outlined class="p-button-info" title="Lihat Detail" @click="openViewModal(slotProps.data)" />
            <Button icon="pi pi-pencil" rounded outlined class="p-button-primary" title="Edit" @click="openEditModal(slotProps.data)" />
            <Button icon="pi pi-trash" rounded outlined class="p-button-danger" title="Hapus" @click="openDeleteModal(slotProps.data)" />
          </div>
        </template>
      </Column>

      <template #footer> Total {{ filteredLansia.length }} data lansia. </template>
    </DataTable>

    <!-- Add Lansia Modal -->
    <AddLansiaModal
      v-model:visible="showAddModal"
      @submit="handleAddLansia"
      @cancel="handleCancelModal"
    />

    <!-- Edit Lansia Modal -->
    <AddLansiaModal
      v-model:visible="showEditModal"
      :lansia="selectedLansia"
      @submit="handleEditLansia"
      @cancel="handleCancelModal"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model:visible="showDeleteModal"
      item-type="data lansia"
      :item-name="lansiaToDelete ? getFullName(lansiaToDelete.firstName, lansiaToDelete.lastName) : ''"
      :item-description="lansiaToDelete?.nik"
      item-icon="pi pi-users"
      :is-deleting="isDeletingLansia"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />

    <!-- Lansia Detail Modal -->
    <LansiaDetailModal
      v-model:visible="showViewModal"
      :lansia="selectedViewLansia"
      @edit="handleEditFromView"
      @close="handleCloseView"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, watch, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import AddLansiaModal from './modals/AddLansiaModal.vue'
import ConfirmDeleteModal from '../../../components/modals/ConfirmDeleteModal.vue'
import LansiaDetailModal from './modals/LansiaDetailModal.vue'
import LansiaStatusCards from './components/LansiaStatusCards.vue'
import { useLansiaManagement } from './composables/useLansiaManagement'

interface Category {
  id: string
  name: string
}

const props = defineProps<{ category: Category | null }>()
const selectedCategoryName = ref(props.category?.name || '')

// Use lansia management composable
const {
  filteredLansia,
  searchTerm,
  showAddModal,
  showEditModal,
  showDeleteModal,
  showViewModal,
  selectedLansia,
  selectedViewLansia,
  lansiaToDelete,
  isDeletingLansia,
  openAddModal,
  openEditModal,
  openDeleteModal,
  openViewModal,
  handleAddLansia,
  handleEditLansia,
  handleConfirmDelete,
  handleCancelModal,
  handleCancelDelete,
  handleEditFromView,
  handleCloseView,
  getHealthStatusBadgeClasses,
  getHealthStatusIcon,
  getHealthStatusLabel,
  getFullName,
  getCaregiverStatusBadgeClasses,
  getCaregiverStatusIcon,
  totalLansia,
  lansiaLevel1,
  lansiaLevel2,
  lansiaLevel3,
} = useLansiaManagement()

watch(
  () => props.category,
  (newCategory) => {
    selectedCategoryName.value = newCategory?.name || ''
  }
)

</script>

<style scoped>
.p-datatable .p-datatable-thead > tr > th {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>