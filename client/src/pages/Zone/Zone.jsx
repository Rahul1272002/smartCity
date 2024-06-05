import React from 'react';
import ZoneCard from '../../components/Card/ZoneCard';
import data from "../../assets/dummyData.json";

const Zone = () => {
    return (
        <div>
            <div className="flex items-center justify-center mt-10 flex-col">
                <h1 className="text-3xl font-bold mb-10">Zones</h1>
                {data.map((zone, index) => (
                    <ZoneCard key={index} zone={zone} />
                ))}
            </div>
        </div>
    );
};

export default Zone;
