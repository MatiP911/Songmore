
import { NextResponse } from "next/server";

export async function GET() {
    const response = await fetch("https://api.deezer.com/search/track?q=eminem")
    if (!response.ok) {
        throw new Error(`Deezer api returned error. ${response.status}`)
    }
    const data = await response.json()
    if (!data.data || data.data.length === 0) {
        return NextResponse.json({ error: 'no tracks found' }, { status: 404 })
    }
    const foundTrack = data.data[0];
    const trackDetails = {
        title: foundTrack.title,
        artist: foundTrack.artist.name,
        preview: foundTrack.preview
    }

    return NextResponse.json(trackDetails, { status: 200 });
}
