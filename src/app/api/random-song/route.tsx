import { NextResponse } from "next/server";
import type { playlist, track } from "./interfaces.tsx"

export const dynamic = "force-dynamic";

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const playlistID = searchParams.get("playlistID");

    if (!playlistID) {
        return NextResponse.json({ error: "playlistID is missing or invalid" }, { status: 400 });
    }

    const response = await fetch(
        "https://api.deezer.com/playlist/" + playlistID
    );

    if (!response.ok) {
        throw new Error(`Deezer api returned error. ${response.status}`);
    }
    const fullplaylist = await response.json() as playlist;

    if (!fullplaylist.tracks.data || fullplaylist.tracks.data.length === 0) {
        return NextResponse.json({ error: "no tracks found" }, { status: 404 });
    }

    const max = fullplaylist.tracks.data.length;

    //To jest dla mojego debugera, nie ruszacie
    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    let foundTrack = fullplaylist.tracks.data[Math.floor(Math.random() * max)] as track;

    while (foundTrack.readable !== true || !foundTrack.preview) {
        //To jest dla mojego debugera, nie ruszacie
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        foundTrack = fullplaylist.tracks.data[Math.floor(Math.random() * max)] as track;
    };

    const mp3Response = await fetch(foundTrack.preview);
    if (!mp3Response.ok) {
        return NextResponse.json(
            { error: "Failed to fetch MP3 preview data" },
            { status: 502 },
        );
    }
    const mp3Blob = await mp3Response.blob();

    const headers = new Headers();
    headers.set("Content-Type", "audio/mpeg");
    headers.set("Cache-Control", "no-store, private");
    headers.set("X-Track-Title", foundTrack.title);
    headers.set("X-Track-Artist", foundTrack.artist.name);

    return new NextResponse(mp3Blob, {
        status: 200,
        headers: headers,
    });
}
