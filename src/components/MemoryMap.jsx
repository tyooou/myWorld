import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MemoryMap.css";
import NewMemoryForm from "./memory/NewMemoryForm.jsx";
import SystemButton from "./system/SystemButton.jsx";
import Timeline from "./Timeline/Timeline.jsx"; // Make sure to import the Timeline component
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { jamals_data, daves_data, diddyani_data } from "../Data/UserData.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZWJvcndlZWQiLCJhIjoiY21kdG1mcjNkMHBneTJsb24zZzdsZHQycyJ9.B6OMNYu8tzRTiYXh5xLOpQ";

function MemoryMap({ name, permission, onBack }) {
  // Refs
  const mapContainer = useRef(null);
  const pixelCanvasRef = useRef(null);
  const mapInstance = useRef(null);
  const rafRef = useRef(null);

  // Timeline-related state
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedMemoryId, setSelectedMemoryId] = useState(null);
  const [projectionStyle, setProjectionStyle] = useState("globe");

  const username = name.profile.username;

  console.log("Current username:", username);

  // Helper function to get user data structure
  const getUserDataStructure = () => {
    const storageKey = `userData_${username}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error("Error parsing localStorage for", username, err);
    }

    // Return default structure if nothing exists
    return {
      profile: name.profile,
      memories: [],
    };
  };

  // Helper function to save user data
  const saveUserData = (userData) => {
    const storageKey = `userData_${username}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(userData));
      console.log("Saved to localStorage:", storageKey, userData);
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  };

  // Initialize memories from localStorage
  const [memories, setMemories] = useState(() => {
    const userData = getUserDataStructure();
    console.log("Initial memories loaded:", userData.memories);
    return userData.memories || [];
  });

  const [isSwitchingUser, setIsSwitchingUser] = useState(false);

  // assign each username a unique color
  const userColorMap = {
    wander_joe: "#E74C3C",
    dave_explorer: "#FF69B4",
    mclovin: "#3498DB",
    sesalover123: "#F1C40F",
    ibrahimovic: "#9B59B6",
    rocketleaguer55: "#1ABC9C",
  };

  useEffect(() => {
    setIsSwitchingUser(true);
    setMemories(name?.memories || []);
    setTimeout(() => setIsSwitchingUser(false), 300); // Small delay to show transition
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

  const [showForm, setShowForm] = useState(false);
  const [formPosition, setFormPosition] = useState({ lat: 0, lng: 0 });
  const [newMemory, setNewMemory] = useState({
    title: "",
    journal: "",
    files: [],
    voiceMemo: null,
    country: "",
    tag: "",
    coordinate: { lat: null, lng: null },
    date: new Date().toISOString().split("T")[0], // Added date field
  });
  const previousViewRef = useRef({ center: [0, 20], zoom: 4 });
  const markerObjs = useRef([]);
  const tempMarkerRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);

  // Timeline toggle function
  const toggleTimeline = () => {
    setShowTimeline(!showTimeline);
  };

  // Handle memory click from timeline
  const handleMemoryClick = (memory) => {
    setSelectedMemoryId(memory.id);
    setNewMemory({
      ...memory,
      id: memory.id,
    });
    setFormPosition({
      lat: memory.coordinate.lat,
      lng: memory.coordinate.lng,
    });
    setShowForm(true);

    // Fly to the memory location
    if (mapInstance.current) {
      mapInstance.current.flyTo({
        center: [memory.coordinate.lng, memory.coordinate.lat],
        zoom: 11,
        essential: true,
      });
    }
  };

  // Degrees to radians
  const toRad = (deg) => (deg * Math.PI) / 180;

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

  // Create pixelated pin element with color
  const createCustomPin = (color) => {
    // Create a darker shade of the color for the border
    const darkerColor = color.replace('#', '');
    const r = parseInt(darkerColor.substr(0,2), 16);
    const g = parseInt(darkerColor.substr(2,2), 16);
    const b = parseInt(darkerColor.substr(4,2), 16);
    const darkerR = Math.max(0, Math.floor(r * 0.4));
    const darkerG = Math.max(0, Math.floor(g * 0.4));
    const darkerB = Math.max(0, Math.floor(b * 0.4));
    const borderColor = `#${darkerR.toString(16).padStart(2,'0')}${darkerG.toString(16).padStart(2,'0')}${darkerB.toString(16).padStart(2,'0')}`;
    
    // Create lighter shade for highlights
    const lighterR = Math.min(255, Math.floor(r + (255 - r) * 0.4));
    const lighterG = Math.min(255, Math.floor(g + (255 - g) * 0.4));
    const lighterB = Math.min(255, Math.floor(b + (255 - b) * 0.4));
    const lightColor = `#${lighterR.toString(16).padStart(2,'0')}${lighterG.toString(16).padStart(2,'0')}${lighterB.toString(16).padStart(2,'0')}`;
    
    const el = document.createElement("div");
    el.className = "custom-pin";
    el.style.width = "20px";
    el.style.height = "28px";
    el.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(`
      <svg width="20" height="28" viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg">
        <!-- Exact recreation of the reference pushpin image -->
        
        <!-- Row 1 -->
        <rect x="6" y="0" width="2" height="2" fill="${borderColor}"/>
        <rect x="8" y="0" width="4" height="2" fill="${borderColor}"/>
        <rect x="12" y="0" width="2" height="2" fill="${borderColor}"/>
        
        <!-- Row 2 -->
        <rect x="4" y="2" width="2" height="2" fill="${borderColor}"/>
        <rect x="6" y="2" width="2" height="2" fill="${lightColor}"/>
        <rect x="8" y="2" width="4" height="2" fill="${color}"/>
        <rect x="12" y="2" width="2" height="2" fill="${color}"/>
        <rect x="14" y="2" width="2" height="2" fill="${borderColor}"/>
        
        <!-- Row 3 -->
        <rect x="2" y="4" width="2" height="2" fill="${borderColor}"/>
        <rect x="4" y="4" width="2" height="2" fill="${lightColor}"/>
        <rect x="6" y="4" width="2" height="2" fill="${lightColor}"/>
        <rect x="8" y="4" width="4" height="2" fill="${color}"/>
        <rect x="12" y="4" width="2" height="2" fill="${color}"/>
        <rect x="14" y="4" width="2" height="2" fill="${borderColor}"/>
        <rect x="16" y="4" width="2" height="2" fill="${borderColor}"/>
        
        <!-- Row 4 -->
        <rect x="2" y="6" width="2" height="2" fill="${borderColor}"/>
        <rect x="4" y="6" width="2" height="2" fill="${lightColor}"/>
        <rect x="6" y="6" width="2" height="2" fill="${lightColor}"/>
        <rect x="8" y="6" width="4" height="2" fill="${color}"/>
        <rect x="12" y="6" width="2" height="2" fill="${color}"/>
        <rect x="14" y="6" width="2" height="2" fill="${borderColor}"/>
        <rect x="16" y="6" width="2" height="2" fill="${borderColor}"/>
        
        <!-- Row 5 -->
        <rect x="2" y="8" width="2" height="2" fill="${borderColor}"/>
        <rect x="4" y="8" width="2" height="2" fill="${color}"/>
        <rect x="6" y="8" width="2" height="2" fill="${color}"/>
        <rect x="8" y="8" width="4" height="2" fill="${color}"/>
        <rect x="12" y="8" width="2" height="2" fill="${borderColor}"/>
        <rect x="14" y="8" width="2" height="2" fill="${borderColor}"/>
        <rect x="16" y="8" width="2" height="2" fill="${borderColor}"/>
        
        <!-- Row 6 (body start) -->
        <rect x="4" y="10" width="2" height="2" fill="${borderColor}"/>
        <rect x="6" y="10" width="2" height="2" fill="${color}"/>
        <rect x="8" y="10" width="4" height="2" fill="${color}"/>
        <rect x="12" y="10" width="2" height="2" fill="${borderColor}"/>
        <rect x="14" y="10" width="2" height="2" fill="${borderColor}"/>
        
        <!-- Row 7 -->
        <rect x="4" y="12" width="2" height="2" fill="${borderColor}"/>
        <rect x="6" y="12" width="2" height="2" fill="${borderColor}"/>
        <rect x="8" y="12" width="2" height="2" fill="${color}"/>
        <rect x="10" y="12" width="2" height="2" fill="${borderColor}"/>
        <rect x="12" y="12" width="2" height="2" fill="${borderColor}"/>
        
        <!-- Row 8 (narrow part) -->
        <rect x="6" y="14" width="2" height="2" fill="${borderColor}"/>
        <rect x="8" y="14" width="2" height="2" fill="${borderColor}"/>
        <rect x="10" y="14" width="2" height="2" fill="${borderColor}"/>
        
        <!-- Needle part -->
        <rect x="8" y="16" width="2" height="2" fill="#C0C0C0"/>
        <rect x="8" y="18" width="2" height="2" fill="#A0A0A0"/>
        <rect x="8" y="20" width="2" height="2" fill="#808080"/>
        <rect x="8" y="22" width="2" height="2" fill="#606060"/>
        <rect x="8" y="24" width="2" height="2" fill="#404040"/>
        <rect x="8" y="26" width="2" height="2" fill="#202020"/>
      </svg>
    `)}")`;
    el.style.backgroundSize = "contain";
    el.style.backgroundRepeat = "no-repeat";
    el.style.cursor = "pointer";
    el.style.imageRendering = "pixelated";
    el.style.imageRendering = "-moz-crisp-edges";
    el.style.imageRendering = "crisp-edges";
    return el;
  };

  const updateMarkerVisibility = () => {
    if (!mapInstance.current || projectionStyle !== "globe") return;
    const center = mapInstance.current.getCenter();
    markerObjs.current.forEach(({ mem, marker }) => {
      const {
        coordinate: { lat, lng },
      } = mem;
      if (isVisibleOnGlobe(center, { lat, lng })) {
        marker.getElement().style.display = "";
      } else {
        marker.getElement().style.display = "none";
      }
    });
  };

  const updateMapMarkers = () => {
    if (!mapInstance.current) return;

    // Remove existing markers
    markerObjs.current.forEach(({ marker }) => marker.remove());
    markerObjs.current = [];

    // Add new ones
    memories.forEach((mem) => {
      const {
        coordinate: { lng, lat },
      } = mem;
      // determine which user this memory belongs to
      const who = mem.friend || name.profile.username;
      const color = userColorMap[who] || "#000000";

      // create a custom pin marker
      const pinElement = createCustomPin(color);
      const marker = new mapboxgl.Marker(pinElement)
        .setLngLat([lng, lat])
        .addTo(mapInstance.current);

      marker.getElement().addEventListener("click", (e) => {
        e.stopPropagation();
        handleMemoryClick(mem); // Use the same handler as timeline
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
          zoom: 4,
        };

        if (mapInstance.current) {
          mapInstance.current.flyTo({
            center: [longitude, latitude],
            zoom: 4,
            essential: true,
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
        maximumAge: 0,
      }
    );
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setNewMemory((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));
  };

  const handleVoiceMemo = (blob) => {
    setNewMemory((prev) => ({
      ...prev,
      voiceMemo: blob,
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
        lng: formPosition.lng,
      },
    };

    let updatedMemories;
    if (selectedMemoryId) {
      // Update existing memory
      updatedMemories = memories.map((mem) =>
        mem.id === selectedMemoryId ? memoryToSave : mem
      );
    } else {
      // Add new memory
      updatedMemories = [
        ...memories,
        {
          ...memoryToSave,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        },
      ];
    }

    // Update state
    setMemories(updatedMemories);

    // Get current user data and update it
    const currentUserData = getUserDataStructure();
    const updatedUserData = {
      ...currentUserData,
      memories: updatedMemories,
    };

    // Save to localStorage
    saveUserData(updatedUserData);

    console.log("Memory saved for user:", username);
    console.log("Updated memories:", updatedMemories);

    setShowForm(false);
    if (tempMarkerRef.current) {
      tempMarkerRef.current.remove();
      tempMarkerRef.current = null;
    }
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
      essential: true,
    });
  };

  const toggleProjection = () => {
    setProjectionStyle((prev) => (prev === "globe" ? "mercator" : "globe"));
    if (mapInstance.current) {
      mapInstance.current.setProjection(
        projectionStyle === "globe" ? "mercator" : "globe"
      );
    }
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

    if (
      pixelCanvas.width !== mapCanvas.width ||
      pixelCanvas.height !== mapCanvas.height
    ) {
      pixelCanvas.width = mapCanvas.width;
      pixelCanvas.height = mapCanvas.height;
    }

    const ctx = pixelCanvas.getContext("2d");
    const sw = Math.max(1, Math.floor(mapCanvas.width * scale));
    const sh = Math.max(1, Math.floor(mapCanvas.height * scale));

    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = sw;
    tmpCanvas.height = sh;
    const tmpCtx = tmpCanvas.getContext("2d");

    tmpCtx.drawImage(
      mapCanvas,
      0,
      0,
      mapCanvas.width,
      mapCanvas.height,
      0,
      0,
      sw,
      sh
    );

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
    ctx.drawImage(
      tmpCanvas,
      0,
      0,
      sw,
      sh,
      0,
      0,
      pixelCanvas.width,
      pixelCanvas.height
    );

    rafRef.current = requestAnimationFrame(pixelateMap);
  };

  useEffect(() => {
    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/eborweed/cmdtnwc8b007x01srgmfwar2m",
      center: previousViewRef.current.center,
      zoom: previousViewRef.current.zoom,
      projection: projectionStyle,
      antialias: true,
    });

    mapInstance.current.on("load", () => {
      locateUser();
      updateMapMarkers();

      mapInstance.current.on("click", (e) => {
        if (
          !permission ||
          e.originalEvent.target.closest(".mapboxgl-marker") ||
          e.originalEvent.target.closest(".mapboxgl-popup")
        ) {
          return;
        }

        const { lng, lat } = e.lngLat;

        previousViewRef.current = {
          center: mapInstance.current.getCenter(),
          zoom: mapInstance.current.getZoom(),
        };

        if (tempMarkerRef.current) {
          tempMarkerRef.current.remove();
        }

        mapInstance.current.flyTo({
          center: [lng, lat],
          zoom: 11,
          essential: true,
        });

        const el = createCustomPin("#4A90E2"); // Blue color for new memory
        el.style.opacity = "0.8"; // Make it slightly transparent to indicate it's temporary

        tempMarkerRef.current = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup().setHTML("New memory location (unsaved)")
          )
          .addTo(mapInstance.current)
          .togglePopup();

        setFormPosition({ lat, lng });
        setShowForm(true);
        setSelectedMemoryId(null);
        setNewMemory({
          title: "",
          journal: "",
          files: [],
          voiceMemo: null,
          country: "",
          tag: "",
          coordinate: { lat, lng },
          date: new Date().toISOString().split("T")[0],
        });
      });

      // Sync visibility when the globe moves/rotates/etc.
      mapInstance.current.on("move", updateMarkerVisibility);
      mapInstance.current.on("rotate", updateMarkerVisibility);
      mapInstance.current.on("pitch", updateMarkerVisibility);
      mapInstance.current.on("zoom", updateMarkerVisibility);

      rafRef.current = requestAnimationFrame(pixelateMap);
    });
    // Add geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: "Search places",
      flyTo: {
        bearing: 0,
        speed: 1,
        curve: 1,
        zoom: 11,
        easing: (t) => t,
      },
    });
    const geocoderContainer = document.getElementById("geocoder-container");
    if (geocoderContainer) {
      geocoderContainer.innerHTML = ""; // Clear any previous geocoder
      geocoderContainer.appendChild(geocoder.onAdd(mapInstance.current));
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      mapInstance.current?.remove();
    };
  }, [permission, username, projectionStyle]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Timeline Toggle Button - Below Header */}
      <div className="absolute top-14 right-2 z-[1000] font-[pixel] text-[10px]">
        <SystemButton
          text={showTimeline ? "Hide Timeline" : "Show Timeline"}
          onClick={toggleTimeline}
        />
      </div>
      <div
        id="geocoder-container"
        className="absolute bottom-12 left-4 z-[1000] w-[250px] text-gray-800 rounded-none"
      ></div>

      {/* Back Button */}
      {!permission && (
        <div className="z-20 absolute top-24 right-2 font-[pixel] text-[9px]">
          <SystemButton text="Back" onClick={onBack} />
        </div>
      )}

      {/* Loading overlay */}
      {isLocating && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ color: "white", fontSize: "20px" }}>
            Locating you...
          </div>
        </div>
      )}

      {/* Pixelated map layer */}
      <canvas
        ref={pixelCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Main map container */}
      <div
        ref={mapContainer}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          background: "transparent !important",
        }}
      />

      {/* Control Buttons Bottom Right */}
      <div className="absolute bottom-10 right-2 z-[1000] font-[pixel] text-[10px] flex flex-col space-y-2">
        <SystemButton text="Locate Me" onClick={locateUser} />
        <SystemButton
          text={`Switch to ${projectionStyle === "globe" ? "2D" : "3D"} View`}
          onClick={toggleProjection}
        />
      </div>

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

      {/* Timeline */}
      {showTimeline && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10000,
            height: "40vh",
            backgroundColor: "white",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Timeline
            memories={memories}
            onClose={toggleTimeline}
            onMemoryClick={handleMemoryClick}
            selectedMemoryId={selectedMemoryId}
          />
        </div>
      )}
    </div>
  );
}

export default MemoryMap;
