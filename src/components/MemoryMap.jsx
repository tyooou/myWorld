import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MemoryMap.css';

import SavedDetails from './memory/SavedDetails.jsx';
import NewMemoryForm from './memory/NewMemoryForm.jsx';


mapboxgl.accessToken = 'pk.eyJ1IjoiZWJvcndlZWQiLCJhIjoiY21kdG1mcjNkMHBneTJsb24zZzdsZHQycyJ9.B6OMNYu8tzRTiYXh5xLOpQ';

export default function MemoryMap({ name, permission, onBack }) {
  const mapContainer = useRef(null);
  const pixelCanvasRef = useRef(null);
  const mapInstance = useRef(null);
  const rafRef = useRef(null);
  const [memories, setMemories] = useState(name?.memories || []);
  const [isSwitchingUser, setIsSwitchingUser] = useState(false);



useEffect(() => {
  setIsSwitchingUser(true);
  setMemories(name?.memories || []);
  setTimeout(() => setIsSwitchingUser(false), 300); // Small delay to show transition
}, [name]);

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
  
  const [showPinDetail, setShowPinDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formPosition, setFormPosition] = useState({ lat: 0, lng: 0 });
  const [newMemory, setNewMemory] = useState({
    title: '',
    journal: '',
    files: [],
    voiceMemo: null,
    country: '',
    tag: '',
    coordinate: { lat: null, lng: null },
  });
  const previousViewRef = useRef({ center: [0, 20], zoom: 4 });
  const markerObjs = useRef([]);
  const tempMarkerRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);

  // Degrees to radians
  const toRad = deg => (deg * Math.PI) / 180;

  // Check if a point is visible on globe hemisphere
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
    if (!mapInstance.current) return;
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
  
    // Remove existing markers
    markerObjs.current.forEach(({ marker }) => marker.remove());
    markerObjs.current = [];
  
    // Add new ones
    memories.forEach(mem => {
      const { coordinate: { lng, lat } } = mem;
      const marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapInstance.current);
  
      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        setNewMemory({
          title: mem.title,
          journal: mem.journal || '',
          files: mem.files,
          voiceMemo: mem.voiceMemo,
          country: mem.country,
          tag: mem.tag,
          coordinate: { lat, lng }
        });
        setFormPosition({ lat, lng });
        setShowPinDetail(true);
      });
  
      markerObjs.current.push({ mem, marker });
    });
  
    updateMarkerVisibility();
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

        if (mapInstance.current) {
          mapInstance.current.flyTo({
            center: [longitude, latitude],
            zoom: 4,
            essential: true
          });
        }
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
      title: newMemory.title,
      journal: newMemory.journal,
      files: newMemory.files,
      voiceMemo: newMemory.voiceMemo,
      country: newMemory.country,
      tag: newMemory.tag,
      coordinate: newMemory.coordinate
    };

    setMemories([...memories, memoryToAdd]);
    //use local storage here to store it
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
    mapInstance.current.flyTo({
      center: previousViewRef.current.center,
      zoom: previousViewRef.current.zoom,
      essential: true
    });
  };

  useEffect(() => {
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/eborweed/cmdtnwc8b007x01srgmfwar2m',
      center: previousViewRef.current.center,
      zoom: previousViewRef.current.zoom,
      projection: 'globe',
      antialias: true,
    });

    mapInstance.current.on('load', () => {
      locateUser();
      updateMapMarkers();

      mapInstance.current.on('click', (e) => {
        if (
          !permission ||  // <-- here: if no permission, block adding new pins
          e.originalEvent.target.closest('.mapboxgl-marker') ||
          e.originalEvent.target.closest('.mapboxgl-popup')
        ) {
          return;
        }

        const { lng, lat } = e.lngLat;

        previousViewRef.current = {
          center: mapInstance.current.getCenter(),
          zoom: mapInstance.current.getZoom()
        };

        if (tempMarkerRef.current) {
          tempMarkerRef.current.remove();
        }

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
        setNewMemory({
          title: '',
          journal: '',
          files: [],
          voiceMemo: null,
          country: '',
          tag: '',
          coordinate: { lat, lng }
        });
      });

      ['move', 'rotate', 'pitch', 'zoom'].forEach(eventName => {
        mapInstance.current.on(eventName, updateMarkerVisibility);
      });

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

      rafRef.current = requestAnimationFrame(pixelateMap);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [permission,name]);

  useEffect(() => {
    if (mapInstance.current && mapInstance.current.isStyleLoaded()) {
      updateMapMarkers();
    }
  }, [memories]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Back Button */}
      {!permission && (
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 20,
          padding: '8px 12px',
          backgroundColor: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '0 0 5px rgba(0,0,0,0.2)'
        }}
      >
        Back
      </button>
    )}


      {/* Loading overlay */}
      {isLocating && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 10
        }}>
          <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
            Locating you...
          </div>
        </div>
      )}

      {/* Pixelated map layer */}
      <canvas
        ref={pixelCanvasRef}
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Main map container */}
      <div
        ref={mapContainer}
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 2,
          background: 'transparent !important'
        }}
      />

      {/* Locate me button */}
      <button
        onClick={locateUser}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 3,
          padding: '10px',
          background: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)'
        }}
      >
        Locate Me
      </button>

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

      {showPinDetail && (
        <SavedDetails
          memory={newMemory}
          perms={permission}
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
