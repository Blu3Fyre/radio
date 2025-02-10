"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface SpotifyTrack {
  id: string;
  item: {
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
  }
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
}

interface SpotifyData {
  tracks: { items: SpotifyTrack[] };
  artists: { items: SpotifyArtist[] };
  nowPlaying: SpotifyTrack | null;
  favs: { items: SpotifyTrack[] };
}

export default function Home() {
  const { data, error } = useSWR<SpotifyData>("/api/spotify", fetcher, {
    refreshInterval: 60000,
  });

  if (error) return <div>Failed to load Spotify data</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <h1>Radio</h1>

      {/* Now Playing */
        data.nowPlaying ? (
          <>
            <h2>Now Playing</h2>
            <img src={data.nowPlaying.item.album.images[0].url} />
            <p><a>{data.nowPlaying.item.name}</a> by <a>{data.nowPlaying.item.artists[0].name}</a></p>
          </>
        ) : (
          <>
            <h2>Now Playing</h2>
            <p>Nothing is playing.</p>
          </>
        )
      }

      {/* Top Songs */
        <>
          <div>
            <h2>My Top 10 Songs</h2>
            <ul>
              {data.tracks.items.map((track) => (
                <li key={track.id}>
                  <img src={track.album.images[2].url} />
                  <p>{track.name} by {track.artists.map((a) => a.name).join(" , ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      }

      {/* Top Artists */
        <>
          <div>
            <h2>My Top 10 Artists</h2>
            <ul>
              {data.artists.items.map((artist) => (
                <li key={artist.id}>
                  <img src={artist?.images?.at(-1)?.url} />
                  <p>{artist.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      }
    </>
  );
}