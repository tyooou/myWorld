import { useEffect } from 'react';
import L from 'leaflet';

export default function TempMarkerHandler({
  mapRef,
  tempMarkerRef,
  setFormPosition,
  setShowForm,
  setNewMemory
}) {
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const tempIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41]
    });

    const handleClick = (e) => {
      if (tempMarkerRef.current) {
        map.removeLayer(tempMarkerRef.current);
      }
      const { lat, lng } = e.latlng;
      const marker = L.marker([lat, lng], { icon: tempIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup('New memory location (unsaved)')
        .openPopup();

      tempMarkerRef.current = marker;
      setFormPosition({ lat, lng });
      setShowForm(true);
      setNewMemory({
        title: '',
        isJournal: false,
        files: [],
        voiceMemo: null
      });
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [mapRef.current, tempMarkerRef, setFormPosition, setShowForm, setNewMemory]);

  return null;
}