import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MemoryMap.css";
import NewMemoryForm from "./memory/NewMemoryForm.jsx";
import Timeline from "./Timeline/Timeline.jsx";
import Header from "./Header.jsx";

mapboxgl.accessToken = "pk.eyJ1IjoiZWJvcndlZWQiLCJhIjoiY21kdG1mcjNkMHBneTJsb24zZzdsZHQycyJ9.B6OMNYu8tzRTiYXh5xLOpQ";

export default function MemoryMap({ name, permission, onBack }) {
  // Refs
  const mapContainer = useRef(null);
  const pixelCanvasRef = useRef(null);
  const mapInstance = useRef(null);
  const rafRef = useRef(null);
  
  // State
  const [memories, setMemories] = useState(name?.memories || []);
  const [isSwitchingUser, setIsSwitchingUser] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [formPosition, setFormPosition] = useState({ lat: 0, lng: 0 });
  const [selectedMemoryId, setSelectedMemoryId] = useState(null);
  const [newMemory, setNewMemory] = useState({
    title: '',
    journal: '',
    files: [],
    voiceMemo: null,
    country: '',
    tag: '',
    coordinate: { lat: null, lng: null },
    date: new Date().toISOString().split('T')[0]
  });
  const [isLocating, setIsLocating] = useState(false);
  const [projectionStyle, setProjectionStyle] = useState('globe');
  
  const previousViewRef = useRef({ center: [0, 20], zoom: 4 });
  const markerObjs = useRef([]);
  const tempMarkerRef = useRef(null);

  // Handle user switching
  useEffect(() => {
    setIsSwitchingUser(true);
    setMemories(name?.memories || []);
    setTimeout(() => setIsSwitchingUser(false), 300);
  }, [name]);

  // Update markers when memories change
  useEffect(() => {
    if (!mapInstance.current) return;
  
    const waitUntilReady = () => {
      if (mapInstance.current.isStyleLoaded()) {
        updateMapMarkers();
      } else {
        setTimeout(waitUntilReady, 100);
      }
    };
  
    waitUntilReady();
  }, [memories]);

  // Helper functions
  const toRad = deg => (deg * Math.PI) / 180;

  const isVisibleOnGlobe = (center, point) => {
    const lat1 = toRad(center.lat);
    const lon1 = toRad(center.lng);
    const lat2 = toRad(point.lat);
    const lon2 = toRad(point.lng);
    const dCos =
      Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const d = Math.acos(Math.min(1, Math.max(-1, dCos)));
    return d <= Math.PI / 2;
  };

  const updateMarkerVisibility = () => {
    if (!mapInstance.current || projectionStyle !== 'globe') return;
    const center = mapInstance.current.getCenter();
    markerObjs.current.forEach(({ mem, marker }) => {
      const { coordinate: { lat, lng } } = mem;
      if (isVisibleOnGlobe(center, { lat, lng })) {
        marker.getElement().style.display = '';
      } else {
        marker.getElement().style.display = 'none';
      }
    });
  };

  const updateMapMarkers = () => {
    if (!mapInstance.current) return;
    
    // Clear existing markers
    markerObjs.current.forEach(({ marker }) => marker.remove());
    markerObjs.current = [];

    // Add new markers
    memories.forEach(mem => {
      const { coordinate: { lng, lat } } = mem;
      const marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapInstance.current);
      
      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        handleMemoryClick(mem);
      });

      markerObjs.current.push({ mem, marker });
    });

    updateMarkerVisibility();
  };

  const handleMemoryClick = (memory) => {
    setSelectedMemoryId(memory.id);
    setNewMemory({ 
      ...memory,
      id: memory.id
    });
    setFormPosition({
      lat: memory.coordinate.lat,
      lng: memory.coordinate.lng
    });
    setShowForm(true);
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        previousViewRef.current = {
          center: [longitude, latitude],
          zoom: 4
        };
        
        mapInstance.current?.flyTo({
          center: [longitude, latitude],
          zoom: 4,
          essential: true
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLocating(false);
        alert("Could not determine your location");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setNewMemory(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
  };

  const handleVoiceMemo = (blob) => {
    setNewMemory(prev => ({
      ...prev,
      voiceMemo: blob
    }));
  };

  const handleSave = () => {
    if (!newMemory.title.trim()) {
      alert("Please enter a title");
      return;
    }

    const memoryToSave = {
      ...newMemory,
      coordinate: {
        lat: formPosition.lat,
        lng: formPosition.lng
      }
    };

    if (selectedMemoryId) {
      setMemories(memories.map(mem => 
        mem.id === selectedMemoryId ? memoryToSave : mem
      ));
    } else {
      setMemories([...memories, { ...memoryToSave, id: Date.now() }]);
    }

    setShowForm(false);
    tempMarkerRef.current?.remove();
    tempMarkerRef.current = null;
    setSelectedMemoryId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    tempMarkerRef.current?.remove();
    tempMarkerRef.current = null;
    setSelectedMemoryId(null);
    mapInstance.current?.flyTo({
      center: previousViewRef.current.center,
      zoom: previousViewRef.current.zoom,
      essential: true
    });
  };

  const toggleProjection = () => {
    setProjectionStyle(prev => prev === 'globe' ? 'mercator' : 'globe');
  };

  const pixelateMap = () => {
    if (!mapInstance.current || !pixelCanvasRef.current) {
      rafRef.current = requestAnimationFrame(pixelateMap);
      return;
    }
    
    const mapCanvas = mapInstance.current.getCanvas();
    const pixelCanvas = pixelCanvasRef.current;
    const currentZoom = mapInstance.current.getZoom();
    
    const minScale = 0.1;
    const maxScale = 1;
    const zoomMin = 1;
    const zoomMax = 20;
    
    let t = (currentZoom - zoomMin) / (zoomMax - zoomMin);
    t = Math.max(0, Math.min(1, t));
    const scale = minScale + t * (maxScale - minScale);

    if (pixelCanvas.width !== mapCanvas.width || pixelCanvas.height !== mapCanvas.height) {
      pixelCanvas.width = mapCanvas.width;
      pixelCanvas.height = mapCanvas.height;
    }
    
    const ctx = pixelCanvas.getContext('2d');
    const sw = Math.max(1, Math.floor(mapCanvas.width * scale));
    const sh = Math.max(1, Math.floor(mapCanvas.height * scale));
    
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = sw;
    tmpCanvas.height = sh;
    const tmpCtx = tmpCanvas.getContext('2d');
    
    tmpCtx.drawImage(mapCanvas, 0, 0, mapCanvas.width, mapCanvas.height, 0, 0, sw, sh);
    
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
    ctx.drawImage(tmpCanvas, 0, 0, sw, sh, 0, 0, pixelCanvas.width, pixelCanvas.height);
    
    rafRef.current = requestAnimationFrame(pixelateMap);
  };

  // Initialize map
  useEffect(() => {
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/eborweed/cmdtnwc8b007x01srgmfwar2m',
      center: previousViewRef.current.center,
      zoom: previousViewRef.current.zoom,
      projection: projectionStyle,
      renderWorldCopies: false,
      antialias: true,
    });

    mapInstance.current.on('load', () => {
      if (projectionStyle === 'globe') {
        mapInstance.current.setFog({});
      }

      locateUser();
      updateMapMarkers();

      mapInstance.current.on('click', (e) => {
        if (!permission || 
            e.originalEvent.target.closest('.mapboxgl-marker') || 
            e.originalEvent.target.closest('.mapboxgl-popup')) {
          return;
        }
        
        const { lng, lat } = e.lngLat;
        previousViewRef.current = {
          center: mapInstance.current.getCenter(),
          zoom: mapInstance.current.getZoom()
        };
        
        tempMarkerRef.current?.remove();
        
        mapInstance.current.flyTo({
          center: [lng, lat],
          zoom: 11,
          essential: true
        });
        
        const el = document.createElement('div');
        el.className = 'Marker';
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
        setSelectedMemoryId(null);
        setNewMemory({
          title: '',
          journal: '',
          files: [],
          voiceMemo: null,
          country: '',
          tag: '',
          coordinate: { lat, lng },
          date: new Date().toISOString().split('T')[0]
        });
      });

      if (projectionStyle === 'globe') {
        mapInstance.current.on('move', updateMarkerVisibility);
        mapInstance.current.on('rotate', updateMarkerVisibility);
        mapInstance.current.on('pitch', updateMarkerVisibility);
      }
      mapInstance.current.on('zoom', updateMarkerVisibility);

      rafRef.current = requestAnimationFrame(pixelateMap);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      mapInstance.current?.remove();
    };
  }, [projectionStyle, permission]);

  return (
    <div className="memory-map-container">
      {/* Header */}
      <Header 
        onToggleTimeline={() => setShowTimeline(!showTimeline)}
        showTimeline={showTimeline}
      />

      {/* Back Button */}
      {!permission && (
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      )}

      {/* Loading overlay */}
      {isLocating && (
        <div className="loading-overlay">
          <div className="loading-content">
            Locating you...
          </div>
        </div>
      )}

      {/* Pixelated map layer */}
      <canvas
        ref={pixelCanvasRef}
        className="pixel-canvas"
      />

      {/* Main map container */}
      <div
        ref={mapContainer}
        className="map-container"
      />

      {/* Control buttons */}
      <button
        className="locate-button"
        onClick={locateUser}
      >
        Locate Me
      </button>

      <button
        className="projection-toggle"
        onClick={toggleProjection}
      >
        Switch to {projectionStyle === 'globe' ? '2D' : '3D'} View
      </button>

      {/* Memory Form */}
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

     {/* Timeline - Updated positioning */}
      {showTimeline && (
        <div className="timeline-container">
          <Timeline
            memories={memories}
            onClose={() => setShowTimeline(false)}
            onMemoryClick={handleMemoryClick}
            selectedMemoryId={selectedMemoryId}
          />
        </div>
      )}
    </div>
  );
}