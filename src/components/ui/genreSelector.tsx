"use client"

import { Flame, Music, Guitar, PianoIcon, Trophy, HandMetal, Ellipsis, Disc3, Settings, MicVocal, Flag, Venus, Clapperboard, Gamepad2 } from "lucide-react"
import SettingsDialog from "./customSettings"
import { useState, useEffect } from "react"

type GenreSelectorProps = {
  selected: number | null
  onSelect: (genre: number) => void
  onCustomPlaylistsSave?: (ids: number[]) => void
}
const genresStyle = "w-10 h-10 mb-1 min-w-5 min-h-5"

const genres = [
  { name: "Classic Pop", icon: <Music className={genresStyle} />, id: 9486319502, enabled: true },
  { name: "Rock", icon: <Guitar className={genresStyle} />, id: 2445516006, enabled: true },
  { name: "Rap", icon: <MicVocal className={genresStyle} />, id: 6624288744, enabled: true },
  { name: "Poland", icon: <Flag className={genresStyle} />, id: 12459037343, enabled: true },
  { name: "80's", icon: <Disc3 className={genresStyle} />, id: 2718126984, enabled: true },
  { name: "White girl music", icon: <Venus className={genresStyle} />, id: 12458795303, enabled: true },
  { name: "Metal", icon: <HandMetal className={genresStyle} />, id: 10356251462, enabled: true },
  { name: "Movies", icon: <Clapperboard className={genresStyle}/>, id: 2904878302, enabled: true },
  { name: "Classical", icon: <PianoIcon className={genresStyle} />, id: 747148961, enabled: true },
  { name: "Games", icon: <Gamepad2 className={genresStyle} />, id: 8168137842, enabled: true },
  { name: "00s Hits", icon: <Disc3 className={genresStyle} />, id: 248297032, enabled: true },
  { name: "Poland Disco-polo", icon: <Flag className={genresStyle} />, id: 12155656151, enabled: true },
  { name: "Top Worldwide", icon: <Trophy className={genresStyle} />, id: 3155776842, enabled: true },
]

const moreGenres = { name: "More", icon: <Ellipsis className={genresStyle} />, id: -1, enabled: true }
const customGenres = { name: "Custom", icon: <Settings className={genresStyle} />, id: 0, enabled: true }

export default function GenreSelector({ selected, onSelect, onCustomPlaylistsSave }: GenreSelectorProps) {
  const [settingsOpen, settingsSetOpen] = useState(false)
  const [vw, setVw] = useState<number>(0)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    function onResize() {
      setVw(window.innerWidth)
    }
    if (typeof window !== 'undefined') {
      setVw(window.innerWidth)
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }
  }, [])

  const handleClose = () => {
    settingsSetOpen(false)
  }
  const handleSave = (playlistIds: number[]) => {
    onCustomPlaylistsSave?.(playlistIds)
    onSelect(0)
  }

  return (
    <div className="w-full pt-2">
      <div className={`grid ${vw >= 600 ? 'grid-cols-4' : 'grid-cols-3'} gap-3 mb-8`}>
        {(() => {
          const isMobile = vw < 600
          const baseCount = isMobile ? 7 : 10
          const baseGenres = genres.slice(0, baseCount)
          const custom = customGenres
          const more = moreGenres

          const visiblePrimary = baseGenres
          const visibleSecondary = showMore
            ? genres.filter(g => !visiblePrimary.includes(g) && g.name !== 'Custom')
            : []

          const itemsToRender = [...visiblePrimary, ...visibleSecondary, more, custom]

          return itemsToRender.map((genre) => {
          const isActive = genre.id === selected
          return (
            <div
              key={genre.id}
              onClick={
                genre.name === "Custom"
                  ? () => settingsSetOpen(true)
                  : genre.name === "More"
                    ? () => setShowMore((v) => !v)
                    : genre.enabled
                      ? () => onSelect(genre.id)
                      : () => { }
              }
              className={`
                bg-[#13131f] rounded-lg ${vw >= 600 ? 'p-6' : 'p-2'} flex flex-col items-center justify-center aspect-square
                ${genre.enabled ? "cursor-pointer" : "cursor-not-allowed opacity-30"} transition-colors
                ${isActive ? "bg-[#1a1a28] ring-2 ring-[#1EBCB6]" : "hover:bg-[#1a1a28]"}
              `}
            >
              {genre.icon}
              <span className={`w-full min-w-0 text-center ${vw >= 600 ? "" : "truncate"} text-[clamp(10px,3vw,15px)]`}>{genre.name}</span>
            </div>
          )
          })
        })()}
      </div>
      <SettingsDialog isOpen={settingsOpen} onClose={handleClose} onSave={handleSave}></SettingsDialog>
    </div>
  )
}
