import React from "react";
import { Button } from "./button.tsx";

const genres = [
  "Pop", "Rock", "Hip-Hop", "Jazz",
  "Classical", "Electronic", "Country", "Reggae",
  "R&B", "Metal", "Folk", "Latin"
];

type GenreSelectorProps = {
  selected: string | null;
  onSelect: (genre: string) => void;
};

export default function GenreSelector({ selected, onSelect }: GenreSelectorProps) {
  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
        {genres.map((genre) => {
          const isActive = genre === selected;
          return (
            <Button
              key={genre}
              variant={isActive ? "default" : "outline"}
              className={`rounded-xl py-6 px-4 truncate whitespace-nowrap transition-colors duration-200 ${
                isActive ? "bg-teal-500 text-white" : "bg-white/5 text-white"
              }`}
              onClick={() => onSelect(genre)}
            >
              {genre}
            </Button>
          );
        })}
      </div>
    </div>
  );
}