import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({
    latitude: 55,
    longitude: 12,
  });

  useEffect(() => {
    // Your existing logic to fetch markers
    async function fetchMarkers() {
      try {
        const response = await axios.get(`https://api.example.com/markers?lat=${region.latitude}&lng=${region.longitude}&radius=50000&key=${API_KEY}`);
        setMarkers(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMarkers();
  }, [region]);

  return (
    <MapContainer center={[region.latitude, region.longitude]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.latitude, marker.longitude]}>
          <Popup>{marker.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapScreen;
