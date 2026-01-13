"use client"

import React, { useState } from "react"
import { useLPBuilder } from "../context/lp-builder-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Upload, Loader2, Image as ImageIcon } from "lucide-react"

export function ImageUploadProperty() {
    const { selectedElement, updateElement } = useLPBuilder()
    const [uploading, setUploading] = useState(false)
    const supabase = createClient()

    if (selectedElement?.type !== 'image') return null

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('lp-images')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage
                .from('lp-images')
                .getPublicUrl(filePath)

            updateElement(selectedElement.id, { url: data.publicUrl })
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Erro ao fazer upload da imagem')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground">Imagem</h3>

            <div className="space-y-2">
                <Label className="text-xs">Upload</Label>
                <div className="flex gap-2">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                        id="image-upload"
                    />
                    <Label
                        htmlFor="image-upload"
                        className="flex-1 flex items-center justify-center p-2 border border-dashed rounded cursor-pointer hover:bg-muted/50 text-xs"
                    >
                        {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Upload className="h-4 w-4 mr-2" />
                        )}
                        {uploading ? "Enviando..." : "Escolher Arquivo"}
                    </Label>
                </div>
            </div>

            <div className="space-y-1">
                <Label className="text-xs">OU URL Externa</Label>
                <Input
                    value={selectedElement.url || ''}
                    onChange={(e) => updateElement(selectedElement.id, { url: e.target.value })}
                    placeholder="https://..."
                />
            </div>

            {selectedElement.url && (
                <div className="mt-2 border rounded p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedElement.url} alt="Preview" className="w-full h-auto max-h-[100px] object-contain" />
                </div>
            )}
        </div>
    )
}
