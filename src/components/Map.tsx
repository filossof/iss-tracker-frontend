import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const pinpointIcon = new L.Icon({
  iconUrl: "/iss.png",
  iconSize: [90, 90],
});

const Map: React.FC = () => {
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://api.open-notify.org/iss-now.json"
        );
        const { latitude, longitude } = response.data.iss_position;
        setPosition([latitude, longitude]);
      } catch (error) {
        console.error("Failed to fetch ISS position:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={3}
      style={{ height: "100vh", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <UpdateMapCenter position={position} />
      <Marker position={position} icon={pinpointIcon}></Marker>
      <CustomZoomControl />
    </MapContainer>
  );
};

const UpdateMapCenter: React.FC<{ position: [number, number] }> = ({
  position,
}) => {
  const map = useMap();
  map.setView(position);
  return null;
};

const CustomZoomControl: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const zoomControl = L.control.zoom({ position: "bottomright" });
    map.addControl(zoomControl);
    return () => {
      map.removeControl(zoomControl);
    };
  }, [map]);

  return null;
};
export default Map;
