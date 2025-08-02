import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-polylinedecorator';
import './MemoryMap.css';
import NewMemoryForm from './NewMemoryForm.jsx'; 

export default function MemoryMap() {
  const [memories, setMemories] = useState([
    { lat: 40.7128, lng: -74.006, label: "Birthday at Grandma's" },
    { lat: -36.8485, lng: 174.7633, label: "First soccer match" },
    { lat: 51.5074, lng: -0.1278, label: "Trip to London" }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formPosition, setFormPosition] = useState({ lat: 0, lng: 0 });
  const [newMemory, setNewMemory] = useState({
    title: '',
    isJournal: false,
    files: [],
    voiceMemo: null
  });
  const mapRef = useRef(null);
  const tempMarkerRef = useRef(null);
  const previousViewRef = useRef({ center: [20, 0], zoom: 2 }); // Store previous view state

  useEffect(() => {
    // Fix for default Leaflet markers not showing
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Initialize the map
    const map = L.map('map').setView([20, 0], 2);
    mapRef.current = map;

    // Tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
      maxZoom: 19
    }).addTo(map);

    // Create a distinctive icon for temporary markers
    const tempIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41]
    });

    const customIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41]
    });

    // Function to add markers (no more lines/arrows)
    const updateMapMarkers = () => {
      // Clear existing markers only
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add markers for each memory
      memories.forEach(mem => {
        L.marker([mem.lat, mem.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: 'Comic Sans MS', cursive; font-size: 16px;"><b>${mem.label}</b></div>`
          );
      });

      // Add lines between memories
      if (memories.length > 1) {
        for (let i = 0; i < memories.length - 1; i++) {
          const from = [memories[i].lat, memories[i].lng];
          const to = [memories[i + 1].lat, memories[i + 1].lng];

          const line = L.polyline([from, to], {
            color: 'red',
            weight: 2,
            opacity: 0.8
          }).addTo(map);

          const arrow = L.polylineDecorator(line, {
            patterns: [
              {
                offset: '100%',
                repeat: 0,
                symbol: L.Symbol.arrowHead({ 
                  pixelSize: 10, 
                  polygon: false, 
                  pathOptions: { stroke: true, color: 'red' } 
                })
              }
            ]
          });
          arrow.addTo(map);
        }
      }
    };

    updateMapMarkers();

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      
      // Store current view before zooming
      previousViewRef.current = {
        center: mapRef.current.getCenter(),
        zoom: mapRef.current.getZoom()
      };
      
      // Remove previous temp marker if it exists
      if (tempMarkerRef.current) {
        mapRef.current.removeLayer(tempMarkerRef.current);
      }
      
      // Enhanced zoom animation with slower, smoother transition
      mapRef.current.flyTo([lat, lng], 16, {
        duration: 1,
        easeLinearity: 0.25,
        noMoveStart: true,
      });
      
      // Add a slight delay before adding the marker to ensure zoom completes
      setTimeout(() => {
        // Create new temp marker with blue icon
        const marker = L.marker([lat, lng], { 
          icon: tempIcon,
          zIndexOffset: 1000
        }).addTo(mapRef.current);
        
        // Open popup to make it more visible
        marker.bindPopup("New memory location (unsaved)").openPopup();
        
        tempMarkerRef.current = marker;
      }, 500);
      
      setFormPosition({ lat, lng });
      setShowForm(true);
      setNewMemory({
        title: '',
        isJournal: false,
        files: [],
        voiceMemo: null
      });
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
      map.remove();
    };
  }, [memories]);

  const handleFileChange = (e) => {
    setNewMemory({
      ...newMemory,
      files: [...newMemory.files, ...Array.from(e.target.files)]
    });
  };

  const handleVoiceMemo = () => {
    alert("Voice memo functionality would be implemented here");
    setNewMemory({
      ...newMemory,
      voiceMemo: "voice-memo-placeholder.mp3"
    });
  };

  const handleSave = () => {
    if (!newMemory.title.trim()) {
      alert("Please enter a title");
      return;
    }

    const memoryToAdd = {
      lat: formPosition.lat,
      lng: formPosition.lng,
      label: newMemory.title,
      isJournal: newMemory.isJournal,
      files: newMemory.files,
      voiceMemo: newMemory.voiceMemo
    };

    setMemories([...memories, memoryToAdd]);
    setShowForm(false);
    if (tempMarkerRef.current) {
      tempMarkerRef.current.remove();
      tempMarkerRef.current = null;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    if (tempMarkerRef.current) {
      tempMarkerRef.current.remove();
      tempMarkerRef.current = null;
    }
    // Restore previous view
    mapRef.current.flyTo(
      previousViewRef.current.center, 
      previousViewRef.current.zoom, 
      {
        duration: 1,
        easeLinearity: 0.25
      }
    );
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div id="map" style={{ width: '100%', height: '100%', zIndex: 0 }} />
      
      {showForm && (
        <NewMemoryForm
          newMemory={newMemory}
          setNewMemory={setNewMemory}
          onFileChange={handleFileChange}
          onVoiceMemo={handleVoiceMemo}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}