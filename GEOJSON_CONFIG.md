# GeoJSON Configuration Guide

## Overview
The map system now supports flexible GeoJSON file configuration, allowing you to change map data without modifying code.

## Configuration

### Environment Variable
Add this to your `.env` file:
```env
VITE_GEOJSON_FILE_PATH=/src/assets/kotabaruUpdate.geojson
```

### GeoJSON File Structure
Your GeoJSON file should follow this structure:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "rw": "RW 1",           // Required: RW identifier
        "lansia": 10,           // Required: Number of elderly
        "kelurahan": "Kotabaru" // Optional: Village name
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          // Polygon coordinates array
        ]
      }
    }
  ]
}
```

## How It Works

1. **Dynamic Loading**: The system reads the GeoJSON path from `VITE_GEOJSON_FILE_PATH`
2. **RW Extraction**: Automatically extracts all RW tags from the GeoJSON properties
3. **Center Calculation**: Calculates polygon centers for marker placement
4. **Mock Data Generation**: Generates health/economic data based on RW info

## Changing GeoJSON Files

To use a different GeoJSON file:

1. Place your new GeoJSON file in `src/assets/`
2. Update the `.env` file:
   ```env
   VITE_GEOJSON_FILE_PATH=/src/assets/your-new-file.geojson
   ```
3. Restart your development server
4. The map will automatically use the new data

## API Integration (Future)

The system is prepared for API integration. When your backend is ready:

1. Replace `generateMockData()` function with API calls
2. Use the commented `fetchRWDetailsFromAPI()` function as a template
3. API endpoint format: `GET /map/rw/{rwName}`

## Supported Properties

### Required in GeoJSON
- `rw`: RW identifier (e.g., "RW 1", "RW 2")
- `lansia`: Number of elderly people

### Optional in GeoJSON  
- `kelurahan`: Village/sub-district name
- Any additional properties for future use

### Auto-Generated (Mock Data)
- `population`: Total population
- `health`: Health level distribution
- `economic`: Economic status distribution
- `lat`/`lng`: Calculated polygon center

## Examples

### Simple Configuration
```env
VITE_GEOJSON_FILE_PATH=/src/assets/simple-map.geojson
```

### External File
```env
VITE_GEOJSON_FILE_PATH=https://api.example.com/geojson/kotabaru.geojson
```

## Troubleshooting

### File Not Found
- Verify the file path in `.env`
- Ensure the file exists in the correct location
- Check browser console for loading errors

### Invalid GeoJSON
- Validate your GeoJSON structure
- Ensure required properties (`rw`, `lansia`) are present
- Check polygon coordinate format

### No Data Displayed
- Check browser console for errors
- Verify GeoJSON features array is not empty
- Ensure polygon coordinates are valid