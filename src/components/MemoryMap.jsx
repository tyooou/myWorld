import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MemoryMap.css';
import NewMemoryForm from './NewMemoryForm.jsx';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWJvcndlZWQiLCJhIjoiY21kdG1mcjNkMHBneTJsb24zZzdsZHQycyJ9.B6OMNYu8tzRTiYXh5xLOpQ';

export default function MemoryMap() {
  const mapContainer = useRef(null);
  const pixelCanvasRef = useRef(null);
  const mapInstance = useRef(null);
  const rafRef = useRef(null);
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formPosition, setFormPosition] = useState({ lat: 0, lng: 0 });
  const [newMemory, setNewMemory] = useState({
    title: '',
    isJournal: false,
    files: [],
    voiceMemo: null
  });
  const previousViewRef = useRef({ center: [0, 20], zoom: 1.5 });
  const markerObjs = useRef([]);
  const tempMarkerRef = useRef(null);

  // Helper: degrees to radians
  const toRad = deg => (deg * Math.PI) / 180;

  // Returns true if point is on the visible hemisphere of the globe
  const isVisibleOnGlobe = (center, point) => {
    const lat1 = toRad(center.lat);
    const lon1 = toRad(center.lng);
    const lat2 = toRad(point.lat);
    const lon2 = toRad(point.lng);
    const dCos =
      Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const d = Math.acos(Math.min(1, Math.max(-1, dCos))); // clamp for safety
    return d <= Math.PI / 2;
  };

  const updateMarkerVisibility = () => {
    if (!mapInstance.current) return;
    const center = mapInstance.current.getCenter();
    markerObjs.current.forEach(({ mem, marker }) => {
      if (isVisibleOnGlobe(center, { lat: mem.lat, lng: mem.lng })) {
        marker.getElement().style.display = '';
      } else {
        marker.getElement().style.display = 'none';
      }
    });
  };

  const updateMapMarkers = () => {
    // Clear existing markers
    markerObjs.current.forEach(({ marker }) => marker.remove());
    markerObjs.current = [];

    // Add new markers
    memories.forEach(mem => {
      const marker = new mapboxgl.Marker()
        .setLngLat([mem.lng, mem.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="font-family: 'Comic Sans MS', cursive; font-size: 14px; color: black;"><b>${mem.label}</b></div>`
          )
        )
        .addTo(mapInstance.current);
      
      markerObjs.current.push({ mem, marker });
    });

    updateMarkerVisibility();
  };

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
    mapInstance.current.flyTo({
      center: previousViewRef.current.center,
      zoom: previousViewRef.current.zoom,
      essential: true
    });
  };

  useEffect(() => {
    // Initialize the map
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/eborweed/cmdtnwc8b007x01srgmfwar2m',
      center: previousViewRef.current.center,
      zoom: previousViewRef.current.zoom,
      projection: 'globe',
      antialias: true,
    });

    mapInstance.current.on('load', () => {
      updateMapMarkers();

      // Add click handler for the map
      mapInstance.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        
        // Store current view before zooming
        previousViewRef.current = {
          center: mapInstance.current.getCenter(),
          zoom: mapInstance.current.getZoom()
        };
        
        // Remove previous temp marker if it exists
        if (tempMarkerRef.current) {
          tempMarkerRef.current.remove();
        }
        
        // Zoom to the clicked location
        mapInstance.current.flyTo({
          center: [lng, lat],
          zoom: 12,
          essential: true
        });
        
        // Add temporary marker
        const el = document.createElement('div');
        el.className = 'temp-marker';
        el.style.backgroundImage = 'url(https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png)';
        el.style.width = '25px';
        el.style.height = '41px';
        el.style.backgroundSize = 'contain';
        
        tempMarkerRef.current = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML("New memory location (unsaved)"))
          .addTo(mapInstance.current)
          .togglePopup();
        
        setFormPosition({ lat, lng });
        setShowForm(true);
        setNewMemory({
          title: '',
          isJournal: false,
          files: [],
          voiceMemo: null
        });
      });

      // Sync visibility when the globe moves/rotates/etc.
      mapInstance.current.on('move', updateMarkerVisibility);
      mapInstance.current.on('rotate', updateMarkerVisibility);
      mapInstance.current.on('pitch', updateMarkerVisibility);
      mapInstance.current.on('zoom', updateMarkerVisibility);

      // Start pixelation loop
      const pixelateMap = () => {
        if (!mapInstance.current || !pixelCanvasRef.current) {
          rafRef.current = requestAnimationFrame(pixelateMap);
          return;
        }
        
        const mapCanvas = mapInstance.current.getCanvas();
        const pixelCanvas = pixelCanvasRef.current;
        const currentZoom = mapInstance.current.getZoom();
        
        // Calculate pixelation intensity - STRONG when zoomed OUT (low zoom level)
        const minScale = 0.1; // strongest pixelation when zoomed out
        const maxScale = 1;    // no pixelation when zoomed in
        const zoomMin = 1;     // adjust if your lowest meaningful zoom is different
        const zoomMax = 20;    // zoom at which you want full resolution

        // normalized t from 0 (zoomMin) to 1 (zoomMax)
        let t = (currentZoom - zoomMin) / (zoomMax - zoomMin);
        t = Math.max(0, Math.min(1, t)); // clamp

        const scale = minScale + t * (maxScale - minScale);

        // Ensure canvas sizes match
        if (pixelCanvas.width !== mapCanvas.width || pixelCanvas.height !== mapCanvas.height) {
          pixelCanvas.width = mapCanvas.width;
          pixelCanvas.height = mapCanvas.height;
        }
        
        const ctx = pixelCanvas.getContext('2d');
        const sw = Math.max(1, Math.floor(mapCanvas.width * scale));
        const sh = Math.max(1, Math.floor(mapCanvas.height * scale));
        
        // Create temporary canvas for pixelation
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = sw;
        tmpCanvas.height = sh;
        const tmpCtx = tmpCanvas.getContext('2d');
        
        // Draw map to temporary canvas (downscaled)
        tmpCtx.drawImage(mapCanvas, 0, 0, mapCanvas.width, mapCanvas.height, 0, 0, sw, sh);
        
        // Draw back to pixel canvas (upscaled with pixelation)
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
        ctx.drawImage(tmpCanvas, 0, 0, sw, sh, 0, 0, pixelCanvas.width, pixelCanvas.height);
        
        rafRef.current = requestAnimationFrame(pixelateMap);
      };

      // Start pixelation
      rafRef.current = requestAnimationFrame(pixelateMap);
    });

    // Cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers when memories change
  useEffect(() => {
    if (mapInstance.current && mapInstance.current.isStyleLoaded()) {
      updateMapMarkers();
    }
  }, [memories]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Pixelated map layer - shows the pixelated version */}
      <canvas
        ref={pixelCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      
      {/* Main map container - visible with controls */}
      <div
        ref={mapContainer}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          background: 'transparent !important'
        }}
      />
      
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