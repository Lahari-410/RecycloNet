import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position}></Marker> : null;
};

const MapPicker = ({ value, onChange }) => {
  const [position, setPosition] = useState(value || null);

  useEffect(() => {
    if (position) onChange(position);
  }, [position]);

  return (
    <MapContainer
      center={position || [20.5937, 78.9629]}
      zoom={5}
      style={{ height: '300px', width: '100%', marginBottom: '1rem' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <LocationMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
};

export default MapPicker;
