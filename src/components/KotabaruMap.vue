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

// GeoJSON data will be loaded dynamically
const kotabaruGeoJSON = ref(null)

// Load GeoJSON data
const loadGeoJSONData = async () => {
  try {
    const response = await fetch('/src/assets/rw-kotabaru (1).geojson')
    const data = await response.json()
    kotabaruGeoJSON.value = data
    return data
  } catch (error) {
    console.error('Error loading GeoJSON:', error)
    // Fallback data based on the GeoJSON file structure
    return {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            "rw": "RW 1",
            "lansia": 20,
            "kelurahan": "Kotabaru"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [110.374929, -7.783092],
                [110.371013, -7.783114],
                [110.370938, -7.784007],
                [110.370251, -7.784719],
                [110.369221, -7.785517],
                [110.369575, -7.785857],
                [110.369554, -7.78607],
                [110.369704, -7.786878],
                [110.371968, -7.785942],
                [110.371442, -7.78457],
                [110.372901, -7.784156],
                [110.374703, -7.784262],
                [110.374929, -7.783092]
              ]
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "rw": "RW 4",
            "lansia": 10,
            "kelurahan": "Kotabaru"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [110.369221, -7.785517],
                [110.368073, -7.786931],
                [110.368212, -7.78776],
                [110.368481, -7.788504],
                [110.368867, -7.789398],
                [110.36906, -7.789865],
                [110.371517, -7.788207],
                [110.372311, -7.787877],
                [110.372386, -7.786909],
                [110.373598, -7.786761],
                [110.374253, -7.786697],
                [110.374349, -7.785867],
                [110.371968, -7.785942],
                [110.369704, -7.786878],
                [110.369575, -7.785857],
                [110.369221, -7.785517]
              ]
            ]
          }
        }
      ]
    }
  }
}

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
const geoJSONLayer = ref<L.GeoJSON>()

// Enhanced RW data with health and economic information that matches GeoJSON
const rwData = [
  {
    id: 'RW001',
    name: 'RW 1',
    population: 245,
    lansiaCount: 20, // From GeoJSON
    lat: -7.7845,
    lng: 110.3725,
    health: { level1: 12, level2: 5, level3: 3 },
    economic: { kurangMampu: 8, cukupMampu: 7, sangatMampu: 5 }
  },
  {
    id: 'RW004',
    name: 'RW 4', 
    population: 198,
    lansiaCount: 10, // From GeoJSON
    lat: -7.7875,
    lng: 110.3715,
    health: { level1: 6, level2: 2, level3: 2 },
    economic: { kurangMampu: 4, cukupMampu: 4, sangatMampu: 2 }
  }
]

// GeoJSON styling functions
const getGeoJSONStyle = (feature: any) => {
  const lansiaCount = feature.properties.lansia
  const rw = feature.properties.rw
  
  // Find matching RW data for detailed health/economic info
  const rwInfo = rwData.find(r => r.name === rw)
  
  if (!rwInfo) {
    return {
      fillColor: '#gray',
      weight: 2,
      opacity: 1,
      color: '#666',
      fillOpacity: 0.7
    }
  }

  let fillColor = '#10b981' // Default green
  
  if (props.mapView === 'health') {
    const healthData = getHealthDominant(rwInfo.health)
    fillColor = healthData.color
  } else {
    const economicData = getEconomicDominant(rwInfo.economic)
    fillColor = economicData.color
  }

  return {
    fillColor: fillColor,
    weight: 3,
    opacity: 1,
    color: '#fff',
    fillOpacity: 0.6,
    dashArray: '',
  }
}

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


// GeoJSON interaction functions
const onEachFeature = (feature: any, layer: L.Layer) => {
  const rw = feature.properties.rw
  const rwInfo = rwData.find(r => r.name === rw)
  
  if (rwInfo) {
    let statusInfo = ''
    let statusColor = '#10b981'
    
    if (props.mapView === 'health') {
      const healthData = getHealthDominant(rwInfo.health)
      statusColor = healthData.color
      statusInfo = `
        <div class="mt-2 pt-2 border-t border-gray-200">
          <h5 class="font-semibold text-gray-700 mb-2">Status Kesehatan:</h5>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="text-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
              <div class="text-gray-600">Level 1</div>
              <div class="font-semibold">${rwInfo.health.level1}</div>
            </div>
            <div class="text-center">
              <div class="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
              <div class="text-gray-600">Level 2</div>
              <div class="font-semibold">${rwInfo.health.level2}</div>
            </div>
            <div class="text-center">
              <div class="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
              <div class="text-gray-600">Level 3</div>
              <div class="font-semibold">${rwInfo.health.level3}</div>
            </div>
          </div>
        </div>
      `
    } else {
      const economicData = getEconomicDominant(rwInfo.economic)
      statusColor = economicData.color
      statusInfo = `
        <div class="mt-2 pt-2 border-t border-gray-200">
          <h5 class="font-semibold text-gray-700 mb-2">Status Ekonomi:</h5>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="text-center">
              <div class="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
              <div class="text-gray-600">Kurang</div>
              <div class="font-semibold">${rwInfo.economic.kurangMampu}</div>
            </div>
            <div class="text-center">
              <div class="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
              <div class="text-gray-600">Cukup</div>
              <div class="font-semibold">${rwInfo.economic.cukupMampu}</div>
            </div>
            <div class="text-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
              <div class="text-gray-600">Sangat</div>
              <div class="font-semibold">${rwInfo.economic.sangatMampu}</div>
            </div>
          </div>
        </div>
      `
    }
    
    const popupContent = `
      <div class="p-4 min-w-[280px]">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-4 h-4 rounded-full" style="background-color: ${statusColor}"></div>
          <h3 class="text-lg font-bold text-gray-800">${rw}</h3>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Kelurahan:</span>
            <span class="font-medium">${feature.properties.kelurahan}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Total Populasi:</span>
            <span class="font-medium">${rwInfo.population}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Jumlah Lansia:</span>
            <span class="font-bold text-indigo-600">${feature.properties.lansia}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Persentase Lansia:</span>
            <span class="font-medium">${((feature.properties.lansia/rwInfo.population)*100).toFixed(1)}%</span>
          </div>
          ${statusInfo}
        </div>
      </div>
    `
    
    layer.bindPopup(popupContent, {
      className: 'custom-popup',
      maxWidth: 320,
      closeButton: true,
      autoClose: false
    })
  }

  // Add hover effects
  layer.on('mouseover', function() {
    if (layer instanceof L.Path) {
      layer.setStyle({
        weight: 5,
        fillOpacity: 0.8
      })
    }
  })

  layer.on('mouseout', function() {
    if (layer instanceof L.Path) {
      layer.setStyle({
        weight: 3,
        fillOpacity: 0.6
      })
    }
  })
}

// Function to update GeoJSON layer styling when map view changes
const updateGeoJSONStyling = () => {
  if (geoJSONLayer.value) {
    geoJSONLayer.value.eachLayer((layer: any) => {
      const feature = layer.feature
      const newStyle = getGeoJSONStyle(feature)
      layer.setStyle(newStyle)
    })
  }
}

const initializeMap = async () => {
  if (!mapContainer.value) return

  try {
    loading.value = true

    // Load GeoJSON data first
    const geoJSONData = await loadGeoJSONData()

    // Initialize map centered on Kotabaru, Yogyakarta with adjusted center for GeoJSON data
    map.value = L.map(mapContainer.value, {
      center: [-7.7860, 110.3710],
      zoom: 16,
      minZoom: 14,
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

    // Add GeoJSON layer with choropleth styling
    geoJSONLayer.value = L.geoJSON(geoJSONData, {
      style: getGeoJSONStyle,
      onEachFeature: onEachFeature
    }).addTo(map.value)

    // Add center markers for statistical visualization on GeoJSON polygons
    rwData.forEach(rw => {
      const rwColor = props.mapView === 'health' 
        ? getHealthDominant(rw.health).color
        : getEconomicDominant(rw.economic).color

      // Create mini chart markers for enhanced visualization
      const createChartIcon = (rwData: any) => {
        // Create consistent chart design for both views
        const chartHTML = `
          <div style="
            background: white;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            border: 3px solid ${rwColor};
            position: relative;
          ">
            <div style="
              font-size: 14px;
              font-weight: bold;
              color: ${rwColor};
              text-align: center;
              line-height: 1;
            ">
              ${rwData.lansiaCount}
              <div style="font-size: 8px; color: #666;">Lansia</div>
            </div>
          </div>
        `
        
        return L.divIcon({
          className: 'chart-marker',
          html: chartHTML,
          iconSize: [60, 60],
          iconAnchor: [30, 30]
        })
      }

      // Add the chart marker
      L.marker([rw.lat, rw.lng], {
        icon: createChartIcon(rw),
        zIndexOffset: 1000
      }).addTo(map.value!)
    })

    loading.value = false
  } catch (error) {
    console.error('Error initializing map:', error)
    loading.value = false
  }
}

// Watch for map view changes to update styling
watch(() => props.mapView, () => {
  updateGeoJSONStyling()
  // Re-create markers with updated styling
  if (map.value) {
    // Remove existing markers
    map.value.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.value!.removeLayer(layer)
      }
    })
    
    // Re-add markers with new styling
    rwData.forEach(rw => {
      const rwColor = props.mapView === 'health' 
        ? getHealthDominant(rw.health).color
        : getEconomicDominant(rw.economic).color

      const createChartIcon = (rwData: any) => {
        return L.divIcon({
          className: 'chart-marker',
          html: `
            <div style="
              background: white;
              border-radius: 50%;
              width: 60px;
              height: 60px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              border: 3px solid ${rwColor};
              position: relative;
            ">
              <div style="
                font-size: 14px;
                font-weight: bold;
                color: ${rwColor};
                text-align: center;
                line-height: 1;
              ">
                ${rwData.lansiaCount}
                <div style="font-size: 8px; color: #666;">Lansia</div>
              </div>
            </div>
          `,
          iconSize: [60, 60],
          iconAnchor: [30, 30]
        })
      }

      L.marker([rw.lat, rw.lng], {
        icon: createChartIcon(rw),
        zIndexOffset: 1000
      }).addTo(map.value!)
    })
  }
})

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

/* Custom popup styling with enhanced design for GeoJSON */
:global(.custom-popup .leaflet-popup-content-wrapper) {
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

:global(.custom-popup .leaflet-popup-tip) {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

/* Chart marker animations */
:global(.chart-marker) {
  transition: transform 0.3s ease;
}

:global(.chart-marker:hover) {
  transform: scale(1.1);
}

/* Leaflet zoom controls styling */
:global(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  border-radius: 12px !important;
}

:global(.leaflet-control-zoom a) {
  border-radius: 12px !important;
  border: none !important;
  color: #374151 !important;
  font-weight: bold !important;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px) !important;
}

:global(.leaflet-control-zoom a:hover) {
  background: rgba(59, 130, 246, 0.1) !important;
  color: #3b82f6 !important;
  transform: scale(1.05);
}

/* GeoJSON polygon styling improvements */
:global(.leaflet-interactive) {
  transition: all 0.3s ease;
}
</style>