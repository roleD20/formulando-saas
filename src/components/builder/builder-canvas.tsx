"use client"

import { useBuilder } from "@/context/builder-context"
import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { FormElements } from "./form-elements"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { FileText, Sparkles, Grip, Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface BuilderCanvasProps {
    onOpenTemplates?: () => void
    onOpenAIChat?: () => void
}

export function BuilderCanvas({ onOpenTemplates, onOpenAIChat }: BuilderCanvasProps) {
    const { elements, selectedElement, setSelectedElement, settings } = useBuilder()

    const { setNodeRef, isOver } = useDroppable({
        id: "designer-drop-area",
        data: {
            isDesignerDropArea: true,
        },
    })


    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-form-theme input, 
                .custom-form-theme textarea, 
                .custom-form-theme select {
                    background-color: var(--input-bg) !important;
                    border-color: var(--input-border) !important;
                    border-radius: var(--input-radius) !important;
                    color: var(--input-text) !important;
                }

                /* Override disabled styles for Builder Preview */
                .custom-form-theme input:disabled,
                .custom-form-theme textarea:disabled,
                .custom-form-theme select:disabled {
                    opacity: 1 !important;
                    background-color: var(--input-bg) !important;
                    border-color: var(--input-border) !important;
                    color: var(--input-text) !important;
                    -webkit-text-fill-color: var(--input-text) !important; /* Safari fix */
                    cursor: default !important;
                }

                .custom-form-theme label,
                .custom-form-theme span,
                .custom-form-theme p {
                    color: var(--label-text) !important;
                }
                /* Exclude UI buttons (like delete) from being styled */
                .custom-form-theme button:not(.ui-btn) {
                   /* Intentionally blank for now as we don't have submit buttons in builder yet usually */
                }

                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent; 
                }
                ::-webkit-scrollbar-thumb {
                    background: #cbd5e1; 
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8; 
                }
                .dark ::-webkit-scrollbar-thumb {
                    background: #334155;
                }
                .dark ::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}} />
            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 w-full bg-accent/30 rounded-xl m-4 p-4 overflow-y-auto h-full flex flex-col items-center justify-start transition-all custom-form-theme",
                    isOver && "ring-2 ring-primary/50 bg-accent/50"
                )}
                style={{
                    backgroundColor: settings.design.theme?.page.backgroundColor || 'transparent',
                    // We inject the rest as CSS Variables for child components to consume
                    // @ts-ignore
                    "--input-bg": settings.design.theme?.inputs.backgroundColor || '#ffffff',
                    "--input-border": settings.design.theme?.inputs.borderColor || '#e2e8f0',
                    "--input-radius": `${settings.design.theme?.inputs.borderRadius || 4}px`,
                    "--input-text": settings.design.theme?.inputs.textColor || '#000000',
                    "--label-text": settings.design.theme?.labels.textColor || '#000000',
                    "--btn-bg": settings.design.theme?.buttons.backgroundColor || '#2563EB',
                    "--btn-text": settings.design.theme?.buttons.textColor || '#ffffff',
                    "--btn-radius": `${settings.design.theme?.buttons.borderRadius || 4}px`,
                } as React.CSSProperties}
            >
                {!elements.length && (
                    <div className="flex flex-col items-center justify-center h-full w-full gap-10 opacity-100 transition-all duration-500">
                        <div className="flex flex-col items-center gap-6 text-center max-w-lg p-10 border-2 border-dashed border-primary/20 rounded-3xl bg-background/50 backdrop-blur-sm hover:border-primary/40 transition-colors">
                            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-inner">
                                <Grip className="h-12 w-12 text-primary animate-pulse duration-[3000ms]" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                    Comece seu formulário
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Arraste os campos da barra lateral para esta área ou escolha uma das opções abaixo para acelerar.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
                            {onOpenTemplates && (
                                <Button
                                    variant="outline"
                                    className="flex-1 h-32 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300 rounded-2xl border-2"
                                    onClick={onOpenTemplates}
                                >
                                    <div className="p-3 rounded-full bg-background shadow-sm">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="font-bold text-lg">Usar Template</span>
                                        <span className="text-sm text-muted-foreground">Modelos prontos</span>
                                    </div>
                                </Button>
                            )}
                            {onOpenAIChat && (
                                <Button
                                    variant="outline"
                                    className="flex-1 h-32 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300 rounded-2xl border-2"
                                    onClick={onOpenAIChat}
                                >
                                    <div className="p-3 rounded-full bg-background shadow-sm">
                                        <Sparkles className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="font-bold text-lg">Criar com IA</span>
                                        <span className="text-sm text-muted-foreground">Descreva e gere</span>
                                    </div>
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {elements.length > 0 && (
                    <div className="flex flex-col w-full gap-2 p-4 max-w-[900px]">
                        <SortableContext items={elements} strategy={verticalListSortingStrategy}>
                            {elements.map(element => (
                                <SortableElement key={element.id} element={element} />
                            ))}
                        </SortableContext>
                    </div>
                )}
            </div>
        </>
    )
}

function SortableElement({ element }: { element: any }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: element.id,
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true,
        }
    })

    const { selectedElement, setSelectedElement, removeElement } = useBuilder()

    const formElement = FormElements[element.type as keyof typeof FormElements]

    if (!formElement) {
        return null // Or render an error placeholder
    }

    const DesignerElement = formElement.designerComponent
    const isSelected = selectedElement?.id === element.id

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    }

    const handleDelete = () => {
        removeElement(element.id)
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn("relative flex flex-col text-foreground hover:cursor-pointer rounded-xl transition-all duration-200 group/item",
                isSelected
                    ? "ring-2 ring-primary bg-primary/5 shadow-md z-10 scale-[1.01]"
                    : "hover:bg-muted/50 border border-transparent hover:border-muted-foreground/20"
            )}
            onClick={(e) => {
                e.stopPropagation()
                setSelectedElement(element)
            }}
        >
            {/* Visual Indicator for DnD Handle */}
            <div className="absolute top-0 w-full h-full rounded-xl pointer-events-none group-hover/item:border-primary/20 transition-all" />

            {/* Custom Delete Button */}
            {isSelected && (
                <div className="absolute -top-3 -right-3 z-20 animate-in zoom-in duration-200">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                size="icon"
                                variant="destructive"
                                className="h-7 w-7 rounded-full shadow-lg hover:scale-110 transition-transform"
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Essa ação não pode ser desfeita. Isso excluirá permanentemente este componente.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete()
                                    }}
                                >
                                    Confirmar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}

            {/* Element Helper Label (Top Left) */}
            {isSelected && (
                <div className="absolute -top-3 -left-1 z-20 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <span className="bg-primary text-primary-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {formElement.designerBtnElement.label}
                    </span>
                </div>
            )}

            <div className="min-h-[120px] h-auto flex items-center justify-center pointer-events-none opacity-100 p-4">
                <DesignerElement elementInstance={element} />
            </div>
        </div>
    )
}
