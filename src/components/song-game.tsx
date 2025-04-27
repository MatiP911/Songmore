"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button.tsx";
import { AutoCompleteInput } from "./ui/autoCompleteInput";
import { ArrowRight, Check, X, Copy } from "lucide-react";
import { AudioPlayer, type AudioPlayerHandle } from "./audioPlayer.tsx";
import GenreSelector from "./ui/genreSelector.tsx";
import SettingsDialog from "./ui/customSettings.tsx";
import { useRouter } from "next/navigation";

export type GuessResult = {
  guess: string;
  isCorrect: boolean;
  isSkipped: boolean;
};

export function generateRandomSeed() {
  return Math.random().toString(36).substring(2, 10);
}

export default function SongGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "result">("start");
  const [currentGuess, setCurrentGuess] = useState("");
  const [guessResults, setGuessResults] = useState<GuessResult[]>([]);
  const [currentSong, setSongTitle] = useState("");
  const [currentSongArtist, setSongArtist] = useState("");
  const [genre, setGenre] = useState<number | null>(null);
  const [seed, setSeed] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const audioRef = useRef<AudioPlayerHandle | null>(null);
  const router = useRouter();
  const nrOfStages = 6;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const existingSeed = urlParams.get("seed");

    if (existingSeed) {
      setSeed(existingSeed);
    } else {
      const newSeed = generateRandomSeed();
      setSeed(newSeed);

      const url = new URL(window.location.href);
      url.searchParams.set("seed", newSeed);
      router.replace(url.toString());
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined" && seed) {
      setShareLink(`${window.location.origin}${window.location.pathname}?seed=${seed}`);
    }
  }, [seed]);

  const normalizeString = (str: string) =>
    str.toLowerCase().replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();

  const startGame = () => {
    setGameState("playing");
    setGuessResults([]);
    setCurrentGuess("");
  };

  const submitGuess = () => {
    if (!audioRef.current) return;

    if (currentSong === "") {
      setSongTitle(audioRef.current.getSong());
      setSongArtist(audioRef.current.getArtist());
    }

    const encodedGuess = encodeURIComponent(currentGuess);
    const isCorrect = encodedGuess === currentSong || encodedGuess.includes(currentSong);

    const newResult: GuessResult = {
      guess: currentGuess,
      isCorrect,
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
    if (!audioRef.current) return;

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
    const newSeed = generateRandomSeed();
    setSeed(newSeed);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("seed", newSeed);
      router.replace(url.toString());
    }

    setGameState("start");
    setCurrentGuess("");
    setGuessResults([]);
  };

  const remainingGuesses = nrOfStages - guessResults.length;
  const emptySlots = Array(remainingGuesses).fill(null);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] text-white px-6 py-8 transition-all duration-500 ease-in-out">
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
            <Button
              disabled={!genre}
              onClick={startGame}
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg">
              Start Game
            </Button>
            {shareLink && (
              <div className="flex flex-col items-center mt-4 space-y-2">
                <p className="text-gray-400 text-sm">Share this link:</p>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-800 text-white rounded-lg px-4 py-2 break-all text-xs">
                    {shareLink}
                  </div>
                  <Button
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="bg-gray-800 rounded-lg hover:bg-white/10 text-white"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                </div>
              </div>
            )}

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
              seed={seed}
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
