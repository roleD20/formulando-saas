"use client"

import React, { useState } from "react"
import { useLPBuilder } from "./context/lp-builder-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { SidebarFormProperties } from "./properties/form-properties"
import { ImageUploadProperty } from "./properties/image-upload"
import { SpacingControl, BorderRadiusControl } from "./properties/spacing-control"
import { BackgroundControl } from "./properties/background-control"
import { FlexControl } from "./properties/flex-control"
import { SizeControl } from "./properties/size-control"
import { ColumnsControl } from "./properties/columns-control"
import { ButtonControl } from "./properties/button-control"
import { SocialControl } from "./properties/social-control"
import { VideoControl } from "./properties/video-control"
import { CustomHtmlControl } from "./properties/custom-html-control"
import { Monitor, Tablet, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { ResponsiveStyleProvider } from "./context/responsive-style-context"

type EditingDevice = 'desktop' | 'tablet' | 'mobile'

export function SidebarRight() {
    const { selectedElement, updateElement, removeElement } = useLPBuilder()
    const [editingDevice, setEditingDevice] = useState<EditingDevice>('desktop')

    if (!selectedElement) {
        return (
            <div className="w-80 border-l bg-white p-4 h-full overflow-y-auto">
                <div className="text-xs font-semibold uppercase text-muted-foreground mb-4">Propriedades</div>
                <div className="text-sm text-muted-foreground text-center mt-10">
                    Selecione um elemento para editar
                </div>
            </div>
        )
    }

    const handleChange = (key: string, value: any) => {
        updateElement(selectedElement.id, { [key]: value })
    }

    const handleStyleChange = (styleKey: string, value: any) => {
        if (editingDevice === 'desktop') {
            // Desktop styles go to base styles
            updateElement(selectedElement.id, {
                styles: {
                    ...selectedElement.styles,
                    [styleKey]: value
                }
            })
        } else {
            // Mobile/Tablet styles go to responsiveStyles
            const newResponsiveStyles = {
                ...selectedElement.responsiveStyles,
                [editingDevice]: {
                    ...selectedElement.responsiveStyles?.[editingDevice],
                    [styleKey]: value
                }
            }

            console.log('🎨 Updating responsive styles:', {
                device: editingDevice,
                styleKey,
                value,
                before: selectedElement.responsiveStyles,
                after: newResponsiveStyles
            })

            updateElement(selectedElement.id, {
                responsiveStyles: newResponsiveStyles
            })
        }
    }

    // Get current style value considering device inheritance
    const getCurrentStyleValue = (styleKey: string) => {
        if (editingDevice === 'desktop') {
            return selectedElement.styles?.[styleKey] || ''
        }
        // For mobile/tablet, show responsive value if set, otherwise show inherited desktop value
        return selectedElement.responsiveStyles?.[editingDevice]?.[styleKey] || selectedElement.styles?.[styleKey] || ''
    }

    return (
        <div className="w-80 border-l bg-white flex flex-col h-full bg-slate-50/50">
            <div className="p-4 border-b bg-white">
                <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Editando</div>
                <div className="font-medium capitalize flex items-center justify-between">
                    {selectedElement.type}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:bg-red-50"
                        onClick={() => removeElement(selectedElement.id)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                    </Button>
                </div>
            </div>

            {/* Device Selector Tabs */}
            <div className="p-3 border-b bg-white">
                <div className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">Editando Estilos Para</div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
                    <button
                        onClick={() => setEditingDevice('desktop')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-medium transition-colors",
                            editingDevice === 'desktop' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Monitor className="h-3.5 w-3.5" />
                        Desktop
                    </button>
                    <button
                        onClick={() => setEditingDevice('tablet')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-medium transition-colors",
                            editingDevice === 'tablet' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Tablet className="h-3.5 w-3.5" />
                        Tablet
                    </button>
                    <button
                        onClick={() => setEditingDevice('mobile')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-medium transition-colors",
                            editingDevice === 'mobile' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Smartphone className="h-3.5 w-3.5" />
                        Mobile
                    </button>
                </div>
                {editingDevice !== 'desktop' && (
                    <div className="mt-2 text-[10px] text-muted-foreground bg-blue-50 border border-blue-200 rounded p-2">
                        💡 Valores vazios herdam do Desktop
                    </div>
                )}
            </div>

            <ResponsiveStyleProvider editingDevice={editingDevice}>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Content Section */}
                    {['heading', 'text', 'button'].includes(selectedElement.type) && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold uppercase text-muted-foreground">Conteúdo</h3>
                            <div className="space-y-1">
                                <Label className="text-xs">Texto</Label>
                                <Input
                                    value={selectedElement.content || ''}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {selectedElement.type === 'image' && (
                        <ImageUploadProperty />
                    )}

                    {selectedElement.type === 'form' && (
                        <SidebarFormProperties />
                    )}

                    {selectedElement.type === 'form' && (
                        <SidebarFormProperties />
                    )}

                    {selectedElement.type === 'button' && (
                        <>
                            <ButtonControl />
                        </>
                    )}


                    {selectedElement.type === 'social' && (
                        <>
                            <SocialControl />
                            <Separator className="my-4" />
                        </>
                    )}

                    {selectedElement.type === 'video' && (
                        <>
                            <VideoControl />
                            <Separator className="my-4" />
                        </>
                    )}

                    {selectedElement.type === 'custom-html' && (
                        <>
                            <CustomHtmlControl />
                            <Separator className="my-4" />
                        </>
                    )}

                    <Separator />

                    {/* Layout Section for Containers */}
                    {['section', 'container'].includes(selectedElement.type) && (
                        <>
                            <div className="space-y-4">
                                <h3 className="text-xs font-semibold uppercase text-muted-foreground">Layout</h3>
                                <ColumnsControl />
                                <SizeControl />
                                <Separator className="my-4" />
                                <FlexControl />
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Styles Section (Unified) */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase text-muted-foreground">Estilos</h3>

                        {/* Spacing (Margin & Padding) - Available for all relevant visible elements */}
                        {['section', 'container', 'button', 'social', 'image', 'video', 'text', 'heading'].includes(selectedElement.type) && (
                            <div className="space-y-4">
                                <SpacingControl type="margin" />
                                <SpacingControl type="padding" />
                            </div>
                        )}

                        <Separator className="my-4" />

                        {/* Decorations (Border Radius) */}
                        {['container', 'video', 'image', 'button'].includes(selectedElement.type) && (
                            <>
                                <BorderRadiusControl />
                                <Separator className="my-4" />
                            </>
                        )}

                        {/* Background Image Control */}
                        {['section', 'container'].includes(selectedElement.type) && (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Background Image</h4>
                                <BackgroundControl />
                                <Separator className="my-4" />
                            </div>
                        )}
                    </div>

                    {/* Generic Typography & Colors (Hide for Button as it has its own) */}
                    {!['button', 'form'].includes(selectedElement.type) && (
                        <>
                            <div className="space-y-1">
                                <Label className="text-xs">Background Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        className="w-10 h-10 p-1 cursor-pointer"
                                        value={getCurrentStyleValue('backgroundColor') || '#ffffff'}
                                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                    />
                                    <Input
                                        value={getCurrentStyleValue('backgroundColor')}
                                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                        placeholder="#ffffff"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Text Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        className="w-10 h-10 p-1 cursor-pointer"
                                        value={getCurrentStyleValue('color') || '#000000'}
                                        onChange={(e) => handleStyleChange('color', e.target.value)}
                                    />
                                    <Input
                                        value={getCurrentStyleValue('color')}
                                        onChange={(e) => handleStyleChange('color', e.target.value)}
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>

                            {/* Typography */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs">Font Size</Label>
                                    <Input
                                        value={getCurrentStyleValue('fontSize')}
                                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                        placeholder="16px"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Text Align</Label>
                                    <select
                                        className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
                                        value={getCurrentStyleValue('textAlign') || 'left'}
                                        onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                                    >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                        <option value="justify">Justify</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </ResponsiveStyleProvider>
        </div>
    )
}
