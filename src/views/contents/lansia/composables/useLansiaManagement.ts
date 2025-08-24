import { ref, computed } from 'vue'

export interface Lansia {
  id: string
  nik: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  age: number
  gender: 'Laki-laki' | 'Perempuan'
  address: string
  rt: string
  rw: string
  phone: string
  emergencyContact: string
  emergencyPhone: string
  caregiverStatus: 'Ada' | 'Tidak Ada'
  healthStatus: 1 | 2 | 3
  medicalConditions: string[]
  lastCheckup: Date
  profileImage?: string
  createdAt: Date
}

export function useLansiaManagement() {
  // Lansia data state
  const lansia = ref<Lansia[]>([
    {
      id: 'LNS-001',
      nik: '6302012345671001',
      firstName: 'Hj. Siti',
      lastName: 'Khadijah',
      dateOfBirth: new Date('1955-03-15'),
      age: 68,
      gender: 'Perempuan' as const,
      address: 'Jl. Raya Kotabaru No. 123, Kotabaru',
      rt: '001',
      rw: '003',
      phone: '081234567890',
      emergencyContact: 'Ahmad Fauzi (Anak)',
      emergencyPhone: '081234567891',
      caregiverStatus: 'Ada' as const,
      healthStatus: 1 as const,
      medicalConditions: ['Hipertensi'],
      lastCheckup: new Date('2024-07-15'),
      profileImage: undefined,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: 'LNS-002',
      nik: '6302012345671002',
      firstName: 'H. Abdul',
      lastName: 'Rahman',
      dateOfBirth: new Date('1950-08-22'),
      age: 73,
      gender: 'Laki-laki' as const,
      address: 'Jl. Veteran No. 456, Kotabaru',
      rt: '002',
      rw: '005',
      phone: '081234567892',
      emergencyContact: 'Fatimah Rahman (Istri)',
      emergencyPhone: '081234567893',
      caregiverStatus: 'Ada' as const,
      healthStatus: 2 as const,
      medicalConditions: ['Diabetes', 'Kolesterol'],
      lastCheckup: new Date('2024-08-01'),
      profileImage: undefined,
      createdAt: new Date('2024-02-05'),
    },
    {
      id: 'LNS-003',
      nik: '6302012345671003',
      firstName: 'Nenek',
      lastName: 'Aminah',
      dateOfBirth: new Date('1948-12-10'),
      age: 75,
      gender: 'Perempuan' as const,
      address: 'Kampung Baru RT 02/RW 01, Kotabaru',
      rt: '002',
      rw: '001',
      phone: '081234567894',
      emergencyContact: 'Budi Santoso (Cucu)',
      emergencyPhone: '081234567895',
      caregiverStatus: 'Tidak Ada' as const,
      healthStatus: 3 as const,
      medicalConditions: ['Osteoporosis', 'Katarak'],
      lastCheckup: new Date('2024-06-20'),
      profileImage: undefined,
      createdAt: new Date('2024-01-20'),
    },
    {
      id: 'LNS-004',
      nik: '6302012345671004',
      firstName: 'Pak',
      lastName: 'Usman',
      dateOfBirth: new Date('1952-05-08'),
      age: 71,
      gender: 'Laki-laki' as const,
      address: 'Jl. Sudirman No. 789, Kotabaru',
      rt: '003',
      rw: '004',
      phone: '081234567896',
      emergencyContact: 'Dewi Sartika (Anak)',
      emergencyPhone: '081234567897',
      caregiverStatus: 'Ada' as const,
      healthStatus: 1 as const,
      medicalConditions: [],
      lastCheckup: new Date('2024-08-10'),
      profileImage: undefined,
      createdAt: new Date('2024-03-12'),
    },
    {
      id: 'LNS-005',
      nik: '6302012345671005',
      firstName: 'Ibu',
      lastName: 'Kartini',
      dateOfBirth: new Date('1953-04-21'),
      age: 70,
      gender: 'Perempuan' as const,
      address: 'Perumahan Kotabaru Indah Blok A No. 12',
      rt: '001',
      rw: '002',
      phone: '081234567898',
      emergencyContact: 'Rini Kartini (Anak)',
      emergencyPhone: '081234567899',
      caregiverStatus: 'Ada' as const,
      healthStatus: 1 as const,
      medicalConditions: ['Hipertensi'],
      lastCheckup: new Date('2024-07-25'),
      profileImage: undefined,
      createdAt: new Date('2024-04-08'),
    },
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()))

  // Search and filter state
  const searchTerm = ref('')

  // Modal state
  const showAddModal = ref(false)
  const showEditModal = ref(false)
  const showDeleteModal = ref(false)
  const showViewModal = ref(false)
  const selectedLansia = ref<Lansia | null>(null)
  const selectedViewLansia = ref<Lansia | null>(null)
  const lansiaToDelete = ref<Lansia | null>(null)
  const isDeletingLansia = ref(false)

  // Computed properties
  const filteredLansia = computed(() => {
    if (!searchTerm.value) return lansia.value
    
    const term = searchTerm.value.toLowerCase()
    return lansia.value.filter((person) => {
      return (
        person.firstName.toLowerCase().includes(term) ||
        person.lastName.toLowerCase().includes(term) ||
        getFullName(person.firstName, person.lastName).toLowerCase().includes(term) ||
        person.nik.toLowerCase().includes(term) ||
        person.id.toLowerCase().includes(term) ||
        person.address.toLowerCase().includes(term) ||
        person.rt.toLowerCase().includes(term) ||
        person.rw.toLowerCase().includes(term) ||
        person.phone.toLowerCase().includes(term) ||
        person.healthStatus.toString().includes(term) ||
        person.emergencyContact.toLowerCase().includes(term) ||
        person.caregiverStatus.toLowerCase().includes(term)
      )
    })
  })

  // Lansia management methods
  const generateLansiaId = (): string => {
    const lansiaCount = lansia.value.length + 1
    return `LNS-${String(lansiaCount).padStart(3, '0')}`
  }

  const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const addLansia = (lansiaData: Omit<Lansia, 'id' | 'age' | 'createdAt'>) => {
    console.log('Adding new lansia:', lansiaData)
    
    const newLansia: Lansia = {
      id: generateLansiaId(),
      ...lansiaData,
      age: calculateAge(lansiaData.dateOfBirth),
      // Convert empty string to undefined for optional fields
      profileImage: lansiaData.profileImage?.trim() || undefined,
      createdAt: new Date(),
    }
    
    lansia.value.push(newLansia)
    lansia.value.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    
    console.log('Lansia added successfully!')
    console.log('Current lansia:', lansia.value)
  }

  const updateLansia = (lansiaId: string, lansiaData: Omit<Lansia, 'id' | 'age' | 'createdAt'>) => {
    console.log('Updating lansia:', lansiaId, lansiaData)
    
    const lansiaIndex = lansia.value.findIndex(person => person.id === lansiaId)
    if (lansiaIndex !== -1) {
      lansia.value[lansiaIndex] = {
        ...lansia.value[lansiaIndex],
        ...lansiaData,
        age: calculateAge(lansiaData.dateOfBirth),
        // Only update profile image if provided
        ...(lansiaData.profileImage !== undefined && { profileImage: lansiaData.profileImage?.trim() || undefined }),
      }
      console.log('Lansia updated successfully!')
    }
  }

  const deleteLansia = (lansiaId: string) => {
    console.log('Deleting lansia:', lansiaId)
    
    const lansiaIndex = lansia.value.findIndex(person => person.id === lansiaId)
    if (lansiaIndex !== -1) {
      lansia.value.splice(lansiaIndex, 1)
      console.log('Lansia deleted successfully!')
    }
  }

  const getLansiaById = (lansiaId: string): Lansia | undefined => {
    return lansia.value.find(person => person.id === lansiaId)
  }

  // Modal management methods
  const openAddModal = () => {
    selectedLansia.value = null
    showAddModal.value = true
  }

  const openEditModal = (person: Lansia) => {
    selectedLansia.value = { ...person }
    showEditModal.value = true
  }

  const openDeleteModal = (person: Lansia) => {
    lansiaToDelete.value = { ...person }
    showDeleteModal.value = true
  }

  const openViewModal = (person: Lansia) => {
    selectedViewLansia.value = { ...person }
    showViewModal.value = true
  }

  const closeModals = () => {
    showAddModal.value = false
    showEditModal.value = false
    showDeleteModal.value = false
    showViewModal.value = false
    selectedLansia.value = null
    selectedViewLansia.value = null
    lansiaToDelete.value = null
    isDeletingLansia.value = false
  }

  // Event handlers
  const handleAddLansia = (lansiaData: Omit<Lansia, 'id' | 'age' | 'createdAt'>) => {
    addLansia(lansiaData)
    closeModals()
  }

  const handleEditLansia = (lansiaData: Omit<Lansia, 'id' | 'age' | 'createdAt'>) => {
    if (selectedLansia.value?.id) {
      updateLansia(selectedLansia.value.id, lansiaData)
      closeModals()
    }
  }

  const handleConfirmDelete = async () => {
    if (!lansiaToDelete.value) return
    
    isDeletingLansia.value = true
    console.log('Deleting lansia:', lansiaToDelete.value.id)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      deleteLansia(lansiaToDelete.value.id)
      closeModals()
    } catch (error) {
      console.error('Error deleting lansia:', error)
    } finally {
      isDeletingLansia.value = false
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

  const handleEditFromView = (person: Lansia) => {
    console.log('Edit from view modal:', person)
    selectedLansia.value = { ...person }
    showViewModal.value = false
    showEditModal.value = true
  }

  const handleCloseView = () => {
    console.log('View modal closed')
    closeModals()
  }

  // Health status styling
  const getHealthStatusBadgeClasses = (status: number) => {
    switch (status) {
      case 1:
        return 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
      case 2:
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm'
      case 3:
        return 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
    }
  }

  // Health status icons
  const getHealthStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return 'pi pi-heart'
      case 2:
        return 'pi pi-exclamation-triangle'
      case 3:
        return 'pi pi-shield'
      default:
        return 'pi pi-circle'
    }
  }

  // Health status labels
  const getHealthStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return 'Level 1'
      case 2:
        return 'Level 2'
      case 3:
        return 'Level 3'
      default:
        return 'Unknown'
    }
  }

  // Name utility function
  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`.trim()
  }

  // Caregiver status styling
  const getCaregiverStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'Ada':
        return 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
      case 'Tidak Ada':
        return 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
    }
  }

  // Caregiver status icons
  const getCaregiverStatusIcon = (status: string) => {
    switch (status) {
      case 'Ada':
        return 'pi pi-check-circle'
      case 'Tidak Ada':
        return 'pi pi-times-circle'
      default:
        return 'pi pi-circle'
    }
  }

  // Statistics computed properties
  const totalLansia = computed(() => lansia.value.length)
  
  const lansiaLevel1 = computed(() => 
    lansia.value.filter(l => l.healthStatus === 1).length
  )
  
  const lansiaLevel2 = computed(() => 
    lansia.value.filter(l => l.healthStatus === 2).length
  )
  
  const lansiaLevel3 = computed(() => 
    lansia.value.filter(l => l.healthStatus === 3).length
  )

  return {
    // State
    lansia: lansia.value,
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

    // Methods
    addLansia,
    updateLansia,
    deleteLansia,
    getLansiaById,
    generateLansiaId,
    calculateAge,
    
    // Modal methods
    openAddModal,
    openEditModal,
    openDeleteModal,
    openViewModal,
    closeModals,
    
    // Event handlers
    handleAddLansia,
    handleEditLansia,
    handleConfirmDelete,
    handleCancelModal,
    handleCancelDelete,
    handleEditFromView,
    handleCloseView,
    
    // Utilities
    getHealthStatusBadgeClasses,
    getHealthStatusIcon,
    getHealthStatusLabel,
    getFullName,
    getCaregiverStatusBadgeClasses,
    getCaregiverStatusIcon,

    // Statistics
    totalLansia,
    lansiaLevel1,
    lansiaLevel2,
    lansiaLevel3,
  }
}