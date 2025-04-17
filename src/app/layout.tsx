import "../styles/globals.css";

import React from "react";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
    title: "SongMore",
    description: "Can you guess the song?",
    icons: [{ rel: "icon", url: "/songmore.svg" }],
};

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
});

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${geist.variable}`}>
            <body>{children}</body>
        </html>
    );
}
