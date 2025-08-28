import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const type = searchParams.get('type')

    if (!query) {
        return NextResponse.json({ data: [] }, { status: 400 });
    }

    try {
        let apiUrl;
        if (type === 'playlist') {
            apiUrl = `https://api.deezer.com/search/playlist?q=${encodeURIComponent(query)}`;
        } else {
            // Default song search
            apiUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;
        }
        const res = await fetch(apiUrl, {
            cache: "no-store",
        });
        if (!res.ok) {
            console.error(`Deezer API error: ${res.status} ${res.statusText}`);
            return NextResponse.json({ error: "Failed to fetch from Deezer" }, { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json(data, {
            status: 200,
            headers: {
                "Cache-Control": "no-store, private",
            },
        });
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}