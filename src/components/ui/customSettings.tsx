"use client"

import { useState } from "react"
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
import { Input } from "./input.tsx";

interface customSettingsProps {
    isOpen: boolean
    onClose: () => void;
    onSave: (id: string) => void;
}

export default function SettingsDialog({
    isOpen,
    onClose,
    onSave,
}: customSettingsProps) {
    const [playlistID, setPlaylistID] = useState('')

    const handleSaveClick = () => {
        onSave(playlistID);
        onClose();
    };

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
                    {"Set the custom playlist for your game"}
                    <Input
                        type="string"
                        placeholder="Input the playlist ID"
                        value={playlistID}
                        onChange={(e) => setPlaylistID(e.target.value)}
                        className="min-h-[3.5rem] bg-gray-900/20 border-gray-700 text-white rounded-md"
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
