"use client";

// TODO if not used delete useEffect
import { useEffect, useRef, useState } from "react";
import React from "react";
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { ArrowRight, Search, X } from "lucide-react";
import { AudioPlayer, type AudioPlayerHandle } from "./audioPlayer.tsx";

type GuessResult = {
    guess: string;
    isCorrect: boolean;
    isSkipped: boolean;
};

export default function SongGame() {
    const [gameState, setGameState] = useState<"start" | "playing" | "result">(
        "start",
    );
    const [currentGuess, setCurrentGuess] = useState("");
    const [guessResults, setGuessResults] = useState<GuessResult[]>([]);
    const [currentSong, setSongTitle] = useState("");
    const [currentSongArtist, setSongArtist] = useState("");

    const audioRef = useRef<AudioPlayerHandle | null>(null);

    const nrOfStages = 6;

    const startGame = () => {
        setGameState("playing");
        setGuessResults([]);
    };

    const submitGuess = () => {
        if (!audioRef.current) {
            console.error("audio Ref");
            return;
        }

        if (currentSong === "") {
            console.log("current song is empty");
            setSongTitle(audioRef.current.getSong());
            setSongArtist(audioRef.current.getArtist());
            if (currentSong === "") {
                console.error("failed to load song info");
            }
        }

        const isCorrect =
            currentGuess.toLowerCase() === currentSong.toLowerCase() ||
            currentGuess.toLowerCase().includes(currentSong.toLowerCase());

        const newResult: GuessResult = {
            guess: currentGuess,
            isCorrect: isCorrect,
            isSkipped: false,
        };

        const updatedResults = [...guessResults, newResult];
        setGuessResults(updatedResults);
        setCurrentGuess("");

        if (isCorrect || updatedResults.length >= nrOfStages) {
            // Game over - either correct guess or out of guesses
            setGameState("result");
        } else {
            // Move to next stage
            audioRef.current.nextStage();
        }
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
            // Game over - out of guesses
            setGameState("result");
        } else {
            // Move to next stage
            audioRef.current.nextStage();
        }
    };

    const resetGame = () => {
        setGameState("start");
        setCurrentGuess("");
        setGuessResults([]);
    };

    const remainingGuesses = nrOfStages - guessResults.length;
    const emptySlots = Array(remainingGuesses).fill(null);

    return (
        <div className="flex flex-col items-center justify-between w-full min-h-screen">
            {/* Header */}
            <header className="w-full flex items-center justify-center py-4 border-b border-gray-800">
                <h1 className="text-3xl font-bold">
                    <span className="text-white">Song</span>
                    <span className="text-green-500">more</span>
                </h1>
            </header>

            {/* Game Content */}
            <div className="w-full max-w-md flex flex-col items-center justify-center flex-1 px-4 py-8">
                {gameState === "start" && (
                    <div className="text-center space-y-8">
                        <h2 className="text-2xl font-medium">
                            Try to{" "}
                            <span className="text-green-500">
                                guess the song
                            </span>{" "}
                            from listening to small parts of it
                        </h2>
                        <Button
                            onClick={startGame}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                        >
                            Start Game
                        </Button>
                    </div>
                )}

                {gameState === "playing" && (
                    <div className="w-full space-y-6">
                        {/* Guess History */}
                        <div className="w-full space-y-2">
                            {guessResults.map((result, index) => (
                                <div
                                    key={index}
                                    className={`w-full p-3 rounded flex items-center justify-between ${
                                        result.isSkipped
                                            ? "bg-gray-700 text-gray-300"
                                            : result.isCorrect
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-700 text-gray-300"
                                    }`}
                                >
                                    {result.isSkipped
                                        ? (
                                            <>
                                                <ArrowRight className="h-4 w-4" />
                                                <span className="mx-auto">
                                                    SKIPPED
                                                </span>
                                            </>
                                        )
                                        : (
                                            <>
                                                {result.isCorrect && (
                                                    <X className="h-4 w-4" />
                                                )}
                                                <span className="mx-auto">
                                                    {result.guess}
                                                </span>
                                            </>
                                        )}
                                </div>
                            ))}

                            {/* Empty slots for remaining guesses */}
                            {emptySlots.map((_, index) => (
                                <div
                                    key={`empty-${index}`}
                                    className="w-full p-5 rounded bg-gray-800"
                                />
                            ))}
                        </div>

                        {/*Audio component*/}
                        <AudioPlayer
                            ref={audioRef}
                            onSongLoaded={(title, artist) => {
                                setSongTitle(title);
                                setSongArtist(artist);
                            }}
                        />

                        {/* Guess Input */}
                        <div className="w-full space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Know it? Search for the title"
                                    value={currentGuess}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => setCurrentGuess(e.target.value)}
                                    className="pl-10 bg-gray-900 border-gray-700 text-white rounded-md"
                                />
                            </div>

                            <div className="flex justify-between gap-4">
                                <Button
                                    onClick={skipGuess}
                                    variant="outline"
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
                                >
                                    SKIP
                                </Button>
                                <Button
                                    onClick={submitGuess}
                                    disabled={!currentGuess.trim()}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                    SUBMIT
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === "result" && (
                    <div className="w-full space-y-8 text-center">
                        <h2 className="text-2xl font-bold">Game Over!</h2>

                        <div className="p-6 bg-gray-800 rounded-lg">
                            <p className="text-xl mb-2">The song was</p>
                            <p className="text-2xl font-bold text-green-500">
                                {`${currentSong} - ${currentSongArtist}`}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-gray-400">
                                You got it {guessResults.some((r) =>
                                        r.isCorrect
                                    )
                                    ? "right"
                                    : "wrong"} in {guessResults.length} tries
                            </p>
                            <Button
                                onClick={resetGame}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                            >
                                Play Again
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
