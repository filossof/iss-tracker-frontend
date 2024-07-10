import React, { useEffect, useState } from "react";
import axios from "axios";

interface UTMPosition {
  easting: number;
  northing: number;
  zoneNum: number;
  zoneLetter: string;
}

const Sidebar: React.FC = () => {
  const [location, setLocation] = useState<string>("Fetching...");
  const [time, setTime] = useState<string>("");
  const [utmPosition, setUTMPosition] = useState<UTMPosition | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get("http://localhost:3000/iss");
        setLocation(response.data.location);
        setTime(response.data.time);
      } catch (error) {
        console.error("Failed to fetch ISS location:", error);
      }
    };

    const fetchUTMPosition = async () => {
      try {
        const response = await axios.get("http://localhost:3000/utm");
        setUTMPosition(response.data);
      } catch (error) {
        console.error("Failed to fetch UTM position:", error);
      }
    };

    fetchLocation();
    fetchUTMPosition();

    const interval = setInterval(() => {
      fetchLocation();
      fetchUTMPosition();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidebar">
      <h3>Current ISS Location</h3>
      <p>{location}</p>
      <p>{time}</p>
      {utmPosition && (
        <div>
          <h4>UTM Coordinates</h4>
          <p>
            Zone: {utmPosition.zoneNum}
            {utmPosition.zoneLetter}
          </p>
          <p>Easting: {utmPosition.easting}</p>
          <p>Northing: {utmPosition.northing}</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
