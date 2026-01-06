import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function LocationMap({ location, height = '300px' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Default to Nairobi coordinates if no specific location
  const defaultCoordinates = {
    latitude: -1.286389,
    longitude: 36.817223
  };

  // Get coordinates or use default
  const coordinates = location?.coordinates || defaultCoordinates;
  const lat = coordinates.latitude || defaultCoordinates.latitude;
  const lng = coordinates.longitude || defaultCoordinates.longitude;

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if not already created
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 13);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Add marker
      L.marker([lat, lng]).addTo(mapInstanceRef.current)
        .bindPopup(`<b>${location?.city || 'Nairobi'}</b>${location?.area ? `<br/>${location.area}` : ''}`)
        .openPopup();
    } else {
      // Update map view if coordinates change
      mapInstanceRef.current.setView([lat, lng], 13);
      
      // Clear existing markers and add new one
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
      
      L.marker([lat, lng]).addTo(mapInstanceRef.current)
        .bindPopup(`<b>${location?.city || 'Nairobi'}</b>${location?.area ? `<br/>${location.area}` : ''}`)
        .openPopup();
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, location]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height, 
        width: '100%', 
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    />
  );
}

export default LocationMap;
