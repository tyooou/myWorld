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

    // Function to add markers and lines
    const updateMapMarkers = () => {
      // Clear existing markers and lines (simplest way is to remove and recreate the map)
      map.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.PolylineDecorator) {
          map.removeLayer(layer);
        }
      });

      // Add markers
      memories.forEach(mem => {
        L.marker([mem.lat, mem.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`<div style="font-family: 'Comic Sans MS', cursive; font-size: 16px;"><b>${mem.label}</b></div>`);
      });

      // Draw arrows between consecutive points
      for (let i = 0; i < memories.length - 1; i++) {
        const from = [memories[i].lat, memories[i].lng];
        const to = [memories[i + 1].lat, memories[i + 1].lng];

        const line = L.polyline([from, to], {
          color: 'red',
          weight: 2,
          opacity: 0.8
        }).addTo(map);

        // Add arrowhead
        const arrow = L.polylineDecorator(line, {
          patterns: [
            {
              offset: '100%',
              repeat: 0,
              symbol: L.Symbol.arrowHead({ pixelSize: 10, polygon: false, pathOptions: { stroke: true, color: 'red' } })
            }
          ]
        });
        arrow.addTo(map);
      }
    };

    // Initial render
    updateMapMarkers();

    // Add click handler
    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      const newMemory = {
        lat,
        lng,
        label: `Memory ${memories.length + 1}`
      };
      setMemories([...memories, newMemory]);
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
      map.remove();
    };
  }, [memories]); // This effect depends on the memories state

  return (
    <div id="map" style={{ width: '100vw', height: '100vh', zIndex: 0 }} />
  );
}