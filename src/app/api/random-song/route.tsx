import { NextResponse } from "next/server";
import type { playlist } from "./interfaces.tsx"

export async function GET(playlistID: number) {
    const response = await fetch(
        "https://api.deezer.com/playlist/9486319502"
        // "https://api.deezer.com/playlist/" + playlistID.toString()
        // "https://api.deezer.com/search/track?q=eminem",
    );
    if (!response.ok) {
        throw new Error(`Deezer api returned error. ${response.status}`);
    }
    const fullplaylist = await response.json() as playlist;

    // if (!data.data || data.data.length === 0) {
    //     return NextResponse.json({ error: "no tracks found" }, { status: 404 });
    // }

    const max = 10
    const foundTrack = fullplaylist.tracks.data[Math.floor(Math.random() * max)];
    const trackDetails = {
        title: foundTrack.title,
        artist: foundTrack.artist.name,
        preview: foundTrack.preview,
    };

    return NextResponse.json(trackDetails, { status: 200 });
}
