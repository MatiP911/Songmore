import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ data: [] }, { status: 400 });
    }

    try {
        const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch from Deezer" }, { status: 500 });
    }
}