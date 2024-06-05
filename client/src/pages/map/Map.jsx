import React, { useState, useEffect, useRef } from 'react';
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import axios from 'axios';

const API_Key = import.meta.env.VITE_APP_TOMTOM_APIKEY;

const Map = () => {
  const [locations, setLocations] = useState([]);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Fetch locations from the backend
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/locations');
        setLocations(response.data.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (mapRef.current && locations.length > 0) {
      const center = { lat: locations[0].lat, lng: locations[0].lng }; // Center map on the first location

      const mp = tt.map({
        key: API_Key,
        container: mapRef.current,
        center: center,
        zoom: 11, // Adjust zoom level as needed
        style: {
          map: '2/basic_street-satellite',
          poi: 'poi_main',
          trafficIncidents: '2/flow_relative-light',
          trafficFlow: '2/flow_relative-light'
        }
      });
      setMap(mp);
      return () => mp.remove();
    }
  }, [locations]);

  useEffect(() => {
    if (!map || !locations.length) return;

    // Add markers for each location
    locations.forEach(location => {
      const { lat, lng, detections } = location;

      const popup = new tt.Popup()
        .setHTML(`<p>Detections: ${JSON.stringify(detections)}</p>`);

      new tt.Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);
    });

  }, [map, locations]);

  return (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default Map;
