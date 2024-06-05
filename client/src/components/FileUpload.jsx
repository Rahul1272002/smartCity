import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// Location data extraction library
import exifr from "exifr";

function FileUpload() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    const getAreaName = async (latitude, longitude) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    
        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                const areaName = response.data.display_name;
                return areaName;
            }
            return 'Area name not found';
        } catch (error) {
            console.error('Error fetching area name:', error);
            return 'Error fetching area name';
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        setSelectedFiles([...selectedFiles, ...files]);

        const imagesArray = [];
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagesArray.push(event.target.result);
                if (imagesArray.length === files.length) {
                    setPreviewImages([...previewImages, ...imagesArray]);
                }
            };
            reader.readAsDataURL(files[i]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const files = e.dataTransfer.files;
        handleFileChange({ target: { files } });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleCancel = (index) => {
        const updatedSelectedFiles = [...selectedFiles];
        updatedSelectedFiles.splice(index, 1);
        setSelectedFiles(updatedSelectedFiles);

        const updatedPreviewImages = [...previewImages];
        updatedPreviewImages.splice(index, 1);
        setPreviewImages(updatedPreviewImages);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        const latLongArr = [];

        const defaultLat = 22.512166;
        const defaultLong = 88.409281;

        for (const file of selectedFiles) {
            try {
                const exifData = await exifr.parse(file);
                const lat = exifData.latitude || defaultLat;
                const long = exifData.longitude || defaultLong;
                latLongArr.push({ lat, long });
                console.log(lat, long);
            } catch (e) {
                console.log(e);
                latLongArr.push({ lat: defaultLat, long: defaultLong });
            }
            formData.append('files[]', file);
        }

        try {
            const res = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                setSelectedFiles([]);
                setPreviewImages([]);
                alert('Files uploaded successfully');
                console.log(res.data.detected_names, res.data.download_url);

                const detected_names = res.data.detected_names;
                const download_urls = res.data.download_url;

                if (detected_names) {
                    for (let i = 0; i < detected_names.length; i++) {
                        const detectionsObj = {};
                        for (let j = 0; j < detected_names[i].length; j++) {
                            const name = detected_names[i][j];
                            detectionsObj[name] = (detectionsObj[name] || 0) + 1;
                        }

                        const latLong = latLongArr[i];
                        const areaName = await getAreaName(latLong.lat, latLong.long);
                        const data = {
                            lat: latLong.lat,
                            lng: latLong.long,
                            detections: detectionsObj,
                            area_name: areaName,
                            image_path: download_urls[i]
                        };

                        console.log(data);

                        const uploadDetails = await axios.post('http://localhost:3000/upload_image', {
                            lat: latLong.lat,
                            lng: latLong.long,
                            detections: detectionsObj,
                            area_name: areaName,
                            image_path: download_urls[i],
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (uploadDetails.status === 200) {
                            console.log(uploadDetails.data.message);
                        } else {
                            console.log("Failed to upload to MongoDB");
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Error uploading files');
        }
    };

    const handleDropboxClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
            <div className="dnd flex justify-center items-center mt-5 p-7 mb-10" style={{ display: "flex", flexDirection: "column" }}>
                <p className="mb-10 flex items-center justify-center mt-12">Drag and drop files here, or click to select files</p>
                <div
                    className={`h-auto w-auto border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${dragging ? 'bg-gray-100' : ''}`}
                    onClick={handleDropboxClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragLeave={handleDragLeave}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="flex flex-wrap justify-center">
                        {previewImages.map((preview, index) => (
                            <div key={index} className="relative m-2">
                                <img
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    className="w-32 h-32"
                                />
                                <button
                                    className="absolute w-10 h-10 top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                    onClick={() => handleCancel(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                />
                <button onClick={handleSubmit} className="mt-10 bg-blue-500 text-white px-4 py-2 rounded">
                    Upload
                </button>
            </div>
        </div>
    );
}

export default FileUpload;
