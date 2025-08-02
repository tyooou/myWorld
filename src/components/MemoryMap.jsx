import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-polylinedecorator';

export default function MemoryMap() {
  const [memories, setMemories] = useState([
    { lat: 40.7128, lng: -74.006, label: "Birthday at Grandma's" },
    { lat: -36.8485, lng: 174.7633, label: "First soccer match" },
    { lat: 51.5074, lng: -0.1278, label: "Trip to London" }
  ]);

  useEffect(() => {
    const map = L.map('map').setView([20, 0], 2);

    // Use a pixel-style tile layer that works across platforms
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });

    // Function to add markers (no more lines/arrows)
    const updateMapMarkers = () => {
      // Clear existing markers only
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add markers
      memories.forEach(mem => {
        L.marker([mem.lat, mem.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: 'Comic Sans MS', cursive; font-size: 16px;"><b>${mem.label}</b></div>`
          );
      });
    };

    // Initial render
    updateMapMarkers();

    // Add click handler
    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      const tempId = Date.now(); // Temporary ID for the new memory
      
      // Create a temporary marker with an input form
      const newMarker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      
      // Create a form for the popup
      const formHtml = `
        <div style="font-family: Arial, sans-serif;">
          <h3 style="margin-top: 0;">Name your memory</h3>
          <input type="text" id="memory-input-${tempId}" style="width: 100%; padding: 5px; margin-bottom: 5px;" placeholder="Enter memory name">
          <button onclick="window.saveMemory(${tempId}, ${lat}, ${lng})" 
                  style="background: #4CAF50; color: white; border: none; padding: 5px 10px; cursor: pointer;">
            Save
          </button>
        </div>
      `;
      
      // Bind the popup with the form
      newMarker.bindPopup(formHtml).openPopup();
      
      // Add the save function to the window object temporarily
      window.saveMemory = (id, lat, lng) => {
        const input = document.getElementById(`memory-input-${id}`);
        const label = input.value || `Memory ${memories.length + 1}`;
        
        // Remove the temporary marker
        map.removeLayer(newMarker);
        
        // Add the new memory to state
        setMemories([...memories, { lat, lng, label }]);
        
        // Clean up the temporary function
        delete window.saveMemory;
      };
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
      map.remove();
      // Clean up the temporary function when component unmounts
      if (window.saveMemory) {
        delete window.saveMemory;
      }
    };
  }, [memories]);

  return (
    <div id="map" style={{ width: '100vw', height: '100vh', zIndex: 0 }} />
  );
}