import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import { Progress } from "./ui/progress.tsx";
import { Button } from "./ui/button.tsx";

const nrOfStages = 6;

export interface AudioPlayerHandle {
    getSong: () => string;
    getArtist: () => string;
    setStage: (stage: number) => void;
    nextStage: () => void;
    getTime: () => number | null;
    stopPlaying: () => void;
}

interface AudioPlayerProps {
    onSongLoaded?: (title: string, artist: string) => void;
    genre: number | null; // Add the genre prop
}


const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(({ onSongLoaded, genre }, ref) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [currentSong, setSongTitle] = useState("");
    const [currentSongArtist, setSongArtist] = useState("");
    const [currentStage, setCurrentStage] = useState(1);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const stageDurations = [0.5, 2, 3, 5, 15, 30];
    const [currentVolume, _setCurrentVolume] = useState(0.02);
    const [isPlaying, setIsPlaying] = useState(false);

    useImperativeHandle(ref, () => ({
        setStage: (stage: number) => setCurrentStage(stage),
        nextStage: () => setCurrentStage((prev) => Math.min(prev + 1, nrOfStages)),
        getTime: () => currentAudio?.currentTime ?? null,
        getSong: () => currentSong,
        getArtist: () => currentSongArtist,
        stopPlaying: () => stopAudio(),
    }));

    useEffect(() => {
        const getData = () => {
            if (!genre) {
                console.error("genre in null")
                return
            }
            const playlistID = genre;
            fetch(`/api/random-song?playlistID=${playlistID}`)
                .then((response) => {
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                    const title = response.headers.get("X-Track-Title") ?? "";
                    const artist = response.headers.get("X-Track-Artist") ?? "";

                    if (!title || !artist) {
                        console.warn("Missing song metadata in headers");
                    }

                    setSongTitle(title);
                    setSongArtist(artist);
                    onSongLoaded?.(title, artist);

                    return response.blob();
                }).then((data) => {
                    if (data) {
                        const audio = new Audio(URL.createObjectURL(data));
                        audio.volume = currentVolume;
                        setCurrentAudio(audio);
                    } else {
                        console.error("Invalid data format from API:", data);
                    }
                })
                .catch((error) => console.error("Error fetching data:", error));
        };

        getData();
        return () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.src = "";
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!currentAudio) return;
        const handleTimeUpdate = () => {
            const currentStageDuration = stageDurations[currentStage - 1];
            setCurrentTime(currentAudio.currentTime);
            if (currentStageDuration && currentAudio.currentTime >= currentStageDuration) {
                stopAudio();
            }
        };
        currentAudio.addEventListener("timeupdate", handleTimeUpdate);
        return () => currentAudio.removeEventListener("timeupdate", handleTimeUpdate);
    }, [currentAudio, currentStage]);

    useEffect(() => {
        if (currentAudio) currentAudio.volume = Math.max(0, Math.min(1, currentVolume));
    }, [currentAudio, currentVolume]);


    const playCurrentClip = () => {
        if (!currentAudio) return console.log("error playing song");
        if (currentAudio.paused) {
            currentAudio.currentTime = 0;
            currentAudio.play().then(() => { setIsPlaying(true); }).catch(console.error);
        } else {
            stopAudio();
        }
    };

    const stopAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            setIsPlaying(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
    };

    return (
        <div className="w-full space-y-4">
            <div className="text-center">
                <h3 className="text-teal-400 font-semibold text-lg">Stage {currentStage}</h3>
                <p className="text-sm text-gray-400">{stageDurations[currentStage - 1]} seconds</p>
            </div>

            <div className="w-full">
                <Progress value={(currentTime / 30) * 100} className="h-2 bg-gray-700" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>0:30</span>
                </div>
            </div>

            <div className="flex justify-center">
                <Button
                    onClick={playCurrentClip}
                    disabled={currentAudio ? false : true}
                    className="rounded-full h-16 w-16 bg-teal-500 hover:bg-teal-600 p-0 flex items-center justify-center shadow-lg transition-transform transform hover:scale-105"
                >
                    {isPlaying ? (
                        // Pause
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
                            <rect x="6" y="4" width="4" height="16" fill="white" />
                            <rect x="14" y="4" width="4" height="16" fill="white" />
                        </svg>
                    ) : (
                        // Play
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
                    )}
                </Button>
            </div>
        </div>
    );
});

AudioPlayer.displayName = "AudioPlayer";

export { AudioPlayer };
