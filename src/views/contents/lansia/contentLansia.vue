<template>
  <!-- Status Cards Outside -->
  <LansiaStatusCards
    :total-lansia="totalLansia"
    :lansia-level1="lansiaLevel1"
    :lansia-level2="lansiaLevel2"
    :lansia-level3="lansiaLevel3"
  />

  <AnimatedCard :delay="500" card-class="bg-white rounded-2xl border shadow-sm !p-4 !mt-4">
    <!-- Top bar -->
    <div class="flex justify-between items-center !p-4 !mb-6">
      <h2 class="!text-2xl text-gray-900">Data Lansia Kotabaru</h2>
      <div class="flex space-x-2">

      </div>
    </div>

    <div class="!mb-4 flex justify-between items-center">
      <!-- Search Bar and Filters -->
      <div class="flex items-center gap-4">
        <!-- Search Bar -->
        <div class="relative w-96">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <InputText
            v-model="searchTerm"
            placeholder="Cari lansia..."
            class="w-full !pl-10 !pr-4 !py-2 text-sm border !border-gray-300 !rounded-full !focus:outline-none !focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Combined Filter Button -->
        <div class="relative">
          <Button
            ref="filterButton"
            type="button"
            icon="pi pi-filter"
            :label="getCombinedFilterLabel()"
            class="p-button-outlined p-button-sm !rounded-full"
            @click="toggleFilterPanel"
            :class="{ '!bg-blue-50 !border-blue-300 !text-blue-700': hasAnyFilters() }"
          />
          <OverlayPanel 
            ref="filterPanel" 
            class="custom-filter-panel"
            :dismissable="true"
            :auto-z-index="true"
          >
            <div class="p-5 w-[480px]">
              <!-- 2-Column Grid Layout -->
              <div class="grid grid-cols-2 gap-6">
                <!-- Left Column -->
                <div>
                  <!-- Health Status Section -->
                  <div class="mb-5">
                    <div class="flex items-center mb-3">
                      <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <h6 class="font-medium text-gray-800 text-sm">Status Kesehatan</h6>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center p-2 rounded hover:bg-gray-50 transition-colors">
                        <Checkbox
                          v-model="healthFilters.level1"
                          inputId="health1"
                          binary
                        />
                        <label for="health1" class="ml-2 text-xs text-gray-700 cursor-pointer">Level 1 (Produktif)</label>
                      </div>
                      <div class="flex items-center p-2 rounded hover:bg-gray-50 transition-colors">
                        <Checkbox
                          v-model="healthFilters.level2"
                          inputId="health2"
                          binary
                        />
                        <label for="health2" class="ml-2 text-xs text-gray-700 cursor-pointer">Level 2 (Butuh Bantuan)</label>
                      </div>
                      <div class="flex items-center p-2 rounded hover:bg-gray-50 transition-colors">
                        <Checkbox
                          v-model="healthFilters.level3"
                          inputId="health3"
                          binary
                        />
                        <label for="health3" class="ml-2 text-xs text-gray-700 cursor-pointer">Level 3 (Tirah Baring)</label>
                      </div>
                    </div>
                  </div>

                  <!-- Living Status Section -->
                  <div class="mb-5">
                    <div class="flex items-center mb-3">
                      <div class="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <h6 class="font-medium text-gray-800 text-sm">Status Kehidupan</h6>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center p-2 rounded hover:bg-gray-50 transition-colors">
                        <Checkbox
                          v-model="livingFilters.hidup"
                          inputId="living1"
                          binary
                        />
                        <label for="living1" class="ml-2 text-xs text-gray-700 cursor-pointer">Hidup</label>
                      </div>
                      <div class="flex items-center p-2 rounded hover:bg-gray-50 transition-colors">
                        <Checkbox
                          v-model="livingFilters.meninggal"
                          inputId="living2"
                          binary
                        />
                        <label for="living2" class="ml-2 text-xs text-gray-700 cursor-pointer">Meninggal</label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div>
                  <!-- Economic Status Section -->
                  <div class="mb-5">
                    <div class="flex items-center mb-3">
                      <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <h6 class="font-medium text-gray-800 text-sm">Status Ekonomi</h6>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center p-2 rounded hover:bg-gray-50 transition-colors">
                        <Checkbox
                          v-model="economicFilters.kurangMampu"
                          inputId="econ1"
                          binary
                        />
                        <label for="econ1" class="ml-2 text-xs text-gray-700 cursor-pointer">Kurang Mampu</label>
                      </div>
                      <div class="flex items-center p-2 rounded hover:bg-gray-50 transition-colors">
                        <Checkbox
                          v-model="economicFilters.cukupMampu"
                          inputId="econ2"
                          binary
                        />
                        <label for="econ2" class="ml-2 text-xs text-gray-700 cursor-pointer">Cukup Mampu</label>
                      </div>
                      <div class="flex items-center p-2 rounded hover:bg-gray-50 transition-colors">
                        <Checkbox
                          v-model="economicFilters.sangatMampu"
                          inputId="econ3"
                          binary
                        />
                        <label for="econ3" class="ml-2 text-xs text-gray-700 cursor-pointer">Sangat Mampu</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end pt-3 border-t border-gray-100">
                <Button
                  label="Clear All"
                  size="small"
                  text
                  @click="clearAllFilters"
                  class="!text-gray-600 hover:!text-gray-800 !text-xs !px-3 !py-1.5"
                />
              </div>
            </div>
          </OverlayPanel>
        </div>
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
          <div class="flex items-center gap-2">
            <svg 
              v-if="slotProps.data.livingStatus === 'Meninggal'" 
              width="16" 
              height="16" 
              viewBox="0 0 48 48" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              class="text-gray-400 flex-shrink-0 opacity-70"
            >
              <path 
                d="M20 4H28C34.62 4 38 9.38 38 16V37.32C33.76 35.26 30.14 34 24 34C17.86 34 14.24 35.26 10 37.32V16C10 9.38 13.38 4 20 4ZM16 16V19H32V16H16ZM18 24V27H30V24H18ZM6 44V42.62C11.32 39.24 26.46 31.68 42 42.5V44H6Z" 
                fill="currentColor"
              />
            </svg>
            <span 
              :class="{
                'text-gray-500': slotProps.data.livingStatus === 'Meninggal',
                'text-gray-900': slotProps.data.livingStatus === 'Hidup'
              }"
            >
              {{ getFullName(slotProps.data.firstName, slotProps.data.lastName) }}
            </span>
          </div>
        </template>
      </Column>
      <Column field="age" header="Umur" style="width: 80px">
        <template #body="slotProps">
          <span 
            class="text-sm font-medium"
            :class="{
              'text-gray-500': slotProps.data.livingStatus === 'Meninggal',
              'text-gray-900': slotProps.data.livingStatus === 'Hidup'
            }"
          >
            {{ slotProps.data.age }} tahun
          </span>
        </template>
      </Column>
      <Column field="gender" header="Jenis Kelamin" style="width: 120px">
        <template #body="slotProps">
          <span 
            :class="{
              'text-gray-500': slotProps.data.livingStatus === 'Meninggal',
              'text-gray-900': slotProps.data.livingStatus === 'Hidup'
            }"
          >
            {{ slotProps.data.gender }}
          </span>
        </template>
      </Column>
      <Column field="address" header="Alamat">
        <template #body="slotProps">
          <span 
            :class="{
              'text-gray-500': slotProps.data.livingStatus === 'Meninggal',
              'text-gray-900': slotProps.data.livingStatus === 'Hidup'
            }"
          >
            {{ slotProps.data.address }}
          </span>
        </template>
      </Column>
      <Column field="rt" header="RT" style="width: 80px">
        <template #body="slotProps">
          <span 
            :class="{
              'text-gray-500': slotProps.data.livingStatus === 'Meninggal',
              'text-gray-900': slotProps.data.livingStatus === 'Hidup'
            }"
          >
            {{ slotProps.data.rt }}
          </span>
        </template>
      </Column>
      <Column field="rw" header="RW" style="width: 80px">
        <template #body="slotProps">
          <span 
            :class="{
              'text-gray-500': slotProps.data.livingStatus === 'Meninggal',
              'text-gray-900': slotProps.data.livingStatus === 'Hidup'
            }"
          >
            {{ slotProps.data.rw }}
          </span>
        </template>
      </Column>
      
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
      @editPersonalInfo="handleEditPersonalInfo"
      @editContactInfo="handleEditContactInfo"
      @editHealthHistory="handleEditHealthHistory"
      @editProfilePicture="handleEditProfilePicture"
      @close="handleCloseView"
    />

    <!-- Edit Personal Info Modal -->
    <EditPersonalInfoModal
      v-model:visible="showEditPersonalInfoModal"
      :lansia="selectedEditLansia"
      @save="handleSavePersonalInfo"
      @close="handleCloseEditModals"
    />

    <!-- Edit Contact Info Modal -->
    <EditContactInfoModal
      v-model:visible="showEditContactInfoModal"
      :lansia="selectedEditLansia"
      @save="handleSaveContactInfo"
      @close="handleCloseEditModals"
    />

    <!-- Edit Health History Modal -->
    <EditHealthHistoryModal
      v-model:visible="showEditHealthHistoryModal"
      :lansia="selectedEditLansia"
      @save="handleSaveHealthHistory"
      @close="handleCloseEditModals"
    />

    <!-- Profile Picture Upload Modal -->
    <ProfilePictureUploadModal
      v-model:visible="showProfilePictureModal"
      :lansia="selectedEditLansia"
      @save="handleSaveProfilePicture"
      @close="handleCloseEditModals"
    />
  </AnimatedCard>
</template>

<script setup lang="ts">
import { defineProps, watch, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import OverlayPanel from 'primevue/overlaypanel'
import Checkbox from 'primevue/checkbox'
import AddLansiaModal from './modals/AddLansiaModal.vue'
import ConfirmDeleteModal from '../../../components/modals/ConfirmDeleteModal.vue'
import LansiaDetailModal from './modals/LansiaDetailModal.vue'
import EditPersonalInfoModal from './modals/EditPersonalInfoModal.vue'
import EditContactInfoModal from './modals/EditContactInfoModal.vue'
import EditHealthHistoryModal from './modals/EditHealthHistoryModal.vue'
import ProfilePictureUploadModal from './modals/ProfilePictureUploadModal.vue'
import LansiaStatusCards from './components/LansiaStatusCards.vue'
import AnimatedCard from '../../../components/AnimatedCard.vue'
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
  healthFilters,
  economicFilters,
  livingFilters,
  showAddModal,
  showEditModal,
  showDeleteModal,
  showViewModal,
  selectedLansia,
  selectedViewLansia,
  lansiaToDelete,
  isDeletingLansia,
  
  // Individual edit modal states
  showEditPersonalInfoModal,
  showEditContactInfoModal,
  showEditHealthHistoryModal,
  showProfilePictureModal,
  selectedEditLansia,
  
  // Modal methods
  openAddModal,
  openEditModal,
  openDeleteModal,
  openViewModal,
  
  // Event handlers
  handleAddLansia,
  handleEditLansia,
  handleConfirmDelete,
  handleCancelModal,
  handleCancelDelete,
  handleEditFromView,
  handleCloseView,
  
  // Individual edit modal handlers
  handleEditPersonalInfo,
  handleEditContactInfo,
  handleEditHealthHistory,
  handleEditProfilePicture,
  handleCloseEditModals,
  
  // Save handlers
  handleSavePersonalInfo,
  handleSaveContactInfo,
  handleSaveHealthHistory,
  handleSaveProfilePicture,
  
  // Utilities
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

// Combined filter panel refs
const filterPanel = ref()
const filterButton = ref()

// Panel toggle method
const toggleFilterPanel = (event: Event) => {
  if (filterPanel.value) {
    filterPanel.value.toggle(event)
  }
}

// Combined filter label method
const getCombinedFilterLabel = () => {
  const totalActiveFilters = 
    (healthFilters.value.level1 ? 1 : 0) + 
    (healthFilters.value.level2 ? 1 : 0) + 
    (healthFilters.value.level3 ? 1 : 0) +
    (economicFilters.value.kurangMampu ? 1 : 0) + 
    (economicFilters.value.cukupMampu ? 1 : 0) + 
    (economicFilters.value.sangatMampu ? 1 : 0) +
    (livingFilters.value.hidup ? 1 : 0) + 
    (livingFilters.value.meninggal ? 1 : 0)
  
  if (totalActiveFilters === 0) return 'Filter'
  return `Filter (${totalActiveFilters})`
}

// Check if any filters are active
const hasAnyFilters = () => {
  return hasHealthFilters() || hasEconomicFilters() || hasLivingFilters()
}

// Check if filters are active (keeping original methods for logic)
const hasHealthFilters = () => {
  return healthFilters.value.level1 || healthFilters.value.level2 || healthFilters.value.level3
}

const hasEconomicFilters = () => {
  return economicFilters.value.kurangMampu || economicFilters.value.cukupMampu || economicFilters.value.sangatMampu
}

const hasLivingFilters = () => {
  return livingFilters.value.hidup || livingFilters.value.meninggal
}

// Clear all filters
const clearAllFilters = () => {
  // Clear health filters
  healthFilters.value.level1 = false
  healthFilters.value.level2 = false
  healthFilters.value.level3 = false
  
  // Clear economic filters
  economicFilters.value.kurangMampu = false
  economicFilters.value.cukupMampu = false
  economicFilters.value.sangatMampu = false
  
  // Clear living filters
  livingFilters.value.hidup = false
  livingFilters.value.meninggal = false
}



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

.custom-filter-panel {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: white;
  z-index: 1050 !important;
  width: 480px;
}

.custom-filter-panel .p-overlaypanel {
  transform-origin: top left !important;
  position: absolute !important;
  top: auto !important;
  left: auto !important;
}

.custom-filter-panel .p-overlaypanel-content {
  padding: 0;
  border-radius: 12px;
  background: white;
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
}



/* Custom checkbox styling */
.custom-filter-panel .p-checkbox {
  border-radius: 6px !important;
}

.custom-filter-panel .p-checkbox.p-checkbox-checked {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
  border-color: #3b82f6 !important;
}

/* Hover effects for checkbox containers */
.custom-filter-panel .p-checkbox:not(.p-checkbox-checked):hover {
  border-color: #93c5fd !important;
  background-color: #eff6ff !important;
}
</style>