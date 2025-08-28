"use client"

import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "~/components/ui/dialog"
import { Save } from "lucide-react"
import { AutoCompleteInput } from "./autoCompleteInput.tsx"
import type { playlist } from "~/app/api/random-song/interfaces.tsx"

interface customSettingsProps {
    isOpen: boolean
    onClose: () => void;
    onSave: (ids: number[]) => void;
}

export default function SettingsDialog({
    isOpen,
    onClose,
    onSave,
}: customSettingsProps) {
    const [playlistID, setPlaylistID] = useState('')
    const [selectedPlaylists, setSelectedPlaylists] = useState<{ id: number; title: string }[]>([])

    useEffect(() => {
        if (!isOpen) return
        try {
            const raw = window.localStorage.getItem("songmore.selectedPlaylists")
            if (raw) {
                const parsed = JSON.parse(raw) as { id: number; title: string }[]
                if (Array.isArray(parsed)) setSelectedPlaylists(parsed)
            }
        } catch {
            // ignore
        }
    }, [isOpen])

    const handleSaveClick = () => {
        try {
            window.localStorage.setItem("songmore.selectedPlaylists", JSON.stringify(selectedPlaylists))
        } catch {
            // ignore
        }
        onSave(selectedPlaylists.map(p => p.id));
        onClose();
    };

    const handleSelect = (item: playlist) => {
        const id = item.id
        const title = item.title
        if (selectedPlaylists.some(p => p.id === id)) return
        setSelectedPlaylists(prev => [...prev, { id, title }])
        setPlaylistID('')
    }

    const handleRemove = (id: number) => {
        setSelectedPlaylists(prev => prev.filter(p => p.id !== id))
    }

    return (
        <div className="">
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[600px] ">
                    <DialogHeader>
                        <DialogTitle>Custom game</DialogTitle>
                        <DialogDescription>
                            Configure the game as you wish.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedPlaylists.length > 0 ? (
                        <div className="py-2 flex flex-wrap gap-2">
                            {selectedPlaylists.map((p) => (
                                <div
                                    key={p.id}
                                    className="px-3 py-1 rounded-full bg-white/10 border border-white/20 cursor-pointer text-sm"
                                    onClick={() => handleRemove(p.id)}
                                    title="Remove"
                                >
                                    {p.title}
                                </div>
                            ))}
                        </div>
                    ) : (<p className="py-2">Set the custom playlists for your game</p>)}
                    <AutoCompleteInput
                        value={playlistID}
                        onChange={setPlaylistID}
                        defaultText="Search for your favourite playlist"
                        searchType="playlist"
                        onSelect={(item) => handleSelect(item as playlist)}
                    />

                    <DialogFooter>
                        <Button className="gap-2" onClick={handleSaveClick}>
                            <Save className="h-4 w-4" />
                            OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
