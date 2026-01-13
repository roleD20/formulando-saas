"use client"

import React, { useState, useEffect } from "react"
import { useLPBuilder } from "../context/lp-builder-context"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CodeXml } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CustomHtmlControl() {
    const { selectedElement, updateElement } = useLPBuilder()
    const [html, setHtml] = useState("")

    useEffect(() => {
        if (selectedElement && selectedElement.type === 'custom-html') {
            setHtml(selectedElement.content || "")
        }
    }, [selectedElement])

    const handleHtmlChange = (newHtml: string) => {
        setHtml(newHtml)
        updateElement(selectedElement!.id, { content: newHtml })
    }

    if (!selectedElement || selectedElement.type !== 'custom-html') return null

    return (
        <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <CodeXml className="w-4 h-4" />
                HTML Personalizado
            </h3>

            <Alert className="py-2 bg-yellow-50 border-yellow-200">
                <AlertDescription className="text-[10px] text-yellow-800">
                    O código será executado apenas na página publicada ou modo de visualização. No editor, mostramos apenas um placeholder.
                </AlertDescription>
            </Alert>

            <div className="space-y-2">
                <Label className="text-xs">Código HTML / Scripts</Label>
                <Textarea
                    value={html}
                    onChange={(e) => handleHtmlChange(e.target.value)}
                    placeholder="<div>Meu conteúdo...</div>"
                    className="font-mono text-xs min-h-[200px]"
                />
            </div>
        </div>
    )
}
