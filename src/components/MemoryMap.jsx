import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator";

export default function MemoryMap() {
  useEffect(() => {
    const map = L.map("map").setView([20, 0], 2);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    const customIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });

    const memories = [
      { lat: 40.7128, lng: -74.006, label: "Birthday at Grandma's" },
      { lat: -36.8485, lng: 174.7633, label: "First soccer match" },
      { lat: 51.5074, lng: -0.1278, label: "Trip to London" },
    ];

    memories.forEach((mem) => {
      L.marker([mem.lat, mem.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: 'Comic Sans MS', cursive; font-size: 16px;"><b>${mem.label}</b></div>`
        );
    });

    for (let i = 0; i < memories.length - 1; i++) {
      const from = [memories[i].lat, memories[i].lng];
      const to = [memories[i + 1].lat, memories[i + 1].lng];

      const line = L.polyline([from, to], {
        color: "red",
        weight: 2,
        opacity: 0.8,
      }).addTo(map);

      const arrow = L.polylineDecorator(line, {
        patterns: [
          {
            offset: "100%",
            repeat: 0,
            symbol: L.Symbol.arrowHead({
              pixelSize: 10,
              polygon: false,
              pathOptions: { stroke: true, color: "red" },
            }),
          },
        ],
      });
      arrow.addTo(map);
    }

    return () => map.remove();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div id="map" style={{ width: "100vw", height: "100vh", zIndex: 0 }} />
      {/* Optional scanline overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "100% 4px",
          pointerEvents: "none",
          zIndex: 999,
        }}
      />
    </div>
  );
}
