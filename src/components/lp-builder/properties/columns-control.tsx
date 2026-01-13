"use client"

import React from "react"
import { useLPBuilder } from "../context/lp-builder-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Minus, Columns } from "lucide-react"

export function ColumnsControl() {
    const { selectedElement, updateElement, addElement, removeElement } = useLPBuilder()

    if (!selectedElement) return null

    // Determine if this is a "Row" (Container with Flex Row)
    const isRow = selectedElement.type === 'container' && selectedElement.styles?.display === 'flex' && selectedElement.styles?.flexDirection === 'row'

    if (!isRow) return null

    const childrenCount = selectedElement.children?.length || 0

    const handleAddColumn = () => {
        // Add a new container child with flex: 1
        const newColumn = {
            id: crypto.randomUUID(),
            type: 'container' as const,
            styles: {
                flex: '1',
                minHeight: '100px',
                border: '1px dashed #ccc',
                padding: '10px'
            },
            children: []
        }

        // Use addElement. We need to add it as a child of selectedElement.
        // addElement(index, element, parentId)
        addElement(childrenCount, newColumn, selectedElement.id)
    }

    const handleRemoveColumn = () => {
        if (childrenCount === 0) return

        // Remove last child
        const lastChild = selectedElement.children?.[childrenCount - 1]
        if (lastChild) {
            removeElement(lastChild.id)
        }
    }

    return (
        <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                <Columns className="w-4 h-4" />
                Gerenciar Colunas
            </h4>

            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-md border">
                <span className="text-xs font-medium text-slate-600">
                    {childrenCount} {childrenCount === 1 ? 'Coluna' : 'Colunas'}
                </span>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleRemoveColumn}
                        disabled={childrenCount <= 1}
                        title="Remover última coluna"
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleAddColumn}
                        title="Adicionar coluna"
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            <p className="text-[10px] text-muted-foreground">
                As colunas são adicionadas com largura igual (Flex: 1). Você pode ajustar a largura de cada uma individualmente selecionando-a.
            </p>
        </div>
    )
}
