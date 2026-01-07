"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Save, Settings, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BuilderHeaderProps {
    onSave: () => void
    onPreview: () => void
    projectName: string
    onProjectNameChange: (name: string) => void
}

export function BuilderHeader({
    onSave,
    onPreview,
    projectName,
    onProjectNameChange
}: BuilderHeaderProps) {
    return (
        <nav className="flex justify-between border-b-2 border-muted p-4 gap-3 items-center bg-background">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>

                <div className="flex flex-col">
                    <Input
                        className="bg-transparent border-0 text-lg font-bold p-0 h-auto focus-visible:ring-0 px-2 truncate min-w-[150px]"
                        value={projectName}
                        onChange={(e) => onProjectNameChange(e.target.value)}
                    />
                    <span className="text-xs text-muted-foreground px-2">Clique para editar</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={onPreview}>
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Visualizar</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={onSave}>
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">Salvar</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Configurações</span>
                </Button>
            </div>
        </nav>
    )
}
