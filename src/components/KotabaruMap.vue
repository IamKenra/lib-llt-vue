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
/**
 * KotabaruMap Component
 * 
 * Features:
 * - Flexible GeoJSON loading from environment variables (VITE_GEOJSON_FILE_PATH)
 * - Dynamic RW data extraction from GeoJSON properties
 * - Automatic polygon center calculation
 * - Mock data generation (ready for API integration)
 * - Interactive map with health/economic views
 * 
 * Configuration:
 * - Set VITE_GEOJSON_FILE_PATH in .env to change GeoJSON file
 * - GeoJSON should have 'rw' and 'lansia' properties in features
 * 
 * API Integration Ready:
 * - Mock data functions prepared for replacement with API calls
 * - See fetchRWDetailsFromAPI function for implementation example
 */
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// GeoJSON data will be loaded dynamically from configurable path
const kotabaruGeoJSON = ref<any>(null)

// Load GeoJSON data from configurable path
const loadGeoJSONData = async () => {
  try {
    // Get GeoJSON path from environment variables with fallback
    const geojsonPath = import.meta.env.VITE_GEOJSON_FILE_PATH || '/src/assets/kotabaruUpdate.geojson'
    console.log('Loading GeoJSON from:', geojsonPath)
    
    const response = await fetch(geojsonPath)
    if (!response.ok) {
      throw new Error(`Failed to load GeoJSON: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Validate GeoJSON structure
    if (!data.type || data.type !== 'FeatureCollection' || !data.features) {
      throw new Error('Invalid GeoJSON format')
    }
    
    kotabaruGeoJSON.value = data
    console.log('GeoJSON loaded successfully with', data.features.length, 'features')
    return data
  } catch (error) {
    console.error('Error loading GeoJSON:', error)
    
    // Return a basic fallback structure
    const fallbackData = {
      "type": "FeatureCollection",
      "features": []
    }
    
    kotabaruGeoJSON.value = fallbackData
    return fallbackData
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

// Dynamic RW data extracted from GeoJSON - will be populated after loading
const rwData = ref<any[]>([])

// Calculate smart popup positioning based on cursor location in map
const calculatePopupOffset = (mapLayer: L.Map, latlng: L.LatLng): [number, number] => {
  const mapContainer = mapLayer.getContainer()
  const mapBounds = mapContainer.getBoundingClientRect()
  const point = mapLayer.latLngToContainerPoint(latlng)
  
  let offsetX = 0
  let offsetY = -10
  
  // If near top edge (within 120px), show popup below cursor
  if (point.y < 120) {
    offsetY = 40
  }
  
  // If near right edge (within 200px), shift popup left
  if (point.x > mapBounds.width - 200) {
    offsetX = -150
  }
  
  // If near left edge (within 100px), shift popup right
  if (point.x < 100) {
    offsetX = 100
  }
  
  // If near bottom edge (within 80px), ensure popup goes up
  if (point.y > mapBounds.height - 80) {
    offsetY = -80
  }
  
  return [offsetX, offsetY]
}

// Create RW title icon with contrasting colors
const createRWTitleIcon = (rwName: string, polygonColor: string) => {
  // Determine if the polygon color is light or dark to choose contrasting text
  const isLightColor = (color: string): boolean => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5
  }
  
  const textColor = isLightColor(polygonColor) ? '#1f2937' : '#ffffff'
  const bgColor = isLightColor(polygonColor) 
    ? 'rgba(255, 255, 255, 0.95)' 
    : 'rgba(0, 0, 0, 0.8)'
  const borderColor = isLightColor(polygonColor)
    ? 'rgba(0, 0, 0, 0.1)'
    : 'rgba(255, 255, 255, 0.2)'
  
  const titleHTML = `
    <div style="
      background: ${bgColor};
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: bold;
      color: ${textColor};
      text-align: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      border: 1px solid ${borderColor};
      white-space: nowrap;
      display: inline-block;
      position: relative;
      pointer-events: none;
      text-shadow: ${isLightColor(polygonColor) ? 'none' : '0 1px 2px rgba(0,0,0,0.8)'};
    ">
      ${rwName}
    </div>
  `
  
  return L.divIcon({
    className: 'rw-title-marker',
    html: titleHTML,
    iconSize: [60, 30],
    iconAnchor: [30, 15]
  })
}

// Calculate polygon center that works better for irregular shapes
const calculatePolygonCenter = (coordinates: number[][][]): { lat: number, lng: number } => {
  if (!coordinates || !coordinates[0]) {
    return { lat: 0, lng: 0 }
  }

  const points = coordinates[0]
  
  // Find bounding box
  let minLat = points[0][1]
  let maxLat = points[0][1]
  let minLng = points[0][0]
  let maxLng = points[0][0]
  
  points.forEach(([lng, lat]) => {
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
  })
  
  // Start with bounding box center as initial guess
  let bestLat = (minLat + maxLat) / 2
  let bestLng = (minLng + maxLng) / 2
  
  // Try to find a better center by testing multiple points
  const gridSize = 20
  const stepLat = (maxLat - minLat) / gridSize
  const stepLng = (maxLng - minLng) / gridSize
  
  let maxDistance = 0
  
  // Test grid points to find the one with maximum distance to polygon edges
  for (let i = 1; i < gridSize; i++) {
    for (let j = 1; j < gridSize; j++) {
      const testLat = minLat + i * stepLat
      const testLng = minLng + j * stepLng
      
      // Check if point is inside polygon
      if (isPointInPolygon(testLat, testLng, points)) {
        // Calculate minimum distance to any edge
        const minDistToEdge = getMinDistanceToEdge(testLat, testLng, points)
        
        if (minDistToEdge > maxDistance) {
          maxDistance = minDistToEdge
          bestLat = testLat
          bestLng = testLng
        }
      }
    }
  }
  
  return {
    lat: bestLat,
    lng: bestLng
  }
}

// Check if point is inside polygon using ray casting algorithm
const isPointInPolygon = (lat: number, lng: number, points: number[][]): boolean => {
  let inside = false
  
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [lng1, lat1] = points[i]
    const [lng2, lat2] = points[j]
    
    if (((lat1 > lat) !== (lat2 > lat)) && 
        (lng < (lng2 - lng1) * (lat - lat1) / (lat2 - lat1) + lng1)) {
      inside = !inside
    }
  }
  
  return inside
}

// Calculate minimum distance from point to polygon edges
const getMinDistanceToEdge = (lat: number, lng: number, points: number[][]): number => {
  let minDistance = Infinity
  
  for (let i = 0; i < points.length - 1; i++) {
    const [lng1, lat1] = points[i]
    const [lng2, lat2] = points[i + 1]
    
    const distance = getDistanceToLineSegment(lat, lng, lat1, lng1, lat2, lng2)
    minDistance = Math.min(minDistance, distance)
  }
  
  return minDistance
}

// Calculate distance from point to line segment
const getDistanceToLineSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number): number => {
  const dx = x2 - x1
  const dy = y2 - y1
  
  if (dx === 0 && dy === 0) {
    // Line segment is a point
    return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2)
  }
  
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))
  const projectionX = x1 + t * dx
  const projectionY = y1 + t * dy
  
  return Math.sqrt((px - projectionX) ** 2 + (py - projectionY) ** 2)
}

// Generate mock health and economic data based on RW name
// TODO: Replace this with actual API call when backend is ready
// Example API call: await ApiService.get(`/map/rw/${rwName}/details`)
const generateMockData = (rwName: string, lansiaCount: number) => {
  const rwNumber = parseInt(rwName.replace(/\D/g, '')) || 1
  
  return {
    population: 200 + (rwNumber * 30),
    health: {
      level1: Math.max(1, lansiaCount - rwNumber * 2),
      level2: Math.min(8, Math.floor(lansiaCount * 0.2) + rwNumber),
      level3: Math.min(5, Math.floor(lansiaCount * 0.1))
    },
    economic: {
      kurangMampu: Math.min(lansiaCount, Math.floor(lansiaCount * 0.3) + rwNumber),
      cukupMampu: Math.max(1, Math.floor(lansiaCount * 0.5)),
      sangatMampu: Math.max(1, Math.floor(lansiaCount * 0.2))
    }
  }
}

// Future API integration function
// When backend is ready, replace generateMockData with this function
/*
const fetchRWDetailsFromAPI = async (rwName: string) => {
  try {
    const response = await ApiService.get(`/map/rw/${encodeURIComponent(rwName)}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching details for ${rwName}:`, error)
    // Fallback to mock data if API fails
    return generateMockData(rwName, 0)
  }
}
*/

// Extract RW data from loaded GeoJSON
const extractRWDataFromGeoJSON = (geoJsonData: any) => {
  if (!geoJsonData?.features) {
    console.warn('No GeoJSON features found')
    return []
  }

  return geoJsonData.features.map((feature: any) => {
    const { properties, geometry } = feature
    const rwName = properties.rw
    const lansiaFromGeoJSON = properties.lansia || 0
    const kelurahan = properties.kelurahan || 'Unknown'
    
    // Calculate center point from polygon coordinates
    const center = calculatePolygonCenter(geometry.coordinates)
    
    // Generate mock data (replace with API call in the future)
    const mockData = generateMockData(rwName, lansiaFromGeoJSON)
    
    return {
      id: rwName.replace(/\s/g, ''),
      name: rwName,
      kelurahan: kelurahan,
      population: mockData.population,
      lansiaCount: lansiaFromGeoJSON,
      lat: center.lat,
      lng: center.lng,
      health: mockData.health,
      economic: mockData.economic
    }
  })
}

// GeoJSON styling functions
const getGeoJSONStyle = (feature: any) => {
  const rw = feature.properties.rw
  
  // Find matching RW data for detailed health/economic info
  const rwInfo = rwData.value.find(r => r.name === rw)
  
  if (!rwInfo) {
    return {
      fillColor: '#9ca3af',
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

const totalLansia = computed(() => rwData.value.reduce((sum, rw) => sum + rw.lansiaCount, 0))

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


// Create dynamic popup content based on current view
const createPopupContent = (feature: any, rwInfo: any, currentView: 'health' | 'economic') => {
  let statusInfo = ''
  let statusColor = '#10b981'
  let viewTitle = ''
  
  if (currentView === 'health') {
    const healthData = getHealthDominant(rwInfo.health)
    statusColor = healthData.color
    viewTitle = 'Status Kesehatan'
    statusInfo = `
      <div class="grid grid-cols-3 gap-2 text-xs mt-2">
        <div class="text-center">
          <div class="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
          <div class="text-gray-600 text-xs">Level 1</div>
          <div class="font-semibold text-xs">${rwInfo.health.level1}</div>
        </div>
        <div class="text-center">
          <div class="w-2 h-2 bg-yellow-500 rounded-full mx-auto mb-1"></div>
          <div class="text-gray-600 text-xs">Level 2</div>
          <div class="font-semibold text-xs">${rwInfo.health.level2}</div>
        </div>
        <div class="text-center">
          <div class="w-2 h-2 bg-red-500 rounded-full mx-auto mb-1"></div>
          <div class="text-gray-600 text-xs">Level 3</div>
          <div class="font-semibold text-xs">${rwInfo.health.level3}</div>
        </div>
      </div>
    `
  } else {
    const economicData = getEconomicDominant(rwInfo.economic)
    statusColor = economicData.color
    viewTitle = 'Status Ekonomi'
    statusInfo = `
      <div class="grid grid-cols-3 gap-2 text-xs mt-2">
        <div class="text-center">
          <div class="w-2 h-2 bg-red-500 rounded-full mx-auto mb-1"></div>
          <div class="text-gray-600 text-xs">Kurang</div>
          <div class="font-semibold text-xs">${rwInfo.economic.kurangMampu}</div>
        </div>
        <div class="text-center">
          <div class="w-2 h-2 bg-yellow-500 rounded-full mx-auto mb-1"></div>
          <div class="text-gray-600 text-xs">Cukup</div>
          <div class="font-semibold text-xs">${rwInfo.economic.cukupMampu}</div>
        </div>
        <div class="text-center">
          <div class="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
          <div class="text-gray-600 text-xs">Sangat</div>
          <div class="font-semibold text-xs">${rwInfo.economic.sangatMampu}</div>
        </div>
      </div>
    `
  }
  
  return `
    <div class="p-3" style="min-width: 200px; max-width: 240px;">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-3 h-3 rounded-full" style="background-color: ${statusColor}"></div>
        <h3 class="text-sm font-bold text-gray-800">${feature.properties.rw}</h3>
      </div>
      <div class="space-y-1 text-xs">
        <div class="flex justify-between">
          <span class="text-gray-600">Lansia:</span>
          <span class="font-semibold text-indigo-600">${feature.properties.lansia}</span>
        </div>
        <div class="border-t border-gray-200 pt-1">
          <div class="text-gray-700 font-medium text-xs mb-1">${viewTitle}:</div>
          ${statusInfo}
        </div>
      </div>
    </div>
  `
}

// Custom tooltip element for better control
let customTooltip: HTMLDivElement | null = null

// Create custom tooltip element
const createCustomTooltip = () => {
  if (customTooltip) return customTooltip
  
  customTooltip = document.createElement('div')
  customTooltip.className = 'custom-map-tooltip'
  customTooltip.style.cssText = `
    position: absolute;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0;
    max-width: 250px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    backdrop-filter: blur(8px);
  `
  
  document.body.appendChild(customTooltip)
  return customTooltip
}

// Position tooltip safely within viewport
const positionTooltip = (tooltip: HTMLDivElement, mouseX: number, mouseY: number) => {
  const tooltipRect = tooltip.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  let x = mouseX + 15 // Default offset
  let y = mouseY - tooltipRect.height - 10 // Above cursor by default
  
  // Check right boundary
  if (x + tooltipRect.width > viewportWidth - 20) {
    x = mouseX - tooltipRect.width - 15 // Move to left of cursor
  }
  
  // Check left boundary
  if (x < 20) {
    x = 20 // Min distance from edge
  }
  
  // Check top boundary
  if (y < 20) {
    y = mouseY + 20 // Move below cursor
  }
  
  // Check bottom boundary
  if (y + tooltipRect.height > viewportHeight - 20) {
    y = viewportHeight - tooltipRect.height - 20 // Keep in view
  }
  
  tooltip.style.left = `${x}px`
  tooltip.style.top = `${y}px`
}

// GeoJSON interaction functions with custom tooltip
const onEachFeature = (feature: any, layer: L.Layer) => {
  const rw = feature.properties.rw
  const rwInfo = rwData.value.find(r => r.name === rw)
  
  if (rwInfo) {
    // Add hover effects and tooltip on mouseover
    layer.on('mouseover', function(e) {
      // Highlight the polygon
      if (layer instanceof L.Path) {
        layer.setStyle({
          weight: 4,
          fillOpacity: 0.8
        })
      }
      
      // Create and show custom tooltip
      const tooltip = createCustomTooltip()
      const popupContent = createPopupContent(feature, rwInfo, props.mapView)
      tooltip.innerHTML = popupContent
      tooltip.style.opacity = '1'
      
      // Position tooltip based on mouse position
      const mouseEvent = e.originalEvent as MouseEvent
      positionTooltip(tooltip, mouseEvent.clientX, mouseEvent.clientY)
    })

    layer.on('mouseout', function() {
      // Remove highlight
      if (layer instanceof L.Path) {
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.6
        })
      }
      
      // Hide tooltip
      if (customTooltip) {
        customTooltip.style.opacity = '0'
      }
    })

    // Handle mouse move to update tooltip position
    layer.on('mousemove', function(e) {
      if (customTooltip && customTooltip.style.opacity === '1') {
        const mouseEvent = e.originalEvent as MouseEvent
        positionTooltip(customTooltip, mouseEvent.clientX, mouseEvent.clientY)
      }
    })
  }
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
    
    // Extract RW data from GeoJSON
    rwData.value = extractRWDataFromGeoJSON(geoJSONData)
    console.log('Extracted RW data:', rwData.value)

    // Calculate bounds of all polygons for map constraints and centering
    let bounds: L.LatLngBounds | null = null
    let centerLat = -7.7860
    let centerLng = 110.3710
    
    if (geoJSONData.features && geoJSONData.features.length > 0) {
      bounds = L.geoJSON(geoJSONData).getBounds()
      
      // Get center from bounds for better positioning
      const boundsCenter = bounds.getCenter()
      centerLat = boundsCenter.lat
      centerLng = boundsCenter.lng
      
      // Add padding around the bounds for scroll restrictions
      const padding = 0.001 // Smaller padding for tighter bounds
      bounds = bounds.pad(padding)
    }

    // Initialize map with constraints
    map.value = L.map(mapContainer.value, {
      center: [centerLat, centerLng],
      zoom: 16,
      minZoom: 15,        // Prevent zooming out too far
      maxZoom: 19,        // Allow closer zoom for detail
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
      touchZoom: true,
      boxZoom: false,     // Disable box zoom
      maxBounds: bounds || undefined,  // Restrict panning to GeoJSON area
      maxBoundsViscosity: 1.0  // Prevent dragging outside bounds
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

    // Fit map to show all polygons with padding
    if (bounds) {
      map.value.fitBounds(bounds, {
        padding: [20, 20], // 20px padding on all sides
        maxZoom: 16        // Don't zoom in too close initially
      })
    }

    // Add center markers and RW titles for statistical visualization on GeoJSON polygons
    rwData.value.forEach(rw => {
      const rwColor = props.mapView === 'health' 
        ? getHealthDominant(rw.health).color
        : getEconomicDominant(rw.economic).color


      // Add the RW title label at polygon center - using title from GeoJSON
      L.marker([rw.lat, rw.lng], {
        icon: createRWTitleIcon(rw.name, rwColor), // rw.name comes from GeoJSON properties.rw
        zIndexOffset: 1001
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
    
    // Re-add only RW title markers with new styling
    rwData.value.forEach(rw => {
      const rwColor = props.mapView === 'health' 
        ? getHealthDominant(rw.health).color
        : getEconomicDominant(rw.economic).color

      // Add RW title label at polygon center - using title from GeoJSON
      L.marker([rw.lat, rw.lng], {
        icon: createRWTitleIcon(rw.name, rwColor), // rw.name comes from GeoJSON properties.rw
        zIndexOffset: 1001
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
  
  // Clean up custom tooltip
  if (customTooltip) {
    document.body.removeChild(customTooltip)
    customTooltip = null
  }
})
</script>

<style scoped>
.map-graph-container {
  position: relative;
}

/* Custom tooltip styling */
:global(.custom-map-tooltip) {
  font-family: inherit;
  font-size: 12px;
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