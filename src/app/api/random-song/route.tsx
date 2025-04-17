import { NextResponse } from "next/server";

interface Track {
    id: number;
    readable?: boolean;
    title: string;
    title_short: string;
    title_version: string;
    link: string;
    duration: number;
    rank: number;
    explicit_lyrics: boolean;
    explicit_content_lyrics: number;
    explicit_content_cover: number;
    preview: string;
    md5_image: string;
    position: number;
    artist: {
        id: number;
        name: string;
        link: string;
        picture: string;
        picture_small: string;
        picture_medium: string;
        picture_big: string;
        picture_xl: string;
        radio: boolean;
        tracklist: string;
        type: string;
    };
    album: {
        id: number;
        title: string;
        cover: string;
        cover_small: string;
        cover_medium: string;
        cover_big: string;
        cover_xl: string;
        md5_image: string;
        tracklist: string;
        type: string;
    };
    type: string;
}

interface DeezerSeach {
    data: Track[];
}
export async function GET() {
    const response = await fetch(
        "https://api.deezer.com/search/track?q=eminem",
    );
    if (!response.ok) {
        throw new Error(`Deezer api returned error. ${response.status}`);
    }
    const data = await response.json() as DeezerSeach;
    if (!data.data || data.data.length === 0) {
        return NextResponse.json({ error: "no tracks found" }, { status: 404 });
    }
    const foundTrack = data.data[0];
    const trackDetails = {
        title: foundTrack.title,
        artist: foundTrack.artist.name,
        preview: foundTrack.preview,
    };

    return NextResponse.json(trackDetails, { status: 200 });
}
