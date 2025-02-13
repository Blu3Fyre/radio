import { Buffer } from "buffer";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
    const type = req.query.type as string; // Get the requested data type from the frontend

    if (!clientId || !clientSecret || !refreshToken) {
        return res.status(500).json({ error: "Missing Spotify API credentials" });
    }

    // Get access token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken ?? "",
        }).toString(),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
        return res.status(400).json({ error: "Could not retrieve access token", details: tokenData });
    }

    const accessToken = tokenData.access_token;

    // Define possible API endpoints
    const endpoints: Record<string, string> = {
        tracks: "https://api.spotify.com/v1/me/top/tracks?limit=10",
        artists: "https://api.spotify.com/v1/me/top/artists?limit=10",
        favs: "https://api.spotify.com/v1/me/top/tracks?limit=10",
        nowPlaying: "https://api.spotify.com/v1/me/player/currently-playing",
    };

    if (!endpoints[type]) {
        return res.status(400).json({ error: "Invalid request type" });
    }

    // Fetch the requested data
    const response = await fetch(endpoints[type], {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();

    // Ensure consistent response shape
    if (type === "nowPlaying") {
        return res.status(200).json({
            nowPlaying: data?.item
                ? {
                    name: data.item.name,
                    artist: data.item.artists?.[0]?.name ?? "Unknown Artist",
                    albumCover: data.item.album?.images?.[0]?.url ?? "/placeholder.jpg",
                }
                : null, // Ensure `nowPlaying` exists but is null if no song is playing
        });
    }

    if (type === "tracks" || type === "artists") {
        return res.status(200).json({
            [type]: data?.items ?? [], // Always return an array for tracks/artists
        });
    }

    return res.status(200).json({ [type]: data });
}
