"use client";

// TODO if not used delete useEffect
import { useEffect, useRef, useState } from "react";
import React from "react";
import { Button } from "./ui/button.tsx";
import { AutoCompleteInput } from "./ui/autoCompleteInput";
import { ArrowRight, X } from "lucide-react";
import { AudioPlayer, type AudioPlayerHandle } from "./audioPlayer.tsx";

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

  const audioRef = useRef<AudioPlayerHandle | null>(null);
  
  const nrOfStages = 6; // TODO: ta stała występuje w dwóch miejscah (w audioPlayer.tsx)

  const startGame = () => {
    setGameState("playing");
    setGuessResults([]);
    setCurrentGuess("");
  };

  const submitGuess = () => {
    if (!audioRef.current) {
      console.error("audio Ref");
      return;
    }

    if (currentSong === "") {
      setSongTitle(audioRef.current.getSong());
      setSongArtist(audioRef.current.getArtist());
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

    if (isCorrect || updatedResults.length >= nrOfStages) setGameState("result");
    else audioRef.current.nextStage();
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

    if (updatedResults.length >= nrOfStages) setGameState("result");
    else audioRef.current.nextStage();
  };

  const resetGame = () => {
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
        <p className="text-md text-gray-400 mt-3">Can you guess the song in 6 tries?</p>
      </header>

      <main className="w-full flex flex-col items-center gap-10 px-4 max-w-2xl mx-auto">
        {gameState === "start" && (
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-medium">
              Try to <span className="text-teal-400">guess the song</span> from listening to small parts of it
            </h2>
            <Button onClick={startGame} className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg">
              Start Game
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guessResults.map((result, index) => (
                <div
                  key={index}
                  className={`min-h-[3.5rem] px-6 py-3 flex items-center justify-between text-sm sm:text-base rounded-xl shadow-md overflow-hidden whitespace-nowrap backdrop-blur-sm border ${
                    result.isSkipped
                      ? "bg-white/10 text-gray-300 border-white/10"
                      : result.isCorrect
                      ? "bg-red-600 text-white border-transparent"
                      : "bg-white/10 text-white border-white/10"
                  }`}
                >
                  {result.isSkipped ? (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      <span className="mx-auto">SKIPPED</span>
                    </>
                  ) : (
                    <>
                      {result.isCorrect && <X className="h-4 w-4" />}
                      <span className="mx-auto">{result.guess}</span>
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
              onSongLoaded={(title, artist) => {
                setSongTitle(title);
                setSongArtist(artist);
              }}
            />

            <div className="w-full space-y-4 mt-8">
              <AutoCompleteInput value={currentGuess} onChange={setCurrentGuess} />
              <div className="flex gap-4">
                <Button onClick={skipGuess} variant="outline" className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  SKIP
                </Button>
                <Button
                  onClick={submitGuess}
                  disabled={!currentGuess.trim()}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
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
              <p className="text-2xl font-bold text-teal-400">{`${currentSong} - ${currentSongArtist}`}</p>
            </div>
            <p className="text-white/70">
              You got it {guessResults.some((r) => r.isCorrect) ? "right" : "wrong"} in {guessResults.length} tries
            </p>
            <Button onClick={resetGame} className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-2">
              Play Again
            </Button>
          </div>
        )}

        <p className="mt-12 text-sm italic text-gray-400 text-center max-w-2xl">
          "Every song is a memory. Let’s see how sharp yours is."
        </p>
      </main>
    </div>
  );
}
