import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return new Response("Missing URL", { status: 400 });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return new Response("Upstream error", { status: 502 });
        }

        const contentType = response.headers.get("content-type") ?? "audio/mpeg";
        const buffer = await response.arrayBuffer();

        return new Response(buffer, {
            headers: {
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache",
            },
        });
    } catch (e) {
        return new Response("Failed to fetch audio", { status: 500 });
    }
}
