"use client"

import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

interface SortableWrapperProps {
    id: string
    children: React.ReactNode
    className?: string
    disabled?: boolean
}

export function SortableWrapper({ id, children, className, disabled }: SortableWrapperProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        disabled
    })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn("relative outline-none", className)} // Ensure relative positioning
        >
            {children}
        </div>
    )
}
