"use client";

// TODO if not used delete useEffect
import { useEffect, useRef, useState } from "react";
import React from "react";
import { Button } from "./ui/button.tsx";
import { AutoCompleteInput } from "./ui/autoCompleteInput";
import { ArrowRight, Check, X } from "lucide-react";
import { AudioPlayer, type AudioPlayerHandle } from "./audioPlayer.tsx";
import GenreSelector from "./ui/genreSelector.tsx";

type GuessResult = {
    guess: string;
    isCorrect: boolean;
    isSkipped: boolean;
};

export default function SongGame() {
    const [gameState, setGameState] = useState<"start" | "playing" | "result">("start");
    const [currentGuess, setCurrentGuess] = useState("");
    const [guessResults, setGuessResults] = useState<GuessResult[]>([]);
    const [currentSong, setSongTitle] = useState("");
    const [currentSongArtist, setSongArtist] = useState("");
    const [genre, setGenre] = useState<number | null>(null);

    const audioRef = useRef<AudioPlayerHandle | null>(null);

    const nrOfStages = 6; // TODO: ta stała występuje w dwóch miejscah (w audioPlayer.tsx)

    const startGame = () => {
        setGameState("playing");
        setGuessResults([]);
        setCurrentGuess("");
    };

    const normalizeString = (str: string) =>
        str.toLowerCase().replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim()

    const submitGuess = () => {
        if (!audioRef.current) {
            console.error("audio Ref");
            return;
        }

        if (currentSong === "") {
            setSongTitle(audioRef.current.getSong());
            setSongArtist(audioRef.current.getArtist());
        }

        const encodedGuess = encodeURIComponent(currentGuess);

        console.log(encodedGuess, currentSong)

        const isCorrect =
            encodedGuess === currentSong ||
            encodedGuess.includes(currentSong);

        const newResult: GuessResult = {
            guess: currentGuess,
            isCorrect: isCorrect,
            isSkipped: false,
        };

        const updatedResults = [...guessResults, newResult];
        setGuessResults(updatedResults);
        setCurrentGuess("");

        if (isCorrect || updatedResults.length >= nrOfStages) {
            audioRef.current.stopPlaying();
            setGameState("result");
        } else audioRef.current.nextStage();
    };

    const skipGuess = () => {
        if (!audioRef.current) {
            console.error("audio Ref");
            return;
        }

        const newResult: GuessResult = {
            guess: "",
            isCorrect: false,
            isSkipped: true,
        };

        const updatedResults = [...guessResults, newResult];
        setGuessResults(updatedResults);
        setCurrentGuess("");

        if (updatedResults.length >= nrOfStages) {
            audioRef.current.stopPlaying();
            setGameState("result");
        } else audioRef.current.nextStage();
    };

    const resetGame = () => {
        audioRef.current?.stopPlaying();
        console.log("RESET - audioRef.current:", audioRef.current);
        setGameState("start");
        setCurrentGuess("");
        setGuessResults([]);
    };

    const remainingGuesses = nrOfStages - guessResults.length;
    const emptySlots = Array(remainingGuesses).fill(null);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen w-full bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] text-white px-6 py-10 transition-all duration-500 ease-in-out">
            <header className="w-full text-center mb-12">
                <h1 className="text-6xl font-extrabold tracking-tight cursor-pointer select-none" onClick={resetGame}>
                    <span className="text-white">Song</span>
                    <span className="text-teal-400">more</span>
                </h1>
                <p className="hidden sm:block text-md text-gray-400 mt-3">Can you guess the song in 6 tries?</p>
            </header>

            <main className="w-full flex flex-col items-center gap-10 px-4 max-w-2xl mx-auto">
                {gameState === "start" && (
                    <div className="text-center space-y-8">
                        <h2 className="text-2xl font-medium">
                            Select <span className="text-teal-400">genre</span> and try to <span className="text-teal-400">guess the song</span> from listening to small parts of it
                        </h2>
                        <GenreSelector selected={genre} onSelect={setGenre} />
                        <div className="h-2" />
                        <Button
                            disabled={!genre}
                            onClick={startGame}
                            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg">
                            Start Game
                        </Button>
                        <p className="mt-12 text-sm italic text-gray-400 text-center max-w-2xl">
                            &quot;Every song is a memory. Let’s see how sharp yours is.&quot;
                        </p>
                    </div>

                )}

                {gameState === "playing" && (
                    <>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            {guessResults.map((result, index) => (
                                <div
                                    key={index}
                                    className={`min-h-[3.5rem] px-6 py-3 flex items-center justify-between text-sm sm:text-base rounded-xl shadow-md whitespace-nowrap backdrop-blur-sm border 
                                        ${result.isSkipped ? "bg-white/10 text-gray-300 border-white/10"
                                            : result.isCorrect ?
                                                "bg-green-500/60 text-white border-transparent"
                                                : "bg-red-600/20 text-white border-white/10"
                                        }`}
                                >
                                    {result.isSkipped ? (
                                        <>
                                            <ArrowRight className="h-4 w-4 flex-shrink-0" />
                                            <span className="mx-auto">SKIPPED</span>
                                        </>
                                    ) : (
                                        <>
                                            {!result.isCorrect ? <X className="h-4 w-4 flex-shrink-0" /> : <Check className="h-4 w-4 flex-shrink-0" />}
                                            <span className="mx-auto truncate">{result.guess}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                            {emptySlots.map((_, index) => (
                                <div
                                    key={`empty-${index}`}
                                    className="min-h-[3.5rem] bg-white/5 border border-white/10 rounded-xl"
                                />
                            ))}
                        </div>

                        <AudioPlayer
                            ref={audioRef}
                            genre={genre}
                            onSongLoaded={(title, artist) => {
                                setSongTitle(title);
                                setSongArtist(artist);
                            }}
                        />

                        <div className="w-full space-y-4">
                            <AutoCompleteInput value={currentGuess} onChange={setCurrentGuess} />
                            <div className="flex gap-4">
                                <Button onClick={skipGuess} variant="outline" className="min-h-[3.5rem] flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20">
                                    SKIP
                                </Button>
                                <Button
                                    onClick={submitGuess}
                                    disabled={!currentGuess.trim()}
                                    className="min-h-[3.5rem] flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                                >
                                    SUBMIT
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {gameState === "result" && (
                    <div className="w-full space-y-8 text-center">
                        <h2 className="text-2xl font-bold">Game Over!</h2>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
                            <p className="text-xl mb-2">The song was</p>
                            <p className="text-2xl font-bold text-teal-400">{`${decodeURIComponent(currentSong)} - ${decodeURIComponent(currentSongArtist)}`}</p>
                        </div>
                        <p className="text-white/70">
                            You got it {guessResults.some((r) => r.isCorrect) ? `right in ${guessResults.length} tries` : "wrong, better luck next time!"}
                        </p>
                        <Button onClick={resetGame} className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-2">
                            Play Again
                        </Button>
                    </div>
                )}


            </main>
        </div>
    );
}
