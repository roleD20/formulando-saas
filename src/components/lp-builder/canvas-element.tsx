"use client"

import React from "react"
import { LPElement } from "./types"
import { cn } from "@/lib/utils"
import { useLPBuilder } from "./context/lp-builder-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDroppable } from "@dnd-kit/core"
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Github, Globe, Mail } from "lucide-react"
import { EmbeddedForm } from "./embedded-form"

const getSocialIcon = (platform: string) => {
    switch (platform) {
        case 'facebook': return Facebook
        case 'instagram': return Instagram
        case 'linkedin': return Linkedin
        case 'twitter': return Twitter
        case 'youtube': return Youtube
        case 'github': return Github
        case 'mail': return Mail
        default: return Globe
    }
}

// Helper to merge refs
function useMergeRefs<T = any>(...refs: (React.MutableRefObject<T> | React.LegacyRef<T>)[]) {
    return React.useCallback(
        (current: T | null) => {
            refs.forEach((ref) => {
                if (typeof ref === 'function') {
                    ref(current)
                } else if (ref != null) {
                    (ref as React.MutableRefObject<T | null>).current = current
                }
            })
        },
        [refs]
    )
}

export function CanvasElement({ element }: { element: LPElement }) {
    const { addElement, selectedElement, setSelectedElement, previewDevice, mode } = useLPBuilder()

    // 1. Sortable Logic (Being dragged / Layout position)
    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: element.id,
        data: {
            type: element.type,
            elementId: element.id,
            isContainer: element.type === 'container' || element.type === 'section',
            sortable: true,
        }
    })

    // 2. Droppable Logic (Receiving drops - Nesting)
    // Only for containers
    const { isOver, setNodeRef: setDroppableRef } = useDroppable({
        id: element.id + "-drop-zone",
        data: {
            isContainer: element.type === 'container' || element.type === 'section',
            elementId: element.id
        },
        disabled: element.type !== 'container' && element.type !== 'section'
    })

    // Merge refs if it's a container (needs both). If not, just sortable.
    const setRefs = useMergeRefs(setSortableRef, setDroppableRef)

    const isSelected = selectedElement?.id === element.id

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedElement(element)
    }

    // Merge base styles with responsive styles based on current device
    // Using useMemo to ensure recalculation when previewDevice changes
    const responsiveStyles = React.useMemo(() => {
        const baseStyles = element.styles || {}
        const deviceStyles = element.responsiveStyles?.[previewDevice] || {}

        const merged = {
            ...baseStyles,
            ...deviceStyles
        }

        // Debug: Log when responsive styles are applied
        if (element.responsiveStyles && Object.keys(element.responsiveStyles).length > 0) {
            console.log('📱 Canvas Element Responsive Styles:', {
                elementType: element.type,
                elementId: element.id.slice(0, 8),
                currentDevice: previewDevice,
                hasResponsiveStyles: !!element.responsiveStyles,
                availableDevices: Object.keys(element.responsiveStyles),
                baseStyles,
                deviceStyles,
                merged
            })
        }

        // Remove default dashed border if not in builder mode
        if (mode !== 'builder') {
            const newStyles = { ...merged }

            // Check shorthand border
            if (newStyles.border?.includes('dashed')) {
                delete newStyles.border
            }

            // Check individual properties
            if (newStyles.borderStyle === 'dashed' || newStyles.borderStyle?.includes('dashed')) {
                delete newStyles.borderStyle
                delete newStyles.borderWidth
                delete newStyles.borderColor
            }

            return newStyles
        }

        return merged
    }, [element.styles, element.responsiveStyles, previewDevice, element.id, element.type, mode])

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...responsiveStyles // Apply merged responsive styles
    } as React.CSSProperties

    // Common props
    const commonProps = {
        ref: (element.type === 'container' || element.type === 'section') ? setRefs : setSortableRef,
        ...attributes,
        ...listeners,
        onClick: handleClick,
        className: cn(
            "relative transition-all box-border outline-none group",
            isSelected && "ring-2 ring-primary z-20", // Higher Z for selected
            isOver && "bg-primary/10 ring-2 ring-primary/50",
            !isSelected && !isOver && "hover:ring-1 hover:ring-primary/30",
            isDragging && "opacity-50",
        ),
        style: style
    }

    // Children Rendering
    const childrenRenderer = (
        <React.Fragment>
            {/* Selection Handle */}
            <div
                className={cn(
                    "absolute -top-6 left-0 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-t-md cursor-pointer z-[60]",
                    isSelected && mode === 'builder' ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity",
                    mode === 'preview' && "hidden" // Hide handle in preview
                )}
                onMouseDown={(e) => {
                    e.stopPropagation() // Prevent drag start when clicking handle?
                    // Actually we want click.
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    setSelectedElement(element)
                }}
            >
                {element.type}
            </div>

            <SortableContext items={element.children?.map(c => c.id) || []} strategy={verticalListSortingStrategy}>
                {element.children?.map(child => (
                    <CanvasElement key={child.id} element={child} />
                ))}
            </SortableContext>
        </React.Fragment>
    )

    // Render based on type
    if (element.type === 'section') {
        const isEmpty = !element.children || element.children.length === 0
        return (
            <section
                {...commonProps}
                className={cn(
                    commonProps.className,
                    "min-h-[150px] transition-all",
                    mode === 'builder' && "border-2 border-dashed rounded-md", // Conditional border
                    mode === 'builder' && (isOver ? "border-primary bg-primary/5" : "border-slate-300 bg-white"),
                    isEmpty && mode === 'builder' && "flex items-center justify-center"
                )}
            >
                {isEmpty && !isOver && mode === 'builder' && (
                    <div className="text-slate-400 text-sm pointer-events-none">
                        Arraste componentes aqui
                    </div>
                )}
                {childrenRenderer}
            </section>
        )
    }

    if (element.type === 'container') {
        const isEmpty = !element.children || element.children.length === 0
        return (
            <div
                {...commonProps}
                className={cn(
                    commonProps.className,
                    "min-h-[100px] transition-all",
                    mode === 'builder' && "border-2 border-dashed rounded",
                    mode === 'builder' && (isOver ? "border-primary bg-primary/10" : "border-slate-300 bg-slate-50"),
                    isEmpty && mode === 'builder' && "flex items-center justify-center"
                )}
            >
                {isEmpty && !isOver && mode === 'builder' && (
                    <div className="text-slate-400 text-sm pointer-events-none">
                        Arraste componentes aqui
                    </div>
                )}
                {childrenRenderer}
            </div>
        )
    }

    // For text-based elements, we can keep using commonProps. ref will be setSortableRef (from check above)
    if (element.type === 'heading') {
        return (
            <h2 {...commonProps} className={cn(commonProps.className, "text-2xl font-bold p-2 cursor-text")}>
                {element.content}
            </h2>
        )
    }

    if (element.type === 'text') {
        return (
            <p {...commonProps} className={cn(commonProps.className, "p-2 cursor-text")}>
                {element.content}
            </p>
        )
    }

    if (element.type === 'button') {
        // Hook for hover state
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isHovered, setIsHovered] = React.useState(false)

        // Merge normal styles with hover styles if hovered
        const finalStyles = {
            ...commonProps.style,
            ...(isHovered ? element.properties?.hoverStyles : {})
        }

        // Font Injection (Simple approach: append link to head if not exists)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            const fontFamily = element.styles?.fontFamily
            if (fontFamily) {
                // Extract font name from string like "'Inter', sans-serif" -> "Inter"
                const match = fontFamily.match(/['"](.*?)['"]/)
                if (match && match[1]) {
                    const fontName = match[1]
                    const linkId = `font-${fontName}`
                    if (!document.getElementById(linkId)) {
                        const link = document.createElement('link')
                        link.id = linkId
                        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;600;700&display=swap`
                        link.rel = 'stylesheet'
                        document.head.appendChild(link)
                    }
                }
            }
        }, [element.styles?.fontFamily])

        return (
            <a
                {...commonProps}
                href={element.url || "#"}
                onClick={(e) => {
                    e.preventDefault() // Prevent navigation in builder
                    commonProps.onClick(e)
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(commonProps.className, "inline-block text-center px-4 py-2 rounded transition-colors duration-200")}
                style={finalStyles}
            >
                {element.content || "Clique aqui"}
            </a>
        )
    }

    if (element.type === 'social') {
        const properties = element.properties || {}
        const items = properties.items || [
            { platform: 'instagram', url: '#' },
            { platform: 'facebook', url: '#' }
        ]
        const layout = properties.layout || 'horizontal'
        const gap = properties.gap !== undefined ? properties.gap : 16
        const iconSize = properties.iconSize || 24
        const borderRadius = properties.borderRadius || 4
        const iconColor = properties.iconColor || "#ffffff"
        const backgroundColor = properties.backgroundColor || "#000000"

        // Map platform string to Lucide icon component dynamically?
        // We can import them all and map manually to avoid large bundles issues if needed, or just import commonly used ones at top.
        // For now, I will assume we import necessary ones or use a helper. 
        // Actually, let's map generic icons here.
        // Wait, I need to import them in CanvasElement too.

        return (
            <div
                {...commonProps}
                className={cn(commonProps.className, "flex")}
                style={{
                    ...commonProps.style,
                    flexDirection: layout === 'horizontal' ? 'row' : 'column',
                    gap: `${gap}px`,
                    alignItems: 'center',
                    justifyContent: 'center', // Default center for social icons usually?
                    padding: '10px' // Default padding to be clickable easily
                }}
            >
                {items.map((item: any, idx: number) => {
                    const PlatformIcon = getSocialIcon(item.platform)
                    return (
                        <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.preventDefault()
                            }}
                            className="flex items-center justify-center transition-opacity hover:opacity-80"
                            style={{
                                width: `${iconSize + 16}px`, // Padding included in size or extra? User asked for icon size. Background usually is bigger.
                                height: `${iconSize + 16}px`,
                                borderRadius: `${borderRadius}px`,
                                backgroundColor: backgroundColor,
                                color: iconColor,
                                fontSize: `${iconSize}px`
                            }}
                        >
                            {PlatformIcon ? <PlatformIcon size={iconSize} /> : null}
                        </a>
                    )
                })}
            </div>
        )
    }



    if (element.type === 'custom-html') {
        return (
            <div
                {...commonProps}
                className={cn(commonProps.className, "p-4 border border-dashed border-yellow-300 bg-yellow-50 rounded min-h-[50px] flex flex-col items-center justify-center text-center")}
                style={commonProps.style} // Should use commonProps.style if finalStyles not defined, but here we don't have hover logic so commonProps.style is fine
            >
                <div className="flex items-center gap-2 text-yellow-700 font-semibold text-sm mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                    HTML Personalizado
                </div>
                <div className="text-xs text-muted-foreground w-full bg-white p-2 rounded border overflow-hidden max-h-[60px] text-left font-mono">
                    {element.content ? (
                        element.content.slice(0, 100) + (element.content.length > 100 ? "..." : "")
                    ) : (
                        <span className="italic text-slate-400">Clique para adicionar código...</span>
                    )}
                </div>
                {/* Overlay to ensure draggable/selectable even if huge content */}
                <div className="absolute inset-0 z-10" />
            </div>
        )
    }

    if (element.type === 'video') {
        const getYoutubeId = (url: string) => {
            if (!url) return null
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
            const match = url.match(regExp)
            return (match && match[2].length === 11) ? match[2] : null
        }

        const videoId = getYoutubeId(element.url || "")

        return (
            <div
                {...commonProps}
                className={cn(commonProps.className, "relative w-full aspect-video bg-slate-100 flex items-center justify-center overflow-hidden rounded-md border border-slate-200")}
                style={commonProps.style}
            >
                {videoId ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full pointer-events-none" // Disable interaction in builder
                    />
                ) : (
                    <div className="flex flex-col items-center text-muted-foreground p-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-50"
                        >
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <polyline points="11 3 11 11 14 8 17 11 17 3" />
                            <circle cx="12" cy="15" r="1" />
                        </svg>
                        <span className="text-xs mt-2 font-medium">Adicione um link do YouTube</span>
                    </div>
                )}
                {/* Overlay to capture selection clicks */}
                <div className="absolute inset-0 z-10" />
            </div>
        )
    }

    if (element.type === 'image') {
        return (
            <div {...commonProps} className={cn(commonProps.className, "overflow-hidden")}>
                <img
                    src={element.url || "https://placehold.co/600x400?text=Imagem"}
                    alt="LP Image"
                    className="w-full h-full object-cover pointer-events-none"
                />
            </div>
        )
    }

    if (element.type === 'form') {
        return (
            <div {...commonProps} className={cn(commonProps.className, "min-h-[100px] bg-white")}>
                {element.properties?.formId ? (
                    <div className={cn("w-full", mode === 'builder' && "pointer-events-none")}>
                        <EmbeddedForm formId={element.properties.formId} />
                    </div>
                ) : (
                    <div className="p-4 border border-dashed rounded bg-slate-50 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[100px]">
                        <p className="font-medium">Formulário</p>
                        <p className="text-xs text-slate-500 mt-1">Selecione um formulário nas propriedades</p>
                    </div>
                )}
            </div>
        )
    }

    return <div {...commonProps}>Unknown Type: {element.type}</div>
}
