"use client"
import { Music, Guitar, PianoIcon, Disc, GuitarIcon, TreePalmIcon, Settings, MicVocal, Flag, Venus } from "lucide-react"

type GenreSelectorProps = {
  selected: number | null
  onSelect: (genre: number) => void
}

const genres = [
  { name: "Pop", icon: <Music className="w-10 h-10 mb-2" />, id: 9486319502, enabled: true },
  { name: "Rock", icon: <Guitar className="w-10 h-10 mb-2" />, id: 2445516006, enabled: true },
  { name: "Classical", icon: <PianoIcon className="w-10 h-10 mb-2" />, id: 0, enabled: false }, /** TODO: patrz README */
  { name: "Rap", icon: <MicVocal className="w-10 h-10 mb-2" />, id: 6624288744, enabled: true },
  { name: "Movies and Games", icon: <Disc className="w-10 h-10 mb-2" />, id: 12482400983, enabled: true },
  { name: "80's", icon: <GuitarIcon className="w-10 h-10 mb-2" />, id: 2718126984, enabled: true },
  { name: "White girl music", icon: <Venus className="w-10 h-10 mb-2" />, id: 12458795303, enabled: true },
  { name: "Poland", icon: <Flag className="w-10 h-10 mb-2" />, id: 12459037343, enabled: true },
  { name: "Custom", icon: <Settings className="w-10 h-10 mb-2" />, id: -1, enabled: false },
]

export default function GenreSelector({ selected, onSelect }: GenreSelectorProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4 mb-8">
        {genres.map((genre) => {
          const isActive = genre.id === selected
          return (
            <div
              key={genre.id}
              onClick={genre.enabled ? () => onSelect(genre.id) : () => { }}
              className={`
                bg-[#13131f] rounded-lg p-6 flex flex-col items-center justify-center 
                ${genre.enabled ? "cursor-pointer" : "cursor-not-allowed opacity-30"} transition-colors
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
