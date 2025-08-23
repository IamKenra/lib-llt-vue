import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  createdAt: Date
}

export function useUserManagement() {
  // User data state
  const users = ref<User[]>([
    {
      id: 'USR-001',
      name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '081234567890',
      role: 'Super Admin',
      createdAt: new Date('2024-01-15T09:00:00'),
    },
    {
      id: 'USR-002',
      name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@email.com',
      phone: '081234567891',
      role: 'Admin',
      createdAt: new Date('2024-02-10T10:30:00'),
    },
    {
      id: 'USR-003',
      name: 'Ahmad Wijaya',
      email: 'ahmad.wijaya@email.com',
      phone: '081234567892',
      role: 'Surveyor',
      createdAt: new Date('2024-03-05T14:15:00'),
    },
    {
      id: 'USR-004',
      name: 'Dewi Kartika',
      email: 'dewi.kartika@email.com',
      phone: '081234567893',
      role: 'Admin',
      createdAt: new Date('2024-04-20T16:45:00'),
    },
    {
      id: 'USR-005',
      name: 'Rudi Hermawan',
      email: 'rudi.hermawan@email.com',
      phone: '081234567894',
      role: 'Surveyor',
      createdAt: new Date('2024-08-01T08:20:00'),
    },
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()))

  // Search and filter state
  const searchTerm = ref('')

  // Modal state
  const showAddModal = ref(false)
  const showEditModal = ref(false)
  const showDeleteModal = ref(false)
  const selectedUser = ref<User | null>(null)
  const userToDelete = ref<User | null>(null)
  const isDeletingUser = ref(false)

  // Computed properties
  const filteredUsers = computed(() => {
    if (!searchTerm.value) return users.value
    
    const term = searchTerm.value.toLowerCase()
    return users.value.filter((user) => {
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term) ||
        user.phone.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      )
    })
  })

  // User management methods
  const generateUserId = (): string => {
    const userCount = users.value.length + 1
    return `USR-${String(userCount).padStart(3, '0')}`
  }

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    console.log('Adding new user:', userData)
    
    const newUser: User = {
      id: generateUserId(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      createdAt: new Date(),
    }
    
    users.value.push(newUser)
    users.value.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    
    console.log('User added successfully!')
    console.log('Current users:', users.value)
  }

  const updateUser = (userId: string, userData: Omit<User, 'id' | 'createdAt'>) => {
    console.log('Updating user:', userId, userData)
    
    const userIndex = users.value.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex] = {
        ...users.value[userIndex],
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
      }
      console.log('User updated successfully!')
    }
  }

  const deleteUser = (userId: string) => {
    console.log('Deleting user:', userId)
    
    const userIndex = users.value.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      users.value.splice(userIndex, 1)
      console.log('User deleted successfully!')
    }
  }

  const getUserById = (userId: string): User | undefined => {
    return users.value.find(user => user.id === userId)
  }

  // Modal management methods
  const openAddModal = () => {
    selectedUser.value = null
    showAddModal.value = true
  }

  const openEditModal = (user: User) => {
    selectedUser.value = { ...user }
    showEditModal.value = true
  }

  const openDeleteModal = (user: User) => {
    userToDelete.value = { ...user }
    showDeleteModal.value = true
  }

  const closeModals = () => {
    showAddModal.value = false
    showEditModal.value = false
    showDeleteModal.value = false
    selectedUser.value = null
    userToDelete.value = null
    isDeletingUser.value = false
  }

  // Event handlers
  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    addUser(userData)
    closeModals()
  }

  const handleEditUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (selectedUser.value?.id) {
      updateUser(selectedUser.value.id, userData)
      closeModals()
    }
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete.value) return
    
    isDeletingUser.value = true
    console.log('Deleting user:', userToDelete.value.id)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      deleteUser(userToDelete.value.id)
      closeModals()
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      isDeletingUser.value = false
    }
  }

  const handleCancelModal = () => {
    console.log('Modal cancelled')
    closeModals()
  }

  const handleCancelDelete = () => {
    console.log('Delete cancelled')
    closeModals()
  }

  // Role severity for UI
  const getRoleSeverity = (role: string) => {
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

  return {
    // State
    users: users.value,
    filteredUsers,
    searchTerm,
    showAddModal,
    showEditModal,
    showDeleteModal,
    selectedUser,
    userToDelete,
    isDeletingUser,

    // Methods
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    generateUserId,
    
    // Modal methods
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,
    
    // Event handlers
    handleAddUser,
    handleEditUser,
    handleConfirmDelete,
    handleCancelModal,
    handleCancelDelete,
    
    // Utilities
    getRoleSeverity,
  }
}