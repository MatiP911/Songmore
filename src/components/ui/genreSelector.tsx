"use client"
import { Music, Guitar, PianoIcon, Disc, GuitarIcon, TreePalmIcon, Settings, MicVocal, Flag } from "lucide-react"

const genres = [
  { name: "Pop", icon: <Music className="w-10 h-10 mb-2" /> },
  { name: "Rock", icon: <Guitar className="w-10 h-10 mb-2" /> },
  { name: "Classical", icon: <PianoIcon className="w-10 h-10 mb-2" /> },
  { name: "Rap", icon: <MicVocal className="w-10 h-10 mb-2" /> },
  { name: "Electronic", icon: <Disc className="w-10 h-10 mb-2" /> },
  { name: "Country", icon: <GuitarIcon className="w-10 h-10 mb-2" /> },
  { name: "Reggae", icon: <TreePalmIcon className="w-10 h-10 mb-2" /> },
  { name: "Poland", icon: <Flag className="w-10 h-10 mb-2" /> },
  { name: "Custom", icon: <Settings className="w-10 h-10 mb-2" /> },
]

type GenreSelectorProps = {
  selected: string | null
  onSelect: (genre: string) => void
}

export default function GenreSelector({ selected, onSelect }: GenreSelectorProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4 mb-8">
        {genres.map((genre) => {
          const isActive = genre.name === selected
          return (
            <div
              key={genre.name}
              onClick={() => onSelect(genre.name)}
              className={`
                bg-[#13131f] rounded-lg p-6 flex flex-col items-center justify-center 
                cursor-pointer transition-colors
                ${isActive ? "bg-[#1a1a28] ring-2 ring-[#1EBCB6]" : "hover:bg-[#1a1a28]"}
              `}
            >
              {genre.icon}
              <span>{genre.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
