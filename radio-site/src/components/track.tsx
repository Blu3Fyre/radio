import React from "react";

interface trackProps {
    title: string;
    album: string;
    artists: string;
}

const Track: React.FC<trackProps> = ({ title, album, artists }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-white">
            <img className="w-32 h-32 rounded-md mb-3" src={album} />
            <h2 className="text-lg font-semibold text-center">{title}</h2>
            <p className="text-sm text-gray-400">By {artists}</p>
        </div>
    );
};

export default Track;
