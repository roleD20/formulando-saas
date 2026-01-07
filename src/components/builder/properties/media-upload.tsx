"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface MediaUploadProps {
    value?: string
    onChange: (url: string) => void
    type: "image" | "video"
    label: string
}

export function MediaUpload({ value, onChange, type, label }: MediaUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const supabase = createClient()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (type === "image" && !file.type.startsWith("image/")) {
            toast.error("Por favor, selecione uma imagem válida (PNG, JPG, WEBP).")
            return
        }
        if (type === "video" && !file.type.startsWith("video/")) {
            toast.error("Por favor, selecione um vídeo válido (MP4, WEBM).")
            return
        }

        // Validate size (e.g., 5MB for images, 50MB for videos)
        const maxSize = type === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024
        if (file.size > maxSize) {
            toast.error(`Arquivo muito grande. Limite de ${type === "image" ? "5MB" : "50MB"}.`)
            return
        }

        setIsUploading(true)
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = `${type}s/${fileName}`

        try {
            const { error: uploadError } = await supabase.storage
                .from("form-media")
                .upload(filePath, file)

            if (uploadError) {
                console.error("Upload error:", uploadError)
                // Specific error for bucket missing?
                if (uploadError.message.includes("Bucket not found")) {
                    toast.error("Erro: Bucket de armazenamento não encontrado. Contate o admin.")
                } else {
                    toast.error("Erro ao fazer upload.")
                }
                return
            }

            const { data: { publicUrl } } = supabase.storage
                .from("form-media")
                .getPublicUrl(filePath)

            onChange(publicUrl)
            toast.success("Upload concluído!")
        } catch (error) {
            console.error("Upload exception:", error)
            toast.error("Erro inesperado no upload.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemove = () => {
        onChange("")
    }

    return (
        <div className="flex flex-col gap-3">
            <Label>{label}</Label>

            {!value ? (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
                    <Input
                        type="file"
                        className="hidden"
                        id={`upload-${label}`}
                        onChange={handleUpload}
                        disabled={isUploading}
                        accept={type === "image" ? "image/*" : "video/*"}
                    />
                    <label
                        htmlFor={`upload-${label}`}
                        className="flex flex-col items-center cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                        ) : (
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        )}
                        <span className="text-sm font-medium text-muted-foreground">
                            {isUploading ? "Enviando..." : `Clique para enviar ${type === "image" ? "imagem" : "vídeo"}`}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                            {type === "image" ? "Max 5MB" : "Max 50MB"}
                        </span>
                    </label>
                </div>
            ) : (
                <div className="relative rounded-md overflow-hidden border">
                    {type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={value}
                            alt="Media"
                            className="w-full h-auto max-h-[200px] object-cover"
                        />
                    ) : (
                        <video
                            src={value}
                            controls
                            className="w-full h-auto max-h-[200px]"
                        />
                    )}
                    <Button
                        onClick={handleRemove}
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
