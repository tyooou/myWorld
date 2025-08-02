import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-polylinedecorator';

export default function MemoryMap() {
  useEffect(() => {
    const map = L.map('map').setView([20, 0], 2);

    // Use a pixel-style tile layer
    L.tileLayer('https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap contributors, tiles from Humanitarian OSM Team'
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });

    const memories = [
      { lat: 40.7128, lng: -74.006, label: "Birthday at Grandma's" },
      { lat: -36.8485, lng: 174.7633, label: "First soccer match" },
      { lat: 51.5074, lng: -0.1278, label: "Trip to London" }
    ];

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

      // Add arrowhead using SVG marker symbol
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

    return () => map.remove();
  }, []);

  return (
    <div id="map" style={{ width: '100vw', height: '100vh', zIndex: 0 }} />
  );
}
