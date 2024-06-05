import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";
import FileUpload from "./components/FileUpload";
import Zone from "./pages/Zone/Zone";
import Map from "./pages/map/Map";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import React, { useEffect, useState } from 'react';

function App() {
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:3000/images');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setImages(data.data.map((location) => location.image_path));
        setData(data.data.map((location) => ({
          lat: location.lat,
          lng: location.lng,
          detections: location.detections,
          area_name: location.area_name,
          image_path: location.image_path
        })));
        console.log(data);
      } catch (err) {
        console.error('Error fetching images:', err);
      }
    };

    fetchImages();

    return () => {
      // Cleanup function if needed
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-200">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/zone" element={<Zone />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home({ data }) {
  return (
    <div className="">
  <FileUpload />

  <div className="flex flex-wrap justify-between items-start">
    {data.map((value, index) => (
      <div key={index} className="w-1/4 mb-4">
        <Card title={value.area_name} description={JSON.stringify(value.detections)} imageSrc={value.image_path} lat={value.lat} lng={value.lng} />
      </div>
    ))}
  </div>
</div>

  );
}

export default App;
