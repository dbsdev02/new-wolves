'use client';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import Image from 'next/image';
import type { Property } from '@/types';
import { formatPrice, getMediaUrl } from '@/lib/utils';

const markerIcon = L.divIcon({
  className: 'property-map-marker',
  html: '<div style="background:#c5a059;color:#0a0a0a;padding:4px 10px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);border-radius:2px;">●</div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface PropertyMapViewProps {
  properties: Property[];
}

export function PropertyMapView({ properties }: PropertyMapViewProps) {
  const withCoords = properties.filter((p) => p.latitude != null && p.longitude != null);
  const center: [number, number] = withCoords.length
    ? [Number(withCoords[0].latitude), Number(withCoords[0].longitude)]
    : [25.2048, 55.2708]; // Dubai default

  if (withCoords.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-white border border-gray-100 text-gray-400">
        No properties with map coordinates found.
      </div>
    );
  }

  return (
    <div className="h-[600px] border border-gray-100 overflow-hidden">
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map((property) => (
          <Marker key={property.id} position={[Number(property.latitude), Number(property.longitude)]} icon={markerIcon}>
            <Popup>
              <Link href={`/properties/${property.slug}`} className="block w-48">
                <div className="relative w-full aspect-[4/3] mb-2 overflow-hidden">
                  <Image src={getMediaUrl(property.primary_image || property.featured_image)} alt={property.title} fill className="object-cover" />
                </div>
                <p className="text-xs font-semibold text-luxury-black line-clamp-2">{property.title}</p>
                <p className="text-xs text-gold font-bold mt-1">{formatPrice(property.price, property.currency)}</p>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
