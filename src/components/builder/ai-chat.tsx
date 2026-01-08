"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Sparkles, Loader2, Wand2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { generateFormWithAI } from "@/actions/form"
import { FormElementInstance } from "@/context/builder-context"
import { toast } from "sonner"
import { LoadingOverlay } from "@/components/builder/loading-overlay"

interface AIChatProps {
    open: boolean
    onClose: () => void
    elements: FormElementInstance[]
    onElementsChange: (elements: FormElementInstance[]) => void
}

const QUICK_SUGGESTIONS_CREATE = [
    "Captação de leads",
    "Evento",
    "Vendas",
    "Suporte",
    "Pesquisa de satisfação",
    "Cadastro de usuário"
]

const QUICK_SUGGESTIONS_EDIT = [
    "Adicionar campo de telefone",
    "Mudar título para 'Contato'",
    "Remover campos opcionais",
    "Adicionar validação de e-mail",
    "Simplificar o formulário",
    "Adicionar pergunta de NPS"
]

export function AIChat({ open, onClose, elements, onElementsChange }: AIChatProps) {
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const isEditing = elements.length > 0
    const suggestions = isEditing ? QUICK_SUGGESTIONS_EDIT : QUICK_SUGGESTIONS_CREATE

    useEffect(() => {
        if (open && inputRef.current) {
            // Small delay to allow animation to start
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [open])

    const handleSend = async () => {
        if (!input.trim() || loading) return

        setLoading(true)

        try {
            // We pass independent copy of elements to avoid circular references or mutations
            const currentContext = JSON.parse(JSON.stringify(elements))
            const result = await generateFormWithAI(input.trim(), currentContext)

            if (result.success && result.elements) {
                // Determine if we should append or replace
                // Logic: The server action now returns the FULL form state if editing, 
                // or the new form if creating.
                // Since we passed "currentContext", the server returns the COMPLETE new state.
                // So we just REPLACE.

                onElementsChange(result.elements)

                if (isEditing) {
                    toast.success("Formulário atualizado com sucesso!")
                } else {
                    toast.success(`Formulário gerado com ${result.elements.length} campos!`)
                }

                onClose()
                setInput("")
            } else {
                toast.error(result.error || "Erro ao gerar formulário")
            }
        } catch (error) {
            console.error("Error generating form:", error)
            toast.error("Erro ao gerar formulário")
        } finally {
            setLoading(false)
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion)
        if (inputRef.current) {
            // Wait for queue
            setTimeout(() => inputRef.current?.focus(), 0)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    if (loading) {
        return <LoadingOverlay />
    }

    if (!open) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 flex justify-center pointer-events-none">
            <div className="pointer-events-auto w-full max-w-3xl animate-in slide-in-from-bottom-10 fade-in duration-300">
                <Card className="border-2 border-primary/20 shadow-2xl bg-background/95 backdrop-blur-xl rounded-2xl overflow-hidden relative">
                    {/* Close button absolute */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute right-2 top-2 h-6 w-6 rounded-full hover:bg-muted text-muted-foreground z-10"
                    >
                        <X className="h-3 w-3" />
                    </Button>

                    <div className="p-1">
                        {/* Suggestions */}
                        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2">
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 mr-1">
                                <Sparkles className="h-3 w-3" /> {isEditing ? "Sugestões de edição:" : "Sugestões:"}
                            </span>
                            {suggestions.map((suggestion) => (
                                <Badge
                                    key={suggestion}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all text-xs py-0.5 px-2 bg-muted/50 border-muted-foreground/20"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </Badge>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="flex items-center gap-3 p-2 pl-4">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                <Wand2 className="h-5 w-5 text-primary-foreground" />
                            </div>

                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={loading
                                    ? "Processando..."
                                    : isEditing
                                        ? "O que você gostaria de alterar no formulário?"
                                        : "Descreva o formulário... (ex: 'Cadastro de leads')"
                                }
                                className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent text-lg placeholder:text-muted-foreground/50 h-auto py-2"
                            />

                            <Button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                size="sm"
                                className="h-10 px-6 rounded-xl font-semibold shadow-sm transition-all text-background hover:scale-105 active:scale-95"
                            >
                                {isEditing ? "Atualizar" : "Criar"}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
