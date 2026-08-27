import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Incident } from '../db/schema';
import { db } from '../db/mockDb';

// Setup icon fixes for leaflet (in case default markers are used)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
  incidents?: Incident[];
  selectedCoords?: { lat: number; lng: number } | null;
  onSelectCoords?: (lat: number, lng: number) => void;
  onSelectIncident?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  incidents = [],
  selectedCoords = null,
  onSelectCoords,
  onSelectIncident,
  center = [-33.9249, 18.4241], // Default Cape Town CBD
  zoom = 13,
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const selectMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: interactive,
      dragging: interactive,
      doubleClickZoom: interactive,
      scrollWheelZoom: interactive,
    });

    // Add Tile Layer (Sleek custom tiles or standard OSM)
    // We use CartoDB Positron for a high-fidelity civic aesthetic (neutral grey map matches warm-off-white)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Click handler for coordinates selection
    if (onSelectCoords && interactive) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onSelectCoords(lat, lng);
      });
    }

    // Popup click bridge
    map.on('popupopen', (e) => {
      const popupElement = e.popup.getElement();
      if (!popupElement) return;

      const viewDetailsBtn = popupElement.querySelector('.map-view-details-btn');
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', () => {
          const id = viewDetailsBtn.getAttribute('data-id');
          if (id && onSelectIncident) {
            onSelectIncident(id);
          }
        });
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Incidents markers
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    // Clear existing incident markers
    markersLayerRef.current.clearLayers();

    incidents.forEach((inc) => {
      let pinColor = 'var(--color-gold)'; // Medium
      if (inc.status === 'Resolved' || inc.status === 'Closed') {
        pinColor = 'var(--color-green)';
      } else if (inc.severity === 'High' || inc.severity === 'Critical') {
        pinColor = 'var(--color-terracotta)';
      } else if (inc.severity === 'Low') {
        pinColor = 'var(--color-sand-dark)';
      }

      // Dynamic modern HTML pin representation
      const pinHtml = `
        <div class="map-marker-pin" style="background-color: ${pinColor}; shadow: 0 2px 4px rgba(0,0,0,0.2)">
          <div class="pin-inner"></div>
          ${inc.severity === 'High' || inc.severity === 'Critical' ? '<div class="pin-ping"></div>' : ''}
        </div>
      `;

      const customDivIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-map-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([inc.latitude, inc.longitude], { icon: customDivIcon })
        .addTo(markersLayerRef.current!);

      const reportsCount = db.getReports().filter(r => r.incident_id === inc.id).length;
      
      const popupHtml = `
        <div class="map-popup-card">
          <div class="popup-header">
            <span class="popup-id">${inc.id}</span>
            <span class="popup-status status-${inc.status.toLowerCase().replace(' ', '-')}">${inc.status}</span>
          </div>
          <h4 class="popup-title">${inc.title}</h4>
          <p class="popup-meta">📍 ${inc.address.split(',')[0]} • <b>${inc.category}</b></p>
          <div class="popup-stats">
            <span>Severity: <b>${inc.severity}</b></span>
            <span>Reports: <b>${reportsCount}</b></span>
          </div>
          ${onSelectIncident ? `<button class="map-view-details-btn btn btn-primary btn-sm" data-id="${inc.id}">View Incident Tracker</button>` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 260,
        className: 'custom-leaflet-popup',
      });
    });
  }, [incidents]);

  // Update Pin-drop marker (for reporting form)
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing selection marker
    if (selectMarkerRef.current) {
      mapRef.current.removeLayer(selectMarkerRef.current);
      selectMarkerRef.current = null;
    }

    if (selectedCoords) {
      const pinColor = 'var(--color-charcoal)';
      const selectionPinHtml = `
        <div class="map-marker-pin selection-pin" style="background-color: ${pinColor}">
          <div class="pin-inner" style="background: var(--color-white)"></div>
          <div class="pin-ping" style="border-color: ${pinColor}"></div>
        </div>
      `;

      const customDivIcon = L.divIcon({
        html: selectionPinHtml,
        className: 'custom-map-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const newMarker = L.marker([selectedCoords.lat, selectedCoords.lng], {
        icon: customDivIcon,
        draggable: true,
      }).addTo(mapRef.current);

      if (onSelectCoords) {
        newMarker.on('dragend', () => {
          const latLng = newMarker.getLatLng();
          onSelectCoords(latLng.lat, latLng.lng);
        });
      }

      selectMarkerRef.current = newMarker;

      // Pan to selected coordinates
      mapRef.current.panTo([selectedCoords.lat, selectedCoords.lng]);
    }
  }, [selectedCoords]);

  return (
    <div 
      className="map-wrapper" 
      ref={mapContainerRef} 
      style={{ width: '100%', height: '100%', minHeight: '300px', background: '#e5e5e5', borderRadius: '6px', border: '1px solid var(--color-sand)' }} 
    />
  );
};

export default LeafletMap;
