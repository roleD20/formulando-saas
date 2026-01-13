"use client"

import React, { useEffect, useState } from "react"
import { useLPBuilder } from "../context/lp-builder-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
    Github,
    Globe,
    Mail,
    Plus,
    Trash2,
    ArrowRight,
    ArrowDown,
    Share2
} from "lucide-react"

const SOCIAL_PLATFORMS = [
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'mail', label: 'Email', icon: Mail },
    { value: 'website', label: 'Website', icon: Globe },
]

export function SocialControl() {
    const { selectedElement, updateElement } = useLPBuilder()

    // Default values if not set
    const properties = selectedElement?.properties || {}
    const items = properties.items || [
        { platform: 'instagram', url: 'https://instagram.com' },
        { platform: 'facebook', url: 'https://facebook.com' }
    ]
    const layout = properties.layout || 'horizontal' // horizontal | vertical
    const gap = properties.gap || 16
    const iconSize = properties.iconSize || 24
    const borderRadius = properties.borderRadius || 4

    // Styles
    const iconColor = properties.iconColor || "#ffffff"
    const backgroundColor = properties.backgroundColor || "#000000"

    const updateProperties = (newProps: any) => {
        updateElement(selectedElement!.id, {
            properties: { ...properties, ...newProps }
        })
    }

    const handleAddItem = () => {
        const newItems = [...items, { platform: 'website', url: '' }]
        updateProperties({ items: newItems })
    }

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_: any, i: number) => i !== index)
        updateProperties({ items: newItems })
    }

    const handleUpdateItem = (index: number, field: string, value: string) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        updateProperties({ items: newItems })
    }

    if (!selectedElement || selectedElement.type !== 'social') return null

    return (
        <div className="space-y-6">
            {/* Main Layout Controls */}
            <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Layout
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs">Direção</Label>
                        <div className="flex bg-muted p-1 rounded-md">
                            <Button
                                variant={layout === 'horizontal' ? "secondary" : "ghost"}
                                size="sm"
                                className="flex-1 h-7 text-xs"
                                onClick={() => updateProperties({ layout: 'horizontal' })}
                            >
                                <ArrowRight className="w-3 h-3 mr-1" /> Horiz.
                            </Button>
                            <Button
                                variant={layout === 'vertical' ? "secondary" : "ghost"}
                                size="sm"
                                className="flex-1 h-7 text-xs"
                                onClick={() => updateProperties({ layout: 'vertical' })}
                            >
                                <ArrowDown className="w-3 h-3 mr-1" /> Vert.
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Espaçamento (gap)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                className="h-8 text-xs"
                                value={gap}
                                onChange={(e) => updateProperties({ gap: parseInt(e.target.value) || 0 })}
                            />
                            <span className="text-xs text-muted-foreground">px</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 border-t pt-4">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Estilo dos Ícones
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs">Cor do Ícone</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={iconColor}
                                onChange={(e) => updateProperties({ iconColor: e.target.value })}
                                className="w-8 h-8 p-0 border-none cursor-pointer"
                            />
                            <Input
                                value={iconColor}
                                onChange={(e) => updateProperties({ iconColor: e.target.value })}
                                className="h-8 text-xs flex-1"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Cor do Fundo</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => updateProperties({ backgroundColor: e.target.value })}
                                className="w-8 h-8 p-0 border-none cursor-pointer"
                            />
                            <Input
                                value={backgroundColor}
                                onChange={(e) => updateProperties({ backgroundColor: e.target.value })}
                                className="h-8 text-xs flex-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs">Tamanho (px)</Label>
                        <Input
                            type="number"
                            className="h-8 text-xs"
                            value={iconSize}
                            onChange={(e) => updateProperties({ iconSize: parseInt(e.target.value) || 16 })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Arredondamento</Label>
                        <Input
                            type="number"
                            className="h-8 text-xs"
                            value={borderRadius}
                            onChange={(e) => updateProperties({ borderRadius: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 border-t pt-4">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                    Items
                </h3>

                <div className="space-y-3">
                    {items.map((item: any, index: number) => (
                        <div key={index} className="flex flex-col gap-2 p-3 border rounded-md bg-white">
                            <div className="flex items-center gap-2">
                                <Select
                                    value={item.platform}
                                    onValueChange={(val) => handleUpdateItem(index, 'platform', val)}
                                >
                                    <SelectTrigger className="h-8 text-xs w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SOCIAL_PLATFORMS.map(p => (
                                            <SelectItem key={p.value} value={p.value}>
                                                <div className="flex items-center gap-2">
                                                    <p.icon className="w-3 h-3" />
                                                    {p.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 ml-auto text-muted-foreground hover:text-red-500"
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <Input
                                value={item.url}
                                onChange={(e) => handleUpdateItem(index, 'url', e.target.value)}
                                placeholder="https://..."
                                className="h-8 text-xs"
                            />
                        </div>
                    ))}

                    <Button variant="outline" size="sm" className="w-full text-xs" onClick={handleAddItem}>
                        <Plus className="w-3 h-3 mr-2" /> Adicionar Item
                    </Button>
                </div>
            </div>
        </div>
    )
}
