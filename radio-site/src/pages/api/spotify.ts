import { Buffer } from "buffer";
import { access } from "fs";

export default async function handler(req, res) {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
        return res.status(400).json({ error: "Could not retrieve access token", details: tokenData });
    }
    const accessToken = tokenData.access_token;

    const topTracksResponse = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
        headers: { "Authorization": `Bearer ${accessToken}` },
    });
    const topTracksData = await topTracksResponse.json();

    const topArtistsResponse = await fetch("https://api.spotify.com/v1/me/top/artists?limit=10", {
        headers: { "Authorization": `Bearer ${accessToken}` },
    });
    const topArtistsData = await topArtistsResponse.json();

    const favTracksResponse = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
        headers: { "Authorization": `Bearer ${accessToken}` },
    });
    const favTracksData = await favTracksResponse.json();

    const nowPlayingResponse = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { "Authorization": `Bearer ${accessToken}` },
    });
    const nowPlayingData = await nowPlayingResponse.json();

    res.status(200).json({
        tracks: topTracksData,
        artists: topArtistsData,
        favs: favTracksData,
        nowPlaying: nowPlayingData,
    });
}
