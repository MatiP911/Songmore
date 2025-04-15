import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Progress } from "~/components/ui/progress"
import { Button } from "~/components/ui/button"

export type Song = {
    title: string
    artist: string
    preview: string
}

export interface AudioPlayerHandle {
    getSong: () => string;
    getArtist: () => string;
    setStage: (stage: number) => void
    getTime: () => number | null;
}

const AudioPlayer = forwardRef<AudioPlayerHandle, {}>((_props, ref) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [currentVolume, setCurrentVolume] = useState(0.02);

    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [currentStage, setCurrentStage] = useState(1);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
    const stageDurations = [1, 2, 3, 5, 15, 30]

    useImperativeHandle(ref, () => ({
        setStage: (stage: number) => {
            setCurrentStage(stage);
        },
        getTime: () => { return currentAudio?.currentTime ?? null },
        getSong: () => { return currentSong?.title ?? "" },
        getArtist: () => { return currentSong?.artist ?? "" }
    }));

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch("/api/random-song");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();

                if (data) {
                    // Create a new Audio object with the URL
                    const audio = new Audio(data.preview);
                    audio.volume = currentVolume; // Set initial volume
                    setCurrentAudio(audio); // Store the Audio object
                    setCurrentSong(data)
                } else {
                    console.error("Invalid data format from API:", data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getData();
        return () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.src = ""; // Clear the source
            }
        };
    }, []);

    useEffect(() => {
        if (!currentAudio) return

        const handleTimeUpdate = () => {
            setCurrentTime(currentAudio.currentTime);
            const currentStageDuration = stageDurations[currentStage - 1];
            if (
                currentStageDuration !== undefined &&
                currentAudio.currentTime >= currentStageDuration
            ) {
                currentAudio.pause();
                console.log(`Stage ${currentStage} ended.`);
            }
        };

        currentAudio.addEventListener('timeupdate', handleTimeUpdate);

        // Cleanup: Remove the event listener when component unmounts or dependencies change
        return () => {
            currentAudio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [currentAudio, currentStage, stageDurations, setCurrentTime]); // Dependencies for this effect

    // Effect 2: Update audio volume when the volume state changes
    useEffect(() => {
        if (currentAudio) {
            // Ensure volume is within the valid range [0, 1]
            currentAudio.volume = Math.max(0, Math.min(1, currentVolume));
        }
    }, [currentAudio, currentVolume]); // Only depends on audio and volume state

    useEffect(() => {
        if (!currentAudio) return;
        const timeDifference = Math.abs(currentAudio.currentTime - currentTime);

        if (currentAudio.readyState > 0 && timeDifference > 1) {
            console.log(`Seeking audio to: ${currentTime}`);
            currentAudio.currentTime = currentTime;
        }
    }, [currentAudio, currentTime]); // Only depends on audio and the time state intended for seeking

    // Note: The original effect included `gameState`. If `gameState` should control
    // whether listeners are active or how seeking/volume works, you'll need to
    // incorporate that logic into the relevant useEffect hooks (e.g., add conditions
    // based on gameState or include it in dependency arrays if the effect logic depends on it).

    const playCurrentClip = () => {
        if (!currentAudio) {
            console.log("error playing song")
        } else if (currentAudio.paused) {
            setCurrentTime(0)
            currentAudio.play().catch((error) => {
                console.log(error)
            })
        } else {
            currentAudio.pause()
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
    };

    return (
        <div>
            <div className="w-full text-center space-y-1">
                <h3 className="text-green-500 font-medium">Stage {currentStage}</h3>
                <p className="text-sm text-gray-400">{stageDurations[currentStage - 1]} Seconds</p>

                <div className="w-full mt-2">
                    <Progress value={(currentTime / 30) * 100} className="h-2 bg-gray-700" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{"0:30"}</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-center my-4">
                <Button
                    onClick={playCurrentClip}
                    disabled={!currentAudio?.paused}
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

        </div>
    );
});

export { AudioPlayer }