'use client';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import L from 'leaflet';

const markerIcon = L.divIcon({
  className: 'property-map-marker',
  html: '<div style="background:#E1B77E;color:#000219;padding:4px 10px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);border-radius:2px;">●</div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface Props {
  latitude: number;
  longitude: number;
}

export function SinglePropertyMap({ latitude, longitude }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Guards against React Strict Mode's dev-only double-invoke, which
    // otherwise triggers Leaflet's "Map container is already initialized".
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([latitude, longitude], 15);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([latitude, longitude], { icon: markerIcon }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude]);

  return <div ref={containerRef} className="h-[420px] border border-border overflow-hidden" />;
}
