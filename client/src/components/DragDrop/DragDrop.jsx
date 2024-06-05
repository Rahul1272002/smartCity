import React, { useState } from 'react';
import axios from 'axios';
import { Dropzone, FileMosaic } from "@dropzone-ui/react";

export default function ImageUploadForm() {
  const [files, setFiles] = useState([]);

  const updateFiles = (incomingFiles) => {
    setFiles(incomingFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    files.forEach((file) => {
      data.append('files[]', file);
    });

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        // alert('Images uploaded successfully!');
        console.log(response);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="container mx-auto p-4 ">
        <form onSubmit={handleSubmit}>
          <Dropzone onChange={updateFiles} value={files} className="border-dashed border-2 p-4 bg-slate-300">
            <div className="flex flex-wrap -m-2">
              {files.map((file, index) => (
                <FileMosaic key={index} id={index} {...file} preview className="m-2" />
              ))}
            </div>
          </Dropzone>
          <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
            Convert
          </button>
        </form>
      </div>
    </div>
  );
}
