import SongGame from "~/components/song-game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black text-white">
      <SongGame />
    </main>
  )
}
