import React, { useState } from 'react';
import styles from './ZoneCard.module.css';

const ZoneCard = ({zone}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showImagePopup, setShowImagePopup] = useState(false);

    const toggleImagePopup = () => {
        setShowImagePopup(!showImagePopup);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? zone.detections.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === zone.detections.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div>
            <div className={styles.main_content}>
                <div className="location">
                    <div className={styles.title}>Location</div>
                    <div className="lat"> <strong>Latitude</strong> {zone.lat}</div>
                    <div className="lng"> <strong>Longitude</strong> {zone.lng}</div>
                </div>

                <div className="area">
                    <div className={styles.title}>Area Name</div>
                    <div className="area">{zone.area}</div>
                </div>

                <div className="detections">
                    <div className={styles.title}>Visual Pollutions</div>
                    {zone.totalDetections}
                </div>

                <button className={styles.button} onClick={toggleImagePopup}>View Image</button>
            </div>

            {showImagePopup && (
                <div className={styles.backdrop} onClick={toggleImagePopup}>
                    <div className={styles.imagePopup} onClick={(e) => e.stopPropagation()}>
                        <div className="detected">
                            <div className={styles.title}>Detected visual pollution in this image</div>
                            {Object.entries(zone.detections[currentImageIndex].detected).map(([key, value]) => (
                                <div key={key}>
                                    {key}: {value}
                                </div>
                            ))}
                        </div>
                        <img src={zone.detections[currentImageIndex].image_link} alt="image" style={{ marginTop: "15px" }}/>
                        <button className={styles.prevButton} onClick={handlePrevImage}>Previous</button>
                        <button className={styles.nextButton} onClick={handleNextImage}>Next</button>
                        <button className={styles.closeButton} onClick={toggleImagePopup}></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ZoneCard;
