<template>
  <AnimatedCard :delay="100" card-class="bg-white rounded-2xl border shadow-sm !p-4">
    <!-- Top bar -->
    <div class="flex justify-between items-center !p-4 !mb-6">
      <h2 class="!text-2xl text-gray-900">Users Management</h2>
      <div class="flex space-x-2">

      </div>
    </div>

    <div class="!mb-4 flex justify-between items-center">
      <!-- Search Bar -->
      <div class="relative max-w-sm w-full">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <InputText
          v-model="searchTerm"
          placeholder="Search..."
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

      <Column field="name" header="Name" />
      <Column field="email" header="Email" />
      <Column field="phone" header="Phone" />

      <Column header="Role">
        <template #body="slotProps">
          <div :class="getRoleBadgeClasses(slotProps.data.role)" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold">
            <i :class="getRoleIcon(slotProps.data.role)" class="text-sm"></i>
            <span>{{ slotProps.data.role }}</span>
          </div>
        </template>
      </Column>

      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex !space-x-2">
            <Button icon="pi pi-eye" rounded outlined class="p-button-info" title="View" @click="openViewModal(slotProps.data)" />
            <Button icon="pi pi-pencil" rounded outlined class="p-button-primary" title="Edit" @click="openEditModal(slotProps.data)" />
            <Button icon="pi pi-trash" rounded outlined class="p-button-danger" title="Delete" @click="openDeleteModal(slotProps.data)" />
          </div>
        </template>
      </Column>

      <template #footer> In total there are {{ filteredUsers.length }} users. </template>
    </DataTable>

    <!-- Add User Modal -->
    <AddUserModal
      v-model:visible="showAddModal"
      @submit="handleAddUser"
      @cancel="handleCancelModal"
    />

    <!-- Edit User Modal -->
    <AddUserModal
      v-model:visible="showEditModal"
      :user="selectedUser"
      @submit="handleEditUser"
      @cancel="handleCancelModal"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model:visible="showDeleteModal"
      item-type="user"
      :item-name="userToDelete?.name"
      :item-description="userToDelete?.email"
      item-icon="pi pi-user"
      :is-deleting="isDeletingUser"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />

    <!-- User Detail Modal -->
    <UserDetailModal
      v-model:visible="showViewModal"
      :user="selectedViewUser"
      @edit="handleEditFromView"
      @close="handleCloseView"
    />
  </AnimatedCard>
</template>

<script setup lang="ts">
import { defineProps, watch, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import AnimatedCard from '../../../components/AnimatedCard.vue'
import AddUserModal from './modals/AddUserModal.vue'
import ConfirmDeleteModal from '../../../components/modals/ConfirmDeleteModal.vue'
import UserDetailModal from './modals/UserDetailModal.vue'
import { useUserManagement } from './composables/useUserManagement'

interface Category {
  id: string
  name: string
}

// Make sure User interface is compatible
interface User {
  id: string
  name: string
  username: string
  email: string
  phone: string
  role: string
  password?: string
  profileImage?: string
  createdAt: Date
}

const props = defineProps<{ category: Category | null }>()
const selectedCategoryName = ref(props.category?.name || '')

// Use user management composable
const {
  filteredUsers,
  searchTerm,
  showAddModal,
  showEditModal,
  showDeleteModal,
  showViewModal,
  selectedUser,
  selectedViewUser,
  userToDelete,
  isDeletingUser,
  openAddModal,
  openEditModal,
  openDeleteModal,
  openViewModal,
  handleAddUser,
  handleEditUser,
  handleConfirmDelete,
  handleCancelModal,
  handleCancelDelete,
  handleEditFromView,
  handleCloseView,
  getRoleBadgeClasses,
  getRoleIcon,
} = useUserManagement()

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
