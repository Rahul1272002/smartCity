import React, { useState, useEffect } from "react";
import axios from "axios";

const Card = ({ title, description, imageSrc, lat, lng }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const parsedDescription = JSON.parse(description);



  

  const descriptionItems = Object.entries(parsedDescription).map(([key, value]) => (
    <li key={key}>
      <strong>{key}:</strong> {value}
    </li>
  ));

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-md overflow-hidden shadow-md m-4">
      <img
        className="w-full h-48 object-cover cursor-pointer"
        src={imageSrc}
        alt={title}
        onClick={openPopup}
      />

      {isPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75">
          <div className="max-w-screen-xl mx-auto bg-white rounded-md overflow-hidden shadow-md">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={closePopup}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              className="w-full h-full object-cover"
              src={imageSrc}
              alt={title}
            />
          </div>
        </div>
      )}

      <div className="p-4">
        <h2 className="text-xl mb-2">
          <span className="font-semibold">Area: </span>
          {title}
        </h2>
        <ul className="text-gray-600">{descriptionItems}</ul>
     
      </div>
      <div className="p-4">
        <span className=""> <strong>Latitude: </strong> {lat.toFixed(6)}</span>
        {/* <ul className="text-gray-600"></ul> */}
        <br />
        <span className=""> <strong> Longitude: </strong>{lng.toFixed(6)}</span>
        {/* <ul className="text-gray-600"></ul> */}
      </div>
    </div>
  );
};

export default Card;
