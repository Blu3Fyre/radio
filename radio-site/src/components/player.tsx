import React from "react";

interface playerProps {
    title: string;
    artists: string;
    album: string;
}

const Player: React.FC<playerProps> = ({ title, album, artists }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-white">
            <h2 className="text-4xl font-semibold text-center">Now Playing</h2>
            <img className="w-64 h-64 rounded-md mb-3 mt-5" src={album} />
            <p className="text-3xl font-semibold text-center"><a>{title}</a></p>
            <p className="text-2xl text-gray-400"><a>{artists}</a></p>
        </div>
    );
};

export default Player;
