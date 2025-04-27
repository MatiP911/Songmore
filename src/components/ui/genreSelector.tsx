"use client"
import { Flame, Music, Guitar, PianoIcon, HandMetal, GuitarIcon, Disc3, Settings, MicVocal, Flag, Venus, Clapperboard, Gamepad2 } from "lucide-react"
import SettingsDialog from "./customSettings"
import { useState } from "react"
import { custom } from "zod"

type GenreSelectorProps = {
  selected: number | null
  onSelect: (genre: number) => void
}

const genres = [
  { name: "Hits Now", icon: <Flame className="w-10 h-10 mb-2" />, id: 3155776842, enabled: true },
  { name: "Classic Pop", icon: <Music className="w-10 h-10 mb-2" />, id: 9486319502, enabled: true },
  { name: "Rock", icon: <Guitar className="w-10 h-10 mb-2" />, id: 2445516006, enabled: true },
  { name: "Rap", icon: <MicVocal className="w-10 h-10 mb-2" />, id: 6624288744, enabled: true },
  { name: "80's", icon: <Disc3 className="w-10 h-10 mb-2" />, id: 2718126984, enabled: true },
  { name: "White girl music", icon: <Venus className="w-10 h-10 mb-2" />, id: 12458795303, enabled: true },
  { name: "Metal", icon: <HandMetal className="w-10 h-10 mb-2" />, id: 10356251462, enabled: true },
  { name: "Classical", icon: <PianoIcon className="w-10 h-10 mb-2" />, id: -1, enabled: false }, /** TODO: patrz README */
  { name: "Poland", icon: <Flag className="w-10 h-10 mb-2" />, id: 12459037343, enabled: true },
  { name: "Games", icon: <Gamepad2 className="w-10 h-10 mb-2" />, id: 8168137842, enabled: true },
  { name: "Movies", icon: <Clapperboard className="w-10 h-10 mb-2" />, id: 2904878302, enabled: true },
  { name: "Custom", icon: <Settings className="w-10 h-10 mb-2" />, id: 0, enabled: true },
]

export default function GenreSelector({ selected, onSelect }: GenreSelectorProps) {
  const [settingsOpen, settingsSetOpen] = useState(false)

  const handleClose = () => {
    settingsSetOpen(false)
  }
  const handleSave = (playlistId: string) => {
    console.log("Saved custom playlist ID:", playlistId);
    onSelect(parseInt(playlistId))
    const customGenreId = genres.findIndex(genre => genre.name === "Custom");
    if (customGenreId !== -1) {
      genres[customGenreId]!.id = parseInt(playlistId);
    }
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-3 mb-8">
        {genres.map((genre) => {
          const isActive = genre.id === selected
          return (
            <div
              key={genre.id}
              onClick={genre.name === "Custom" ? () => settingsSetOpen(true) : genre.enabled ? () => onSelect(genre.id) : () => { }}
              className={`
                bg-[#13131f] rounded-lg p-6 flex flex-col items-center justify-center aspect-square
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
      <SettingsDialog isOpen={settingsOpen} onClose={handleClose} onSave={handleSave}></SettingsDialog>
    </div>
  )
}
