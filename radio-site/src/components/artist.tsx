import React from "react";

interface artistProps {
    artist: string;
    profile: string | undefined;
}

const Artist: React.FC<artistProps> = ({ artist, profile }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-white">
            <img className="w-32 h-32 rounded-md mb-3" src={profile} />
            <h2 className="text-lg font-semibold text-center">{artist}</h2>
        </div>
    );
};

export default Artist;
