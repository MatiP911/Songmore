"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Progress } from "~/components/ui/progress"
import { Search, X, ArrowRight } from "lucide-react"


const emptySong = {
  id: 0,
  title: "EMPTY SONG",
  artist: "NONE",
  audioUrl: "",
}

type Song = {
  title: string
  artist: string
  preview: string
}

type GuessResult = {
  guess: string
  artist?: string
  isCorrect: boolean
  isSkipped: boolean
}

export default function SongGame() {
  const [gameState, setGameState] = useState<"start" | "playing" | "result">("start")
  const [currentGuess, setCurrentGuess] = useState("")
  const [guessResults, setGuessResults] = useState<GuessResult[]>([])
  const [currentStage, setCurrentStage] = useState(1)

  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [currentSong, setCurrentSong] = useState<Song>()
  const [isPlaying, setIsPlaying] = useState(false)
  // const [currentTime, setCurrentTime] = useState(0)
  // const [duration, setDuration] = useState(0)

  const maxGuesses = 6
  const maxStages = 6
  const stageDurations = [1, 2, 3, 4, 5, 10] // Duration in seconds for each stage

  useEffect(() => {

  }, [gameState, currentStage])

  const startGame = async () => {
    // fetch song info
    const response = await fetch('api/random-song')
    const data = await response.json()
    setCurrentSong(data)
    setCurrentAudio(new Audio(data.preview))
    setGameState("playing")
    setCurrentStage(1)
    setGuessResults([])
  }

  const playCurrentClip = () => {
    if (!currentAudio) {
      console.log("error playing song")
    } else if (!isPlaying && currentAudio.paused) {
      currentAudio.play().catch((error) => {
        console.log(error)
      })
      setIsPlaying(true)
    } else {
      currentAudio.pause()
      setIsPlaying(false)
    }
  }

  const submitGuess = () => {

    if (!currentSong) {
      console.error("submitGuess called but currentSong is not loaded yet.");
      return
    }

    const isCorrect =
      currentGuess.toLowerCase() === currentSong.title.toLowerCase() ||
      currentGuess.toLowerCase().includes(currentSong.title.toLowerCase())

    const newResult: GuessResult = {
      guess: isCorrect ? currentSong.title : currentGuess,
      artist: isCorrect ? currentSong.artist : undefined,
      isCorrect,
      isSkipped: false,
    }

    const updatedResults = [...guessResults, newResult]
    setGuessResults(updatedResults)
    setCurrentGuess("")

    if (isCorrect || updatedResults.length >= maxGuesses) {
      // Game over - either correct guess or out of guesses
      currentAudio?.pause()
      setIsPlaying(false)
      setGameState("result")
    } else {
      // Move to next stage
      setCurrentStage((prev) => Math.min(prev + 1, maxStages))
    }
  }

  const skipGuess = () => {
    const newResult: GuessResult = {
      guess: "",
      isCorrect: false,
      isSkipped: true,
    }

    const updatedResults = [...guessResults, newResult]
    setGuessResults(updatedResults)
    setCurrentGuess("")

    if (updatedResults.length >= maxGuesses) {
      // Game over - out of guesses
      setGameState("result")
    } else {
      // Move to next stage
      setCurrentStage((prev) => Math.min(prev + 1, maxStages))
    }
  }

  const resetGame = () => {
    setGameState("start")
    setCurrentGuess("")
    setGuessResults([])
    setCurrentStage(1)
    setIsPlaying(false)
  }

  const remainingGuesses = maxGuesses - guessResults.length
  const emptySlots = Array(remainingGuesses).fill(null)

  return (
    <div className="flex flex-col items-center justify-between w-full min-h-screen">
      {/* Header */}
      <header className="w-full flex items-center justify-center py-4 border-b border-gray-800">
        <h1 className="text-3xl font-bold">
          <span className="text-white">Song</span>
          <span className="text-gray-400">more</span>
        </h1>
      </header>

      {/* Game Content */}
      <div className="w-full max-w-md flex flex-col items-center justify-center flex-1 px-4 py-8">
        {gameState === "start" && (
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-medium">
              Try to <span className="text-green-500">guess the song</span> from listening to small parts of it
            </h2>
            <Button onClick={startGame} className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
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
                  className={`w-full p-3 rounded flex items-center justify-between ${result.isSkipped
                    ? "bg-gray-700 text-gray-300"
                    : result.isCorrect
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-gray-300"
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
                      <span className="mx-auto">
                        {result.guess}
                        {result.artist ? ` - ${result.artist}` : ""}
                      </span>
                    </>
                  )}
                </div>
              ))}

              {/* Empty slots for remaining guesses */}
              {emptySlots.map((_, index) => (
                <div key={`empty-${index}`} className="w-full p-5 rounded bg-gray-800" />
              ))}
            </div>

            {/* Current Stage Info */}
            <div className="w-full text-center space-y-1">
              <h3 className="text-green-500 font-medium">Stage {currentStage}</h3>
              <p className="text-sm text-gray-400">{stageDurations[currentStage - 1]} Seconds</p>

              <div className="w-full mt-2">
                {/* <Progress value={(currentTime / duration) * 100} className="h-2 bg-gray-700" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0:00</span>
                  <span>0:{duration < 10 ? `0${duration}` : duration}</span>
                </div> */}
              </div>
            </div>

            {/* Play Button */}
            <div className="flex justify-center my-4">
              <Button
                onClick={playCurrentClip}
                disabled={isPlaying}
                className="rounded-full h-14 w-14 bg-green-600 hover:bg-green-700 p-0 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" fill="white" />
                </svg>
              </Button>
            </div>

            {/* Guess Input */}
            <div className="w-full space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Know it? Search for the title"
                  value={currentGuess}
                  onChange={(e) => setCurrentGuess(e.target.value)}
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
                {currentSong && `${currentSong.title} - ${currentSong.artist}`}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-400">
                You got it {guessResults.some((r) => r.isCorrect) ? "right" : "wrong"} in {guessResults.length} tries
              </p>
              <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700 text-white px-8 py-2">
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
