"use client"

import React, { useState, useEffect } from "react"
import { useLPBuilder } from "../context/lp-builder-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Video } from "lucide-react"

export function VideoControl() {
    const { selectedElement, updateElement } = useLPBuilder()
    const [url, setUrl] = useState("")

    useEffect(() => {
        if (selectedElement && selectedElement.type === 'video') {
            setUrl(selectedElement.url || "")
        }
    }, [selectedElement])

    const handleUrlChange = (newUrl: string) => {
        setUrl(newUrl)
        updateElement(selectedElement!.id, { url: newUrl })
    }

    if (!selectedElement || selectedElement.type !== 'video') return null

    return (
        <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <Video className="w-4 h-4" />
                Vídeo (YouTube)
            </h3>

            <div className="space-y-2">
                <Label className="text-xs">URL do Vídeo</Label>
                <Input
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-[10px] text-muted-foreground">
                    Cole o link completo do vídeo do YouTube.
                </p>
            </div>
        </div>
    )
}
