"use client";

import useSWR from "swr";
import Track from "@/components/track";
import Artist from "@/components/artist";
import Player from "@/components/player";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TrackData {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: { name: string }[];
}

interface ArtistData {
  id: string;
  name: string;
  images?: { url: string }[];
}

interface NowPlayingData {
  name: string;
  artist: string;
  albumCover?: string;
}

// Define response shape
interface SpotifyResponse<T> {
  tracks?: T[];
  artists?: T[];
  nowPlaying?: T;
}

export default function Home() {
  const { data: tracks } = useSWR<SpotifyResponse<TrackData>>("/api/spotify?type=tracks", fetcher);
  const { data: artists } = useSWR<SpotifyResponse<ArtistData>>("/api/spotify?type=artists", fetcher);
  const { data: nowPlaying } = useSWR<SpotifyResponse<NowPlayingData>>("/api/spotify?type=nowPlaying", fetcher);

  return (
    <main>
      <section className="container mx-auto px-4 mt-5 text-center">

        {/* Now Playing Section */}
        {nowPlaying?.nowPlaying ? (
          <Player
            title={nowPlaying.nowPlaying.name}
            artists={nowPlaying.nowPlaying.artist}
            album={nowPlaying.nowPlaying.albumCover ?? "/placeholder.jpg"}
          />
        ) : (
          <>
            <h2 className="text-4xl font-semibold text-center text-white">Nothing is Playing</h2>
            <p className="text-lg font-semibold text-center text-white">All is quiet...</p>
          </>
        )}
      </section>

      {/* Top Songs Section */}
      <section className="container mx-auto px-4 mt-5 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">My Top 10 Songs</h2>
        {tracks?.tracks?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tracks.tracks.map((track) => (
              <Track
                key={track.id}
                title={track.name}
                album={track.album?.images?.[2]?.url ?? "/placeholder.jpg"}
                artists={track.artists.map((a) => a.name).join(", ")}
              />
            ))}
          </div>
        ) : (
          <p>Loading songs...</p>
        )}
      </section>

      {/* Top Artists Section */}
      <div className="container mx-auto px-4 mt-5 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">My Top 10 Artists</h2>
        {artists?.artists?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artists.artists.map((artist) => (
              <Artist
                key={artist.id}
                artist={artist.name}
                profile={artist?.images?.at(-1)?.url ?? "/placeholder.jpg"}
              />
            ))}
          </div>
        ) : (
          <p>Loading artists...</p>
        )}
      </div>
    </main>
  );
}
