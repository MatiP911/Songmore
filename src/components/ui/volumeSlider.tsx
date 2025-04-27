"use client";

import * as React from "react";
import { Volume2 } from "lucide-react";
import { Slider } from "~/components/ui/slider";

type VolumeSliderProps = {
    volume: number;
    onVolumeChange: (value: number) => void;
}

export default function VolumeSlider({ volume, onVolumeChange }: VolumeSliderProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div
            className="flex items-center gap-4 w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Volume2 className="h-5 w-5 text-primary" />
            <div
                className={
                    `w-full transition-opacity duration-200
                    ${!isHovered ? "opacity-0" : "opacity-100"}`
                }
            >
                <Slider
                    value={[volume]}
                    onValueChange={(vals) => onVolumeChange(vals[0]!)}
                    defaultValue={[0.02]}
                    max={0.1}
                    step={0.005}
                    className="w-full"
                />
            </div>
        </div>
    );
};