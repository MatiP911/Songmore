
import { NextResponse } from "next/server";

const SAMPLE_SONGS = [
    {
        id: 1,
        title: "Bohemian Rhapsody",
        artist: "Queen",
        audioUrl: "/sample-audio.mp3",
    },
    {
        id: 2,
        title: "Billie Jean",
        artist: "Michael Jackson",
        audioUrl: "/sample-audio.mp3",
    },
    {
        id: 3,
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        audioUrl: "/sample-audio.mp3",
    },
]

// TODO: Tutaj trzeba zrobić call do api deezera
export async function GET() {
    // Log to the SERVER terminal when this is hit

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
