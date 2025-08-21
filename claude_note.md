# Claude Note - Lib LLT Vue

## Checklist Fitur Development

### 🗺️ Map Graph - Data Sebaran Lansia per RW
- [ ] Setup library mapping (Leaflet.js/D3.js/MapBox)
- [ ] Download data boundary kelurahan Kotabaru, Yogyakarta
  - Sumber: BPS/HDX (Indonesia Administrative Boundaries Level 4)
  - Format: GeoJSON/Shapefile
  - URL HDX: https://data.humdata.org/dataset/cod-ab-idn
- [ ] Konversi Shapefile ke GeoJSON (jika diperlukan)
- [ ] Implementasi komponen map chart
- [ ] Integrasi data sebaran lansia per RW
- [ ] Styling dan interaktifitas map
- [ ] Testing dan optimasi performance

## Catatan Teknis

### Data Boundary Kelurahan
- **Sumber Utama**: BPS (Badan Pusat Statistik)
  - Portal SIG BPS: sig.bps.go.id
  - BPS Yogyakarta: yogyakarta.bps.go.id
- **Sumber Alternatif**: 
  - HDX (Humanitarian Data Exchange): Level 4 administrative boundaries
  - GitHub repositories: bachtiarpanjaitan/geojson-id, Alf-Anas/batas-administrasi-indonesia
  - OpenStreetMap: polygons.openstreetmap.fr

### Library Options
1. **Leaflet.js + Vue2Leaflet**: Lightweight, baik untuk interactive maps
2. **D3.js**: Full control, baik untuk custom visualization
3. **MapBox GL JS**: High performance, advanced styling

### Target Implementation
- Visualisasi data sebaran lansia per RW dalam bentuk choropleth map
- Interactive tooltip dengan detail data
- Zoom dan pan functionality
- Legend dan filter options