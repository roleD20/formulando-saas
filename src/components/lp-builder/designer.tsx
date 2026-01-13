"use client"

import React from "react"
import { useDroppable } from "@dnd-kit/core"
import { useLPBuilder } from "./context/lp-builder-context"
import { cn } from "@/lib/utils"
import { CanvasElement } from "./canvas-element"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

export function Designer() {
    const { elements, previewDevice, mode } = useLPBuilder()

    // Main droppable area for the canvas
    const { isOver, setNodeRef } = useDroppable({
        id: "canvas-droppable",
        data: {
            isCanvas: true,
        }
    })

    // Responsive widths based on device
    const deviceWidths = {
        desktop: 'w-full',
        tablet: 'w-full max-w-[768px]',
        mobile: 'w-full max-w-[375px]'
    }

    return (
        <div className="w-full min-h-full flex justify-center py-8">
            <div
                ref={setNodeRef}
                className={cn(
                    "min-h-[800px] bg-white rounded-xl shadow-lg transition-all duration-300 flex flex-col overflow-hidden border border-slate-200",
                    deviceWidths[previewDevice],
                    isOver && "bg-slate-50 ring-2 ring-primary/20",
                    // Allow height to grow
                    "h-fit"
                )}
            >
                {/* MacOS Window Header */}
                <div className="h-10 bg-slate-100 border-b flex items-center px-4 gap-2 flex-shrink-0">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer" />
                        <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer" />
                    </div>

                    {/* URL bar simulation */}
                    <div className="flex-1 flex justify-center ml-2">
                        <div className="bg-white/60 h-6 px-4 rounded-md items-center flex text-xs text-muted-foreground w-2/3 justify-center shadow-sm border border-slate-200/50">
                            {previewDevice === 'mobile' ? 'mysite.com (Mobile)' : previewDevice === 'tablet' ? 'mysite.com (Tablet)' : 'mysite.com'}
                        </div>
                    </div>

                    {/* Spacer to balance the layout */}
                    <div className="w-[52px]" />
                </div>

                <div className="flex-1 p-8 flex flex-col">
                    {elements.length === 0 && !isOver && mode === 'builder' && (
                        <div className="flex-1 min-h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md bg-slate-50/50">
                            Arraste componentes aqui
                        </div>
                    )}

                    <SortableContext items={elements.map(e => e.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col flex-1 divide-y divide-transparent">
                            {elements.map(element => (
                                <CanvasElement key={element.id} element={element} />
                            ))}
                        </div>
                    </SortableContext>
                </div>
            </div>
        </div>
    )
}
