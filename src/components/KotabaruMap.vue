<template>
  <div class="map-graph-container w-full h-full relative">
    <!-- Interactive Leaflet Map -->
    <div 
      ref="mapContainer"
      class="w-full h-full rounded-xl overflow-hidden"
      style="min-height: 400px;"
    >
      <!-- Map will be initialized here -->
    </div>

    <!-- Dynamic Legend -->
    <div class="absolute bottom-4 left-4 bg-white/98 backdrop-blur-md rounded-2xl p-5 shadow-2xl border-2 border-white/50 z-[1000]">
      <h4 class="font-bold text-base text-gray-800 mb-4 text-center">
        {{ mapView === 'health' ? 'Status Kesehatan' : 'Status Ekonomi' }}
      </h4>
      
      <!-- Health Legend -->
      <div v-if="mapView === 'health'" class="space-y-3">
        <div class="flex items-center justify-between text-sm font-medium">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-green-500 rounded-lg mr-3 shadow-md border border-green-300"></div>
            <span class="text-gray-700">Level 1</span>
          </div>
          <span class="text-green-600 font-semibold">Produktif</span>
        </div>
        <div class="flex items-center justify-between text-sm font-medium">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-yellow-500 rounded-lg mr-3 shadow-md border border-yellow-300"></div>
            <span class="text-gray-700">Level 2</span>
          </div>
          <span class="text-yellow-600 font-semibold">Butuh Bantuan</span>
        </div>
        <div class="flex items-center justify-between text-sm font-medium">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-red-500 rounded-lg mr-3 shadow-md border border-red-300"></div>
            <span class="text-gray-700">Level 3</span>
          </div>
          <span class="text-red-600 font-semibold">Tirah Baring</span>
        </div>
      </div>

      <!-- Economic Legend -->
      <div v-else class="space-y-3">
        <div class="flex items-center justify-between text-sm font-medium">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-red-500 rounded-lg mr-3 shadow-md border border-red-300"></div>
            <span class="text-gray-700">Kurang</span>
          </div>
          <span class="text-red-600 font-semibold">Kurang Mampu</span>
        </div>
        <div class="flex items-center justify-between text-sm font-medium">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-yellow-500 rounded-lg mr-3 shadow-md border border-yellow-300"></div>
            <span class="text-gray-700">Cukup</span>
          </div>
          <span class="text-yellow-600 font-semibold">Cukup Mampu</span>
        </div>
        <div class="flex items-center justify-between text-sm font-medium">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-green-500 rounded-lg mr-3 shadow-md border border-green-300"></div>
            <span class="text-gray-700">Sangat</span>
          </div>
          <span class="text-green-600 font-semibold">Sangat Mampu</span>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-gray-200">
        <div class="text-center text-xs text-gray-500">
          <i class="pi pi-search-plus mr-1"></i>
          Zoom & geser untuk navigasi
        </div>
      </div>
    </div>

    <!-- Total stats overlay -->
    <div class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 z-[1000]">
      <div class="text-center">
        <div class="text-2xl font-bold text-indigo-600">{{ totalLansia }}</div>
        <div class="text-sm text-gray-600">Total Lansia</div>
      </div>
    </div>

    <!-- Loading indicator -->
    <div 
      v-if="loading" 
      class="absolute inset-0 bg-white/80 flex items-center justify-center z-[2000] rounded-xl"
    >
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Memuat peta...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Props
interface Props {
  mapView?: 'health' | 'economic'
}

const props = withDefaults(defineProps<Props>(), {
  mapView: 'health'
})

// Fix Leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})

const mapContainer = ref<HTMLElement>()
const map = ref<L.Map>()
const loading = ref(true)
const markersLayer = ref<L.LayerGroup>()
const circlesLayer = ref<L.LayerGroup>()

// Enhanced RW data with health and economic information
const rwData = [
  {
    id: 'RW001',
    name: 'RW 001',
    population: 245,
    lansiaCount: 32,
    lat: -7.7956,
    lng: 110.3695,
    bounds: [[-7.7980, 110.3670], [-7.7932, 110.3720]],
    health: { level1: 20, level2: 8, level3: 4 },
    economic: { kurangMampu: 12, cukupMampu: 15, sangatMampu: 5 }
  },
  {
    id: 'RW002', 
    name: 'RW 002',
    population: 198,
    lansiaCount: 28,
    lat: -7.7925,
    lng: 110.3715,
    bounds: [[-7.7949, 110.3690], [-7.7901, 110.3740]],
    health: { level1: 22, level2: 3, level3: 3 },
    economic: { kurangMampu: 8, cukupMampu: 12, sangatMampu: 8 }
  },
  {
    id: 'RW003',
    name: 'RW 003', 
    population: 167,
    lansiaCount: 19,
    lat: -7.7940,
    lng: 110.3745,
    bounds: [[-7.7964, 110.3720], [-7.7916, 110.3770]],
    health: { level1: 15, level2: 2, level3: 2 },
    economic: { kurangMampu: 5, cukupMampu: 9, sangatMampu: 5 }
  },
  {
    id: 'RW004',
    name: 'RW 004',
    population: 203,
    lansiaCount: 33,
    lat: -7.7985,
    lng: 110.3720,
    bounds: [[-7.8009, 110.3695], [-7.7961, 110.3745]],
    health: { level1: 18, level2: 10, level3: 5 },
    economic: { kurangMampu: 15, cukupMampu: 12, sangatMampu: 6 }
  },
  {
    id: 'RW005',
    name: 'RW 005',
    population: 189,
    lansiaCount: 22,
    lat: -7.7960,
    lng: 110.3775,
    bounds: [[-7.7984, 110.3750], [-7.7936, 110.3800]],
    health: { level1: 16, level2: 4, level3: 2 },
    economic: { kurangMampu: 7, cukupMampu: 10, sangatMampu: 5 }
  }
]

const totalLansia = computed(() => rwData.reduce((sum, rw) => sum + rw.lansiaCount, 0))

// Health data functions
const getHealthDominant = (health: { level1: number, level2: number, level3: number }) => {
  const { level1, level2, level3 } = health
  if (level3 >= level1 && level3 >= level2) return { level: 'level3', color: '#ef4444', label: 'Level 3 (Tirah Baring)' }
  if (level2 >= level1 && level2 >= level3) return { level: 'level2', color: '#f59e0b', label: 'Level 2 (Butuh Bantuan)' }
  return { level: 'level1', color: '#10b981', label: 'Level 1 (Produktif)' }
}

// Economic data functions
const getEconomicDominant = (economic: { kurangMampu: number, cukupMampu: number, sangatMampu: number }) => {
  const { kurangMampu, cukupMampu, sangatMampu } = economic
  if (kurangMampu >= cukupMampu && kurangMampu >= sangatMampu) return { level: 'kurang', color: '#ef4444', label: 'Kurang Mampu' }
  if (sangatMampu >= cukupMampu && sangatMampu >= kurangMampu) return { level: 'sangat', color: '#10b981', label: 'Sangat Mampu' }
  return { level: 'cukup', color: '#f59e0b', label: 'Cukup Mampu' }
}

// Get RW color and data based on current view
const getRWData = (rw: any) => {
  if (props.mapView === 'health') {
    return getHealthDominant(rw.health)
  } else {
    return getEconomicDominant(rw.economic)
  }
}

// Get marker size based on total lansia count
const getMarkerSize = (lansiaCount: number): [number, number] => {
  if (lansiaCount >= 30) return [50, 50]
  if (lansiaCount >= 20) return [45, 45]
  return [40, 40]
}

const initializeMap = () => {
  if (!mapContainer.value) return

  try {
    loading.value = true

    // Initialize map centered on Kotabaru, Yogyakarta
    map.value = L.map(mapContainer.value, {
      center: [-7.7956, 110.3720],
      zoom: 15,
      minZoom: 13,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
      touchZoom: true,
      boxZoom: true
    })

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map.value)

    // Custom icons for different density levels
    const createCustomIcon = (color: string, size: [number, number] = [40, 40]) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color}; 
            width: ${size[0]}px; 
            height: ${size[1]}px; 
            border-radius: 50%; 
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">
            <i class="pi pi-users" style="font-size: 16px;"></i>
          </div>
        `,
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1] / 2]
      })
    }

    // Add markers for each RW
    rwData.forEach(rw => {
      const color = getRWColor(rw.lansiaCount, rw.population)
      const density = getLansiaDensity(rw.lansiaCount, rw.population)
      const size: [number, number] = density > 15 ? [50, 50] : density > 10 ? [45, 45] : [40, 40]
      
      const marker = L.marker([rw.lat, rw.lng], {
        icon: createCustomIcon(color, size)
      }).addTo(map.value!)

      // Create popup content
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">${rw.name}</h3>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Populasi:</span>
              <span class="font-medium">${rw.population}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Lansia:</span>
              <span class="font-medium">${rw.lansiaCount}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Kepadatan:</span>
              <span class="font-medium">${density.toFixed(1)}%</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t">
              <span class="text-gray-600">Status:</span>
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${color}"></div>
                <span class="text-sm font-medium" style="color: ${color}">${getDensityLabel(rw.lansiaCount, rw.population)}</span>
              </div>
            </div>
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        maxWidth: 300,
        closeButton: true,
        autoClose: false
      })

      // Add circle overlay for area representation
      const circleColor = color + '40' // Add transparency
      L.circle([rw.lat, rw.lng], {
        color: color,
        fillColor: circleColor,
        fillOpacity: 0.3,
        radius: density > 15 ? 200 : density > 10 ? 150 : 100,
        weight: 2
      }).addTo(map.value!)
    })

    loading.value = false
  } catch (error) {
    console.error('Error initializing map:', error)
    loading.value = false
  }
}

onMounted(() => {
  setTimeout(() => {
    initializeMap()
  }, 100) // Small delay to ensure DOM is ready
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
.map-graph-container {
  position: relative;
}

/* Custom popup styling */
:global(.custom-popup .leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

:global(.custom-popup .leaflet-popup-tip) {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Leaflet zoom controls styling */
:global(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

:global(.leaflet-control-zoom a) {
  border-radius: 8px !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  color: #374151 !important;
  font-weight: bold !important;
}

:global(.leaflet-control-zoom a:hover) {
  background-color: #f3f4f6 !important;
  color: #1f2937 !important;
}
</style>