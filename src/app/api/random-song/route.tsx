
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
    console.log('API Route /api/random-song received GET request');

    const testSong = {
        id: 99,
        title: 'Test Song',
        artist: 'API Route',
    };

    return NextResponse.json(testSong, { status: 200 });
}
